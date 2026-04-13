/*
 * Saved Searches Component
 * Display and manage saved searches
 */

import { useState } from "react";
import { useLocation } from "wouter";
import { Bookmark, Trash2, Plus } from "lucide-react";
import { getSavedSearches, deleteSavedSearch, saveSearch } from "@/lib/favorites";

interface SavedSearchesProps {
  onSearchSelect?: (query: string, category?: string) => void;
}

export function SavedSearches({ onSearchSelect }: SavedSearchesProps) {
  const [searches, setSearches] = useState(() => getSavedSearches());
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [, setLocation] = useLocation();

  const handleDelete = (id: string) => {
    deleteSavedSearch(id);
    setSearches(getSavedSearches());
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchName.trim()) {
      saveSearch(searchName, "", undefined, undefined);
      setSearches(getSavedSearches());
      setSearchName("");
      setShowSaveForm(false);
    }
  };

  const handleSelectSearch = (search: any) => {
    const params = new URLSearchParams();
    if (search.query) params.append("q", search.query);
    if (search.category) params.append("category", search.category);
    setLocation(`/search?${params.toString()}`);
    onSearchSelect?.(search.query, search.category);
  };

  if (searches.length === 0 && !showSaveForm) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <Bookmark className="w-5 h-5 text-teal-600" />
          Saved Searches
        </h3>
        {!showSaveForm && (
          <button
            onClick={() => setShowSaveForm(true)}
            className="text-teal-600 hover:text-teal-700 p-1"
            title="Save current search"
          >
            <Plus className="w-5 h-5" />
          </button>
        )}
      </div>

      {showSaveForm && (
        <form onSubmit={handleSave} className="mb-4 p-4 bg-gray-50 rounded-lg space-y-2">
          <input
            type="text"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            placeholder="Name this search..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
            autoFocus
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={!searchName.trim()}
              className="flex-1 px-3 py-2 rounded-lg font-medium text-white text-sm transition-all disabled:opacity-50"
              style={{ backgroundColor: "#0D7A6B" }}
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setShowSaveForm(false)}
              className="flex-1 px-3 py-2 rounded-lg font-medium text-gray-700 border border-gray-300 text-sm hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {searches.length > 0 && (
        <div className="space-y-2">
          {searches.map((search) => (
            <div
              key={search.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <button
                onClick={() => handleSelectSearch(search)}
                className="flex-1 text-left text-sm font-medium text-gray-900 hover:text-teal-600"
              >
                {search.name}
              </button>
              <button
                onClick={() => handleDelete(search.id)}
                className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                title="Delete search"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
