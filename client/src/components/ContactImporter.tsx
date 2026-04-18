import { useState, useRef } from 'react';
import { Upload, AlertCircle, CheckCircle, X, Download } from 'lucide-react';
import {
  parseFile,
  validateContact,
  downloadSampleCSV,
  ParsedContact,
} from '../lib/fileParser';
import { useContactStore } from '../store/contactStore';

interface ImportState {
  step: 'upload' | 'preview' | 'importing' | 'complete';
  contacts: ParsedContact[];
  errors: Record<number, string[]>;
  validContacts: number;
  invalidContacts: number;
  importedCount: number;
}

export default function ContactImporter() {
  const { bulkImportContacts } = useContactStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<ImportState>({
    step: 'upload',
    contacts: [],
    errors: {},
    validContacts: 0,
    invalidContacts: 0,
    importedCount: 0,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = async (file: File) => {
    setError(null);

    try {
      const contacts = await parseFile(file);

      // Validate contacts
      const errors: Record<number, string[]> = {};
      let validCount = 0;
      let invalidCount = 0;

      contacts.forEach((contact, index) => {
        const validation = validateContact(contact);
        if (validation.valid) {
          validCount++;
        } else {
          invalidCount++;
          errors[index] = validation.errors;
        }
      });

      setState({
        step: 'preview',
        contacts,
        errors,
        validContacts: validCount,
        invalidContacts: invalidCount,
        importedCount: 0,
      });
    } catch (err: any) {
      setError(err.message || 'Failed to parse file');
    }
  };

  const handleImport = async () => {
    setState((prev) => ({ ...prev, step: 'importing' }));

    try {
      // Filter valid contacts
      const validContacts = state.contacts.filter(
        (_, index) => !state.errors[index]
      );

      await bulkImportContacts(validContacts);

      setState((prev) => ({
        ...prev,
        step: 'complete',
        importedCount: validContacts.length,
      }));
    } catch (err: any) {
      setError(err.message || 'Failed to import contacts');
      setState((prev) => ({ ...prev, step: 'preview' }));
    }
  };

  const handleReset = () => {
    setState({
      step: 'upload',
      contacts: [],
      errors: {},
      validContacts: 0,
      invalidContacts: 0,
      importedCount: 0,
    });
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
          <h2 className="text-2xl font-bold text-gray-900">Import Contacts</h2>
          <button
            onClick={handleReset}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="p-6">
          {/* Upload step */}
          {state.step === 'upload' && (
            <div className="space-y-6">
              {/* Drag and drop area */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                  isDragging
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-300 hover:border-primary'
                }`}
              >
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Drag and drop your file here
                </h3>
                <p className="text-gray-600 mb-4">
                  or click below to select a file
                </p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="btn-primary"
                >
                  Select File
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.xlsx,.xls,.pdf,.txt"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      handleFileSelect(e.target.files[0]);
                    }
                  }}
                  className="hidden"
                />
              </div>

              {/* Supported formats */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900 font-medium mb-2">
                  Supported formats:
                </p>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• CSV files (.csv)</li>
                  <li>• Excel files (.xlsx, .xls)</li>
                  <li>• PDF files (.pdf)</li>
                  <li>• Text files (.txt)</li>
                </ul>
              </div>

              {/* Sample template */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-900 font-medium mb-3">
                  Need help? Download a sample template:
                </p>
                <div className="space-y-2">
                  <button
                    onClick={downloadSampleCSV}
                    className="flex items-center space-x-2 text-primary hover:underline"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Sample CSV</span>
                  </button>
                  <p className="text-xs text-gray-600 mt-2">
                    Tip: Export your contacts from Gmail, Outlook, or your phone as CSV/Excel/PDF and import them here!
                  </p>
                </div>
              </div>

              {/* Error message */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}
            </div>
          )}

          {/* Preview step */}
          {state.step === 'preview' && (
            <div className="space-y-6">
              {/* Summary */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Total Contacts</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {state.contacts.length}
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-600">Valid</p>
                  <p className="text-2xl font-bold text-green-900 mt-1">
                    {state.validContacts}
                  </p>
                </div>
                <div className="p-4 bg-red-50 rounded-lg">
                  <p className="text-sm text-red-600">Invalid</p>
                  <p className="text-2xl font-bold text-red-900 mt-1">
                    {state.invalidContacts}
                  </p>
                </div>
              </div>

              {/* Contacts list */}
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {state.contacts.map((contact, index) => {
                  const hasError = state.errors[index];

                  return (
                    <div
                      key={index}
                      className={`p-4 border rounded-lg ${
                        hasError
                          ? 'border-red-200 bg-red-50'
                          : 'border-green-200 bg-green-50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            {hasError ? (
                              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                            ) : (
                              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                            )}
                            <h4 className="font-semibold text-gray-900">
                              {contact.firstName} {contact.lastName}
                            </h4>
                          </div>

                          {contact.email && (
                            <p className="text-sm text-gray-600 mt-1">
                              {contact.email}
                            </p>
                          )}

                          {contact.birthday && (
                            <p className="text-sm text-gray-600">
                              Birthday: {contact.birthday}
                            </p>
                          )}

                          {hasError && (
                            <ul className="mt-2 space-y-1">
                              {hasError.map((err, i) => (
                                <li key={i} className="text-xs text-red-700">
                                  • {err}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Error message */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t">
                <button
                  onClick={handleReset}
                  className="btn-outline"
                >
                  Choose Different File
                </button>
                <button
                  onClick={handleImport}
                  disabled={state.validContacts === 0}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Import {state.validContacts} Contact{state.validContacts !== 1 ? 's' : ''}
                </button>
              </div>
            </div>
          )}

          {/* Importing step */}
          {state.step === 'importing' && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Importing contacts...</p>
            </div>
          )}

          {/* Complete step */}
          {state.step === 'complete' && (
            <div className="text-center py-12 space-y-6">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Import Complete!
                </h3>
                <p className="text-gray-600">
                  Successfully imported{' '}
                  <span className="font-semibold">{state.importedCount}</span>{' '}
                  contact{state.importedCount !== 1 ? 's' : ''}
                </p>
              </div>
              <button
                onClick={handleReset}
                className="btn-primary"
              >
                Import More Contacts
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
