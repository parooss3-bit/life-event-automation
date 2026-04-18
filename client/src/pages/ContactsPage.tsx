import { useEffect, useState } from 'react';
import { useContactStore } from '../store/contactStore';
import { Plus, Search, Trash2, Edit2, Upload } from 'lucide-react';
import ContactImporter from '../components/ContactImporter';
import QuickContactForm from '../components/QuickContactForm';

export default function ContactsPage() {
  const { contacts, fetchContacts, deleteContact, isLoading } = useContactStore();
  const [search, setSearch] = useState('');
  const [showImporter, setShowImporter] = useState(false);
  const [showQuickForm, setShowQuickForm] = useState(false);

  useEffect(() => {
    fetchContacts(1, 20, search);
  }, [search]);

  const filteredContacts = contacts.filter(
    (c) =>
      c.firstName.toLowerCase().includes(search.toLowerCase()) ||
      c.lastName.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Contacts</h1>
          <p className="text-gray-600 mt-2">Manage your friends and family</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowImporter(true)}
            className="btn-outline flex items-center space-x-2"
          >
            <Upload className="w-5 h-5" />
            <span>Import</span>
          </button>
          <button
            onClick={() => setShowQuickForm(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add Contact</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search contacts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input pl-10 w-full"
        />
      </div>

      {/* Contacts list */}
      <div className="card">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          </div>
        ) : filteredContacts.length > 0 ? (
          <div className="space-y-4">
            {filteredContacts.map((contact) => (
              <div
                key={contact.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4 flex-1">
                  {contact.avatarUrl ? (
                    <img
                      src={contact.avatarUrl}
                      alt={contact.firstName}
                      className="w-12 h-12 rounded-full"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                      {contact.firstName.charAt(0)}
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {contact.firstName} {contact.lastName}
                    </h3>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                      {contact.email && <span>{contact.email}</span>}
                      {contact.birthday && <span>{contact.birthday}</span>}
                      <span className="capitalize">{contact.relationship}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Edit2 className="w-5 h-5 text-gray-600" />
                  </button>
                  <button
                    onClick={() => deleteContact(contact.id)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5 text-red-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">No contacts found</p>
          </div>
        )}
      </div>

      {/* Modals */}
      {showImporter && (
        <ContactImporter />
      )}
      {showQuickForm && (
        <QuickContactForm onClose={() => setShowQuickForm(false)} />
      )}
    </div>
  );
}
