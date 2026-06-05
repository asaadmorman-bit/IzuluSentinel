import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Incident, Asset, TravelRoute, IntelligenceReport, TeamMember } from "@/entities/all";
import { Download, FileText, Database } from "lucide-react";
import { format } from "date-fns";

export default function ExportData() {
  const [selectedEntities, setSelectedEntities] = useState([]);
  const [exportFormat, setExportFormat] = useState("csv");
  const [dateRange, setDateRange] = useState("all");
  const [isExporting, setIsExporting] = useState(false);

  const entities = [
    { id: "incidents", name: "Incidents", entity: Incident },
    { id: "assets", name: "Protected Assets", entity: Asset },
    { id: "routes", name: "Travel Routes", entity: TravelRoute },
    { id: "reports", name: "Intelligence Reports", entity: IntelligenceReport },
    { id: "team", name: "Team Members", entity: TeamMember }
  ];

  const toggleEntity = (entityId) => {
    setSelectedEntities(prev =>
      prev.includes(entityId)
        ? prev.filter(id => id !== entityId)
        : [...prev, entityId]
    );
  };

  const exportData = async () => {
    setIsExporting(true);
    try {
      const data = {};
      
      for (const entityId of selectedEntities) {
        const entity = entities.find(e => e.id === entityId);
        if (entity) {
          const records = await entity.entity.list("-created_date");
          data[entityId] = records;
        }
      }

      if (exportFormat === "json") {
        exportJSON(data);
      } else {
        exportCSV(data);
      }
    } catch (error) {
      console.error("Export error:", error);
      alert("Export failed. Please try again.");
    }
    setIsExporting(false);
  };

  const exportJSON = (data) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    downloadFile(blob, `izulu_export_${format(new Date(), "yyyy-MM-dd")}.json`);
  };

  const exportCSV = (data) => {
    Object.entries(data).forEach(([entityName, records]) => {
      if (records.length === 0) return;

      const headers = Object.keys(records[0]);
      const csv = [
        headers.join(","),
        ...records.map(record =>
          headers.map(header => {
            const value = record[header];
            if (typeof value === 'object') return JSON.stringify(value);
            return `"${value}"`;
          }).join(",")
        )
      ].join("\n");

      const blob = new Blob([csv], { type: "text/csv" });
      downloadFile(blob, `${entityName}_${format(new Date(), "yyyy-MM-dd")}.csv`);
    });
  };

  const downloadFile = (blob, filename) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Download className="w-8 h-8 text-[#DC2626]" />
            Export Data
          </h1>
          <p className="text-gray-400">Export your data for backup or analysis</p>
        </div>

        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardHeader>
            <CardTitle className="text-white">Select Data to Export</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {entities.map((entity) => (
              <div key={entity.id} className="flex items-center space-x-2 p-3 bg-[#1a1a1a] rounded-lg">
                <Checkbox
                  id={entity.id}
                  checked={selectedEntities.includes(entity.id)}
                  onCheckedChange={() => toggleEntity(entity.id)}
                />
                <Label
                  htmlFor={entity.id}
                  className="flex-1 text-white cursor-pointer flex items-center gap-2"
                >
                  <Database className="w-4 h-4" />
                  {entity.name}
                </Label>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardHeader>
            <CardTitle className="text-white">Export Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-white mb-2 block">Format</Label>
              <Select value={exportFormat} onValueChange={setExportFormat}>
                <SelectTrigger className="bg-[#1a1a1a] border-[#2a2a2a] text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV (Comma Separated)</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-white mb-2 block">Date Range</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="bg-[#1a1a1a] border-[#2a2a2a] text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="30">Last 30 Days</SelectItem>
                  <SelectItem value="90">Last 90 Days</SelectItem>
                  <SelectItem value="365">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Button
          onClick={exportData}
          disabled={selectedEntities.length === 0 || isExporting}
          className="w-full bg-[#DC2626] hover:bg-[#B91C1C] text-white h-12"
        >
          {isExporting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Exporting...
            </>
          ) : (
            <>
              <Download className="w-5 h-5 mr-2" />
              Export Selected Data
            </>
          )}
        </Button>

        <div className="p-4 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a]">
          <p className="text-sm text-gray-400">
            <strong className="text-white">Note:</strong> Exported data will include all fields and sensitive information. 
            Please handle exported files securely and in compliance with your organization's data protection policies.
          </p>
        </div>
      </div>
    </div>
  );
}