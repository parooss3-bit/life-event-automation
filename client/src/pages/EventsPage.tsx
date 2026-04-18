import { Plus } from 'lucide-react';

export default function EventsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Events</h1>
          <p className="text-gray-600 mt-2">Track birthdays and special occasions</p>
        </div>
        <button className="btn-primary flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Add Event</span>
        </button>
      </div>

      <div className="card text-center py-12">
        <p className="text-gray-600">Events page coming soon</p>
      </div>
    </div>
  );
}
