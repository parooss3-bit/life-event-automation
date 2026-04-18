import { useAuthStore } from '../store/authStore';
import { Bell, Mail, Smartphone } from 'lucide-react';

export default function SettingsPage() {
  const { user, updateProfile } = useAuthStore();

  const handleNotificationToggle = async (type: string) => {
    if (!user) return;

    const updates: any = {};
    if (type === 'email') updates.emailNotifications = !user.emailNotifications;
    if (type === 'sms') updates.smsNotifications = !user.smsNotifications;
    if (type === 'push') updates.pushNotifications = !user.pushNotifications;

    await updateProfile(updates);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Manage your account and preferences</p>
      </div>

      {/* Notification preferences */}
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Notification Preferences
        </h2>

        <div className="space-y-4">
          {/* Email notifications */}
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-blue-600" />
              <div>
                <h3 className="font-semibold text-gray-900">Email Notifications</h3>
                <p className="text-sm text-gray-600">
                  Receive reminders via email
                </p>
              </div>
            </div>
            <button
              onClick={() => handleNotificationToggle('email')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                user?.emailNotifications ? 'bg-green-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  user?.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* SMS notifications */}
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <Smartphone className="w-5 h-5 text-purple-600" />
              <div>
                <h3 className="font-semibold text-gray-900">SMS Notifications</h3>
                <p className="text-sm text-gray-600">
                  Receive reminders via text message
                </p>
              </div>
            </div>
            <button
              onClick={() => handleNotificationToggle('sms')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                user?.smsNotifications ? 'bg-green-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  user?.smsNotifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Push notifications */}
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <Bell className="w-5 h-5 text-orange-600" />
              <div>
                <h3 className="font-semibold text-gray-900">Push Notifications</h3>
                <p className="text-sm text-gray-600">
                  Receive notifications in your browser
                </p>
              </div>
            </div>
            <button
              onClick={() => handleNotificationToggle('push')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                user?.pushNotifications ? 'bg-green-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  user?.pushNotifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Account information */}
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Information</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <input
              type="text"
              value={user?.name || ''}
              disabled
              className="input bg-gray-50 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="input bg-gray-50 cursor-not-allowed"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
