import { useEffect } from 'react';
import { useEventStore } from '../store/eventStore';
import { useContactStore } from '../store/contactStore';
import { Calendar, Users, Gift, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function DashboardPage() {
  const { events, fetchEvents } = useEventStore();
  const { contacts, fetchContacts } = useContactStore();

  useEffect(() => {
    fetchEvents(1, 5);
    fetchContacts(1, 5);
  }, []);

  // Get upcoming events
  const upcomingEvents = events.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's coming up.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Contacts</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {contacts.length}
              </p>
            </div>
            <Users className="w-12 h-12 text-blue-500 opacity-20" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Upcoming Events</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {events.length}
              </p>
            </div>
            <Calendar className="w-12 h-12 text-green-500 opacity-20" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">This Month</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {events.filter((e) => {
                  const eventDate = new Date(e.eventDate);
                  const now = new Date();
                  return (
                    eventDate.getMonth() === now.getMonth() &&
                    eventDate.getFullYear() === now.getFullYear()
                  );
                }).length}
              </p>
            </div>
            <Clock className="w-12 h-12 text-orange-500 opacity-20" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Gift Ideas</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
            </div>
            <Gift className="w-12 h-12 text-pink-500 opacity-20" />
          </div>
        </div>
      </div>

      {/* Upcoming events */}
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Upcoming Events</h2>

        {upcomingEvents.length > 0 ? (
          <div className="space-y-4">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{event.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {event.eventType} • {event.eventDate}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {formatDistanceToNow(new Date(event.eventDate), {
                      addSuffix: true,
                    })}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Reminder: {event.reminderDaysBefore} days before
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No upcoming events</p>
          </div>
        )}
      </div>

      {/* Recent contacts */}
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Contacts</h2>

        {contacts.length > 0 ? (
          <div className="space-y-4">
            {contacts.slice(0, 5).map((contact) => (
              <div
                key={contact.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  {contact.avatarUrl ? (
                    <img
                      src={contact.avatarUrl}
                      alt={contact.firstName}
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                      {contact.firstName.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {contact.firstName} {contact.lastName}
                    </h3>
                    <p className="text-sm text-gray-600 capitalize">
                      {contact.relationship}
                    </p>
                  </div>
                </div>
                {contact.birthday && (
                  <p className="text-sm text-gray-600">{contact.birthday}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No contacts yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
