import { useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { TrendingUp, Eye, Phone, Globe, MessageSquare, DollarSign } from "lucide-react";
import { getAnalyticsSummary, getBusinessMetrics } from "@/lib/businessAnalytics";

interface AnalyticsDashboardProps {
  businessId: string;
}

export function AnalyticsDashboard({ businessId }: AnalyticsDashboardProps) {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d");
  const summary = getAnalyticsSummary(businessId);
  const metrics = getBusinessMetrics(businessId);

  const engagementData = [
    { name: "Profile Views", value: metrics.profileViews, fill: "#0D7A6B" },
    { name: "Phone Clicks", value: metrics.phoneClicks, fill: "#14B8A6" },
    { name: "Website Clicks", value: metrics.websiteClicks, fill: "#2DD4BF" },
    { name: "Messages", value: metrics.messagesSent, fill: "#67E8F9" },
  ];

  const conversionData = [
    { name: "Leads Generated", value: metrics.leadsGenerated },
    { name: "Leads Converted", value: metrics.leadsConverted },
  ];

  const COLORS = ["#0D7A6B", "#14B8A6"];

  return (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={Eye}
          label="Profile Views"
          value={metrics.profileViews.toLocaleString()}
          trend="+12%"
        />
        <MetricCard
          icon={Phone}
          label="Phone Clicks"
          value={metrics.phoneClicks.toLocaleString()}
          trend="+8%"
        />
        <MetricCard
          icon={Globe}
          label="Website Clicks"
          value={metrics.websiteClicks.toLocaleString()}
          trend="+5%"
        />
        <MetricCard
          icon={DollarSign}
          label="Est. Revenue"
          value={`$${summary.summary.leadValue}`}
          trend="+15%"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Engagement Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Engagement Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={engagementData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#0D7A6B" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Conversion Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Conversion Rate</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={conversionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {COLORS.map((color, index) => (
                  <Cell key={`cell-${index}`} fill={color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 text-center">
            <p className="text-2xl font-bold text-gray-900">
              {summary.summary.conversionRate}
            </p>
            <p className="text-sm text-gray-600">Conversion Rate</p>
          </div>
        </div>
      </div>

      {/* Daily Views Trend */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Profile Views Trend (30 Days)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={metrics.viewsByDay}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={(date) => new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            />
            <YAxis />
            <Tooltip
              labelFormatter={(date) => new Date(date).toLocaleDateString()}
              formatter={(value) => [value, "Views"]}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="views"
              stroke="#0D7A6B"
              dot={false}
              strokeWidth={2}
              name="Daily Views"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Top Keywords */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Top Search Keywords</h3>
        <div className="space-y-3">
          {metrics.topSearchKeywords.map((keyword, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-gray-700">{keyword.keyword}</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-teal-600 h-2 rounded-full"
                    style={{
                      width: `${(keyword.count / metrics.topSearchKeywords[0].count) * 100}%`,
                    }}
                  />
                </div>
                <span className="text-sm font-semibold text-gray-900 w-12 text-right">
                  {keyword.count}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ROI Summary */}
      <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg border border-teal-200 p-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Return on Investment</h3>
            <p className="text-sm text-gray-600 mb-4">
              Based on your current performance metrics
            </p>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-2xl font-bold text-teal-600">
                  {summary.roi.roi.toFixed(1)}%
                </p>
                <p className="text-xs text-gray-600">ROI</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-teal-600">
                  ${summary.roi.estimatedRevenue.toLocaleString()}
                </p>
                <p className="text-xs text-gray-600">Est. Revenue</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-teal-600">
                  ${summary.roi.estimatedCost.toLocaleString()}
                </p>
                <p className="text-xs text-gray-600">Monthly Cost</p>
              </div>
            </div>
          </div>
          <TrendingUp className="w-12 h-12 text-teal-600 opacity-20" />
        </div>
      </div>
    </div>
  );
}

interface MetricCardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  trend: string;
}

function MetricCard({ icon: Icon, label, value, trend }: MetricCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-start justify-between mb-2">
        <Icon className="w-5 h-5 text-teal-600" />
        <span className="text-xs font-semibold text-green-600">{trend}</span>
      </div>
      <p className="text-sm text-gray-600 mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}
