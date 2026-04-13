/*
 * ExportButton Component
 * Provides PDF export functionality for revenue calculations
 */

import { useState } from "react";
import { Download, FileText } from "lucide-react";
import { generateRevenueReportPDF, RevenueReportData } from "@/lib/pdfExport";

interface ExportButtonProps {
  reportData: RevenueReportData;
  categoryColor: string;
}

export function ExportButton({ reportData, categoryColor }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      // Small delay to show loading state
      await new Promise((resolve) => setTimeout(resolve, 300));
      generateRevenueReportPDF(reportData);
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all"
      style={{
        backgroundColor: categoryColor + "15",
        color: categoryColor,
        opacity: isExporting ? 0.7 : 1,
        cursor: isExporting ? "not-allowed" : "pointer",
      }}
    >
      {isExporting ? (
        <>
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Download className="w-4 h-4" />
          Download PDF Report
        </>
      )}
    </button>
  );
}
