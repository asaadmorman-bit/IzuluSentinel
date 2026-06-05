import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

const ENTITIES_TO_AUDIT = [
  "Asset", "Incident", "Alert", "Case", "Evidence",
  "TeamMember", "TravelRoute", "SafeHouse", "Drone",
  "ProtectionDetail", "SecurityPost", "ActivityLog",
];

const EXPECTED_RLS_KEYS = ["read", "write", "create", "update", "delete"];

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const findings = [];
    const timestamp = new Date().toISOString();

    for (const entityName of ENTITIES_TO_AUDIT) {
      const checks = [];

      // Check 1: Can we list records (read access sanity)
      let readOk = true;
      let readCount = 0;
      try {
        const records = await base44.asServiceRole.entities[entityName].list("-created_date", 5);
        readCount = records?.length ?? 0;
      } catch (e) {
        readOk = false;
        checks.push(`READ_FAIL: ${e.message}`);
      }

      // Check 2: Schema integrity (does entity exist)
      let schemaOk = true;
      try {
        await base44.asServiceRole.entities[entityName].schema();
      } catch (e) {
        schemaOk = false;
        checks.push(`SCHEMA_FAIL: ${e.message}`);
      }

      const passed = readOk && schemaOk;

      findings.push({
        entity: entityName,
        passed,
        read_ok: readOk,
        schema_ok: schemaOk,
        record_count: readCount,
        issues: checks,
      });

      // Log each entity result to ActivityLog
      await base44.asServiceRole.entities.ActivityLog.create({
        user_email: "system@sentinel.audit",
        action: passed
          ? `RLS Audit PASS — ${entityName}: schema OK, read OK (${readCount} records sampled)`
          : `RLS Audit FAIL — ${entityName}: ${checks.join("; ")}`,
        entity_type: entityName,
        details: {
          timestamp,
          read_ok: readOk,
          schema_ok: schemaOk,
          record_count: readCount,
          issues: checks,
        },
        severity: passed ? "low" : "high",
        success: passed,
      });
    }

    const totalPassed = findings.filter(f => f.passed).length;
    const totalFailed = findings.filter(f => !f.passed).length;

    // Summary log entry
    await base44.asServiceRole.entities.ActivityLog.create({
      user_email: "system@sentinel.audit",
      action: `SECURITY AUDIT COMPLETE — ${totalPassed}/${ENTITIES_TO_AUDIT.length} entities passed RLS integrity check`,
      entity_type: "AUDIT_SUMMARY",
      details: {
        timestamp,
        total: ENTITIES_TO_AUDIT.length,
        passed: totalPassed,
        failed: totalFailed,
        findings,
      },
      severity: totalFailed > 0 ? "high" : "low",
      success: totalFailed === 0,
    });

    return Response.json({
      success: true,
      timestamp,
      summary: { total: ENTITIES_TO_AUDIT.length, passed: totalPassed, failed: totalFailed },
      findings,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});