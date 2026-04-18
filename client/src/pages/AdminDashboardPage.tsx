import { useEffect, useState } from 'react';
import { apiClient } from '../lib/api';
import {
  Users,
  DollarSign,
  TrendingUp,
  Activity,
  Search,
  Download,
  Trash2,
} from 'lucide-react';

interface DashboardData {
  totalUsers: number;
  activeUsers: number;
  totalSubscriptions: number;
  totalRevenue: number;
  subscriptionBreakdown: Array<{ tier: string; count: number }>;
  recentUsers: Array<{ id: string; email: string; name: string; createdAt: string }>;
}

interface RevenueData {
  totalMRR: number;
  totalARR: number;
  mrrByTier: { free: number; pro: number; business: number };
  growthRate: number;
  totalSubscriptions: number;
}

interface FeatureUsageData {
  totalContacts: number;
  totalEvents: number;
  totalReminders: number;
  totalGiftsSaved: number;
  avgContactsPerUser: number;
}

export default function AdminDashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [revenueData, setRevenueData] = useState<RevenueData | null>(null);
  const [featureData, setFeatureData] = useState<FeatureUsageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [dashboard, revenue, features] = await Promise.all([
        apiClient.client.get('/api/v1/admin/dashboard'),
        apiClient.client.get('/api/v1/admin/revenue'),
        apiClient.client.get('/api/v1/admin/features'),
      ]);

      setDashboardData(dashboard.data);
      setRevenueData(revenue.data);
      setFeatureData(features.data);
    } catch (err: any) {
      setError('Failed to load dashboard data');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Platform analytics and management</p>
      </div>

      {/* Error message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Key metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Users</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {dashboardData?.totalUsers || 0}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {dashboardData?.activeUsers || 0} active this month
              </p>
            </div>
            <Users className="w-12 h-12 text-blue-500 opacity-20" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Active Subscriptions</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {dashboardData?.totalSubscriptions || 0}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Growth: {revenueData?.growthRate || 0}%
              </p>
            </div>
            <TrendingUp className="w-12 h-12 text-green-500 opacity-20" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Monthly Revenue</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                ${revenueData?.totalMRR.toFixed(2) || '0.00'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                ARR: ${revenueData?.totalARR.toFixed(2) || '0.00'}
              </p>
            </div>
            <DollarSign className="w-12 h-12 text-yellow-500 opacity-20" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Feature Usage</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {(featureData?.totalContacts || 0) + (featureData?.totalEvents || 0)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Contacts & Events
              </p>
            </div>
            <Activity className="w-12 h-12 text-purple-500 opacity-20" />
          </div>
        </div>
      </div>

      {/* Revenue breakdown */}
      {revenueData && (
        <div className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Revenue by Tier</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Free Tier</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                ${revenueData.mrrByTier.free.toFixed(2)}
              </p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-600">Pro Tier</p>
              <p className="text-2xl font-bold text-blue-900 mt-2">
                ${revenueData.mrrByTier.pro.toFixed(2)}
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-purple-600">Business Tier</p>
              <p className="text-2xl font-bold text-purple-900 mt-2">
                ${revenueData.mrrByTier.business.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Feature usage */}
      {featureData && (
        <div className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Feature Usage</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-gray-600">Total Contacts</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {featureData.totalContacts}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Events</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {featureData.totalEvents}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Reminders</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {featureData.totalReminders}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Gifts Saved</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {featureData.totalGiftsSaved}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Recent users */}
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Users</h2>

        <div className="space-y-4">
          {dashboardData?.recentUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div>
                <h3 className="font-semibold text-gray-900">{user.name}</h3>
                <p className="text-sm text-gray-600">{user.email}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Joined {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Download className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 className="w-5 h-5 text-red-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Subscription breakdown */}
      {dashboardData?.subscriptionBreakdown && (
        <div className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Subscription Breakdown</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {dashboardData.subscriptionBreakdown.map((item) => (
              <div key={item.tier} className="p-4 border border-gray-200 rounded-lg">
                <p className="text-sm text-gray-600 capitalize">{item.tier} Tier</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{item.count}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {Math.round(
                    (item.count /
                      (dashboardData.subscriptionBreakdown.reduce((sum, i) => sum + i.count, 0) ||
                        1)) *
                      100
                  )}
                  % of total
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
