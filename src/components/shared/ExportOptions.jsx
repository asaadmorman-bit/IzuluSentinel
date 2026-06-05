import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, FileText, Table, Image } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ExportOptions({ data, type = "incidents" }) {
  const [isExporting, setIsExporting] = useState(false);

  const exportToJSON = () => {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${type}_export_${new Date().toISOString()}.json`;
    link.click();
  };

  const exportToCSV = () => {
    if (!data || data.length === 0) return;
    
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(item => 
      Object.values(item).map(val => 
        typeof val === 'string' && val.includes(',') ? `"${val}"` : val
      ).join(',')
    );
    
    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${type}_export_${new Date().toISOString()}.csv`;
    link.click();
  };

  const exportToPDF = async () => {
    setIsExporting(true);
    // This would integrate with a PDF library or backend service
    alert('PDF export would be implemented with a PDF generation library');
    setIsExporting(false);
  };

  const exportScreenshot = () => {
    alert('Screenshot export would capture the current view');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="border-[#2a2a2a] text-white">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-[#1a1a1a] border-[#2a2a2a]">
        <DropdownMenuItem onClick={exportToJSON} className="text-white cursor-pointer">
          <FileText className="w-4 h-4 mr-2" />
          Export as JSON
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToCSV} className="text-white cursor-pointer">
          <Table className="w-4 h-4 mr-2" />
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToPDF} disabled={isExporting} className="text-white cursor-pointer">
          <FileText className="w-4 h-4 mr-2" />
          {isExporting ? 'Generating PDF...' : 'Export as PDF'}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportScreenshot} className="text-white cursor-pointer">
          <Image className="w-4 h-4 mr-2" />
          Export Screenshot
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}