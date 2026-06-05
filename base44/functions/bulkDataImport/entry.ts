import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!['admin', 'command_staff'].includes(user.role)) {
      return Response.json({ 
        error: 'Insufficient permissions - Admin or Command Staff required' 
      }, { status: 403 });
    }

    const { 
      fileUrl, 
      entityType, 
      mapping = {},
      validateOnly = false 
    } = await req.json();

    if (!fileUrl || !entityType) {
      return Response.json({ 
        error: 'File URL and entity type are required' 
      }, { status: 400 });
    }

    // Validate entity type exists
    const validEntities = [
      'Incident', 'Asset', 'TravelRoute', 'Alert', 
      'WeaponsDetection', 'SocialMediaIntel', 'ThreatFeed'
    ];

    if (!validEntities.includes(entityType)) {
      return Response.json({ 
        error: `Invalid entity type. Must be one of: ${validEntities.join(', ')}` 
      }, { status: 400 });
    }

    // Get entity schema
    const schema = await base44.entities[entityType].schema();

    // Extract data from file using AI
    const extractionResult = await base44.integrations.Core.ExtractDataFromUploadedFile({
      file_url: fileUrl,
      json_schema: schema
    });

    if (extractionResult.status === 'error') {
      return Response.json({ 
        error: 'Failed to extract data from file',
        details: extractionResult.details
      }, { status: 400 });
    }

    const extractedData = Array.isArray(extractionResult.output) 
      ? extractionResult.output 
      : [extractionResult.output];

    // Validate data
    const validationErrors = [];
    const validRecords = [];

    for (let i = 0; i < extractedData.length; i++) {
      const record = extractedData[i];
      
      // Apply field mapping if provided
      let mappedRecord = { ...record };
      if (Object.keys(mapping).length > 0) {
        mappedRecord = {};
        for (const [targetField, sourceField] of Object.entries(mapping)) {
          if (record[sourceField] !== undefined) {
            mappedRecord[targetField] = record[sourceField];
          }
        }
      }

      // Basic validation - check required fields
      const requiredFields = Object.entries(schema.properties || {})
        .filter(([key, value]) => schema.required?.includes(key))
        .map(([key]) => key);

      const missingFields = requiredFields.filter(field => 
        mappedRecord[field] === undefined || mappedRecord[field] === null
      );

      if (missingFields.length > 0) {
        validationErrors.push({
          recordIndex: i,
          errors: [`Missing required fields: ${missingFields.join(', ')}`],
          record: mappedRecord
        });
      } else {
        validRecords.push(mappedRecord);
      }
    }

    // If validation only mode, return results
    if (validateOnly) {
      return Response.json({
        success: true,
        mode: 'validation',
        totalRecords: extractedData.length,
        validRecords: validRecords.length,
        invalidRecords: validationErrors.length,
        validationErrors: validationErrors,
        sampleValidRecord: validRecords[0] || null,
      });
    }

    // Import valid records
    const importResults = {
      successful: [],
      failed: [],
    };

    for (const record of validRecords) {
      try {
        const created = await base44.entities[entityType].create(record);
        importResults.successful.push({
          id: created.id,
          record: record
        });
      } catch (error) {
        importResults.failed.push({
          record: record,
          error: error.message
        });
      }
    }

    // Log import activity
    await base44.entities.AuditLog?.create({
      action: 'bulk_import',
      entity_type: entityType,
      user_email: user.email,
      details: {
        totalRecords: extractedData.length,
        imported: importResults.successful.length,
        failed: importResults.failed.length,
        fileUrl: fileUrl
      },
      timestamp: new Date().toISOString()
    }).catch(() => {}); // Ignore if AuditLog doesn't exist

    return Response.json({
      success: true,
      mode: 'import',
      summary: {
        totalRecords: extractedData.length,
        validRecords: validRecords.length,
        invalidRecords: validationErrors.length,
        imported: importResults.successful.length,
        failed: importResults.failed.length
      },
      results: importResults,
      validationErrors: validationErrors,
    });

  } catch (error) {
    console.error('Bulk import error:', error);
    
    return Response.json({ 
      error: error.message,
      stack: error.stack 
    }, { status: 500 });
  }
});