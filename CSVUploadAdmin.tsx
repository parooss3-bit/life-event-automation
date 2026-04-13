/*
 * CSV Upload Admin Component
 * Allows users to upload CSV files and preview/validate data before importing
 * Design: Contemporary Research Publication with Bold Accents
 */

import { useState, useRef } from "react";
import { Upload, X, CheckCircle, AlertCircle, Loader2, Download } from "lucide-react";
import Papa, { ParseResult } from "papaparse";

interface ParsedBusiness {
  name: string;
  address: string;
  phone?: string;
  website?: string;
  email?: string;
  rating?: string;
  category?: string;
  [key: string]: string | undefined;
}

interface UploadState {
  file: File | null;
  data: ParsedBusiness[];
  headers: string[];
  isLoading: boolean;
  error: string | null;
  success: string | null;
  importProgress: number;
}

export function CSVUploadAdmin() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<UploadState>({
    file: null,
    data: [],
    headers: [],
    isLoading: false,
    error: null,
    success: null,
    importProgress: 0,
  });

  const [columnMapping, setColumnMapping] = useState<Record<string, string>>({});
  const [previewRows, setPreviewRows] = useState(5);
  const [validationResults, setValidationResults] = useState<{
    total: number;
    valid: number;
    invalid: number;
    issues: string[];
  } | null>(null);

  // Handle file selection
  const handleFileSelect = (file: File) => {
    if (!file.name.endsWith(".csv")) {
      setState((prev) => ({
        ...prev,
        error: "Please select a CSV file",
      }));
      return;
    }

    setState((prev) => ({
      ...prev,
      file,
      isLoading: true,
      error: null,
      success: null,
    }));

    // Parse CSV
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results: ParseResult<Record<string, string>>) => {
        if (results.data.length === 0) {
          setState((prev) => ({
            ...prev,
            error: "CSV file is empty",
            isLoading: false,
          }));
          return;
        }

        const headers = Object.keys(results.data[0] as Record<string, string>);
        setState((prev) => ({
          ...prev,
          data: results.data as ParsedBusiness[],
          headers,
          isLoading: false,
        }));

        // Auto-map common column names
        autoMapColumns(headers);
      },
      error: (error: Error) => {
        setState((prev) => ({
          ...prev,
          error: `CSV parsing error: ${error.message}`,
          isLoading: false,
        }));
      },
    });
  };

  // Auto-map CSV columns to standard fields
  const autoMapColumns = (headers: string[]) => {
    const mapping: Record<string, string> = {};
    const standardFields = ["name", "address", "phone", "website", "email", "rating", "category"];

    headers.forEach((header) => {
      const lowerHeader = header.toLowerCase().trim();

      // Try to match with standard fields
      for (const field of standardFields) {
        if (lowerHeader.includes(field) || field.includes(lowerHeader)) {
          mapping[header] = field;
          break;
        }
      }
    });

    setColumnMapping(mapping);
  };

  // Validate data
  const validateData = () => {
    const issues: string[] = [];
    let validCount = 0;

    state.data.forEach((row, idx) => {
      const name = row[Object.keys(columnMapping).find((k) => columnMapping[k] === "name") || "name"];
      const address = row[Object.keys(columnMapping).find((k) => columnMapping[k] === "address") || "address"];

      if (!name || !address) {
        issues.push(`Row ${idx + 1}: Missing name or address`);
      } else {
        validCount++;
      }
    });

    setValidationResults({
      total: state.data.length,
      valid: validCount,
      invalid: state.data.length - validCount,
      issues: issues.slice(0, 10), // Show first 10 issues
    });
  };

  // Import data
  const handleImport = async () => {
    if (!validationResults || validationResults.invalid > 0) {
      setState((prev) => ({
        ...prev,
        error: "Please fix validation errors before importing",
      }));
      return;
    }

    setState((prev) => ({
      ...prev,
      isLoading: true,
      error: null,
    }));

    try {
      // Transform data according to column mapping
      const transformedData = state.data.map((row) => {
        const transformed: Record<string, string> = {};

        Object.entries(columnMapping).forEach(([csvCol, standardField]) => {
          if (row[csvCol]) {
            transformed[standardField] = row[csvCol];
          }
        });

        return transformed;
      });

      // Send to backend for import
      const response = await fetch("/api/import-businesses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businesses: transformedData,
          fileName: state.file?.name,
        }),
      });

      if (!response.ok) {
        throw new Error("Import failed");
      }

      const result = await response.json();

      setState((prev) => ({
        ...prev,
        success: `Successfully imported ${result.imported} businesses!`,
        isLoading: false,
        data: [],
        file: null,
        headers: [],
      }));

      setColumnMapping({});
      setValidationResults(null);
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: `Import error: ${error instanceof Error ? error.message : "Unknown error"}`,
        isLoading: false,
      }));
    }
  };

  // Download sample CSV
  const downloadSample = () => {
    const sampleData = [
      {
        name: "ABC Plumbing",
        address: "123 Main Street",
        city: "San Francisco",
        state: "CA",
        zip: "94102",
        phone: "(415) 555-1234",
        website: "https://abcplumbing.com",
        email: "contact@abcplumbing.com",
        rating: "4.8",
        category: "plumbing",
      },
      {
        name: "XYZ Plumbing",
        address: "456 Oak Avenue",
        city: "San Francisco",
        state: "CA",
        zip: "94103",
        phone: "(415) 555-5678",
        website: "https://xyzplumbing.com",
        email: "info@xyzplumbing.com",
        rating: "4.5",
        category: "plumbing",
      },
    ];

    const csv = Papa.unparse(sampleData);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sample_businesses.csv";
    a.click();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-4xl font-bold text-gray-900 mb-2">
            Import Businesses
          </h1>
          <p className="text-gray-600">
            Upload a CSV file to populate your directory with business listings
          </p>
        </div>

        {/* Success Message */}
        {state.success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-green-900">{state.success}</h3>
              <p className="text-sm text-green-700 mt-1">
                Your businesses are now live in the directory.
              </p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {state.error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900">Error</h3>
              <p className="text-sm text-red-700 mt-1">{state.error}</p>
            </div>
          </div>
        )}

        {/* Step 1: Upload */}
        {state.data.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-6">
              Step 1: Upload CSV File
            </h2>

            {/* Drag and Drop Area */}
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:border-teal-400 hover:bg-teal-50 transition-colors"
              onDragOver={(e) => {
                e.preventDefault();
                e.currentTarget.classList.add("border-teal-400", "bg-teal-50");
              }}
              onDragLeave={(e) => {
                e.currentTarget.classList.remove("border-teal-400", "bg-teal-50");
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.currentTarget.classList.remove("border-teal-400", "bg-teal-50");
                const file = e.dataTransfer.files[0];
                if (file) handleFileSelect(file);
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">
                Drag and drop your CSV file here
              </h3>
              <p className="text-sm text-gray-600 mb-4">or click to browse</p>
              <p className="text-xs text-gray-500">CSV files only • Max 50MB</p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileSelect(file);
              }}
              className="hidden"
            />

            {/* Sample Download */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-3">
                Not sure about the format? Download a sample CSV:
              </p>
              <button
                onClick={downloadSample}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Download className="w-4 h-4" />
                Download Sample CSV
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Column Mapping */}
        {state.data.length > 0 && !validationResults && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-6">
              Step 2: Map Columns
            </h2>

            <p className="text-gray-600 mb-6">
              Match your CSV columns to standard directory fields. Auto-detected mappings are shown below.
            </p>

            {/* Column Mapping */}
            <div className="space-y-4 mb-8">
              {state.headers.map((header) => (
                <div key={header} className="flex items-center gap-4">
                  <label className="w-40 text-sm font-medium text-gray-700">{header}</label>
                  <select
                    value={columnMapping[header] || ""}
                    onChange={(e) => {
                      setColumnMapping((prev) => ({
                        ...prev,
                        [header]: e.target.value,
                      }));
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">-- Skip this column --</option>
                    <option value="name">Business Name</option>
                    <option value="address">Address</option>
                    <option value="city">City</option>
                    <option value="state">State</option>
                    <option value="zip">ZIP Code</option>
                    <option value="phone">Phone</option>
                    <option value="website">Website</option>
                    <option value="email">Email</option>
                    <option value="rating">Rating</option>
                    <option value="category">Category</option>
                  </select>
                </div>
              ))}
            </div>

            {/* Data Preview */}
            <div className="mb-8">
              <h3 className="font-semibold text-gray-900 mb-4">Preview</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      {state.headers.map((header) => (
                        <th
                          key={header}
                          className="text-left px-4 py-2 font-medium text-gray-700"
                        >
                          {columnMapping[header] || header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {state.data.slice(0, previewRows).map((row, idx) => (
                      <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                        {state.headers.map((header) => (
                          <td key={header} className="px-4 py-2 text-gray-700">
                            {row[header]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {state.data.length > previewRows && (
                <button
                  onClick={() => setPreviewRows((prev) => prev + 5)}
                  className="mt-4 text-sm text-teal-600 hover:text-teal-700 font-medium"
                >
                  Load more rows ({previewRows} of {state.data.length})
                </button>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => {
                  validateData();
                }}
                className="px-6 py-2 rounded-lg font-semibold text-white transition-all hover:shadow-lg"
                style={{ backgroundColor: "#0D7A6B" }}
              >
                Validate Data
              </button>
              <button
                onClick={() => {
                  setState((prev) => ({
                    ...prev,
                    data: [],
                    file: null,
                    headers: [],
                  }));
                  setColumnMapping({});
                  setValidationResults(null);
                }}
                className="px-6 py-2 rounded-lg font-semibold text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Validation Results */}
        {validationResults && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-6">
              Step 3: Validation Results
            </h2>

            {/* Summary */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-2xl font-bold text-blue-900">
                  {validationResults.total}
                </div>
                <div className="text-sm text-blue-700">Total Records</div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="text-2xl font-bold text-green-900">
                  {validationResults.valid}
                </div>
                <div className="text-sm text-green-700">Valid Records</div>
              </div>
              <div
                className={`p-4 rounded-lg border ${
                  validationResults.invalid === 0
                    ? "bg-green-50 border-green-200"
                    : "bg-red-50 border-red-200"
                }`}
              >
                <div
                  className={`text-2xl font-bold ${
                    validationResults.invalid === 0 ? "text-green-900" : "text-red-900"
                  }`}
                >
                  {validationResults.invalid}
                </div>
                <div
                  className={`text-sm ${
                    validationResults.invalid === 0 ? "text-green-700" : "text-red-700"
                  }`}
                >
                  Invalid Records
                </div>
              </div>
            </div>

            {/* Issues */}
            {validationResults.issues.length > 0 && (
              <div className="mb-8 p-4 bg-red-50 rounded-lg border border-red-200">
                <h3 className="font-semibold text-red-900 mb-3">Issues Found:</h3>
                <ul className="space-y-2">
                  {validationResults.issues.map((issue, idx) => (
                    <li key={idx} className="text-sm text-red-700">
                      • {issue}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              {validationResults.invalid === 0 ? (
                <>
                  <button
                    onClick={handleImport}
                    disabled={state.isLoading}
                    className="px-6 py-2 rounded-lg font-semibold text-white transition-all hover:shadow-lg disabled:opacity-50"
                    style={{ backgroundColor: "#0D7A6B" }}
                  >
                    {state.isLoading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Importing...
                      </span>
                    ) : (
                      `Import ${validationResults.valid} Businesses`
                    )}
                  </button>
                </>
              ) : (
                <p className="text-red-600 font-medium">
                  Please fix validation errors before importing
                </p>
              )}
              <button
                onClick={() => {
                  setState((prev) => ({
                    ...prev,
                    data: [],
                    file: null,
                    headers: [],
                  }));
                  setColumnMapping({});
                  setValidationResults(null);
                }}
                className="px-6 py-2 rounded-lg font-semibold text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
