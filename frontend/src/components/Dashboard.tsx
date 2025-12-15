import { Package, AlertTriangle, TrendingUp, TrendingDown, Activity, CheckCircle, Clock, XCircle } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

type User = {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Asset Manager' | 'Technician' | 'Employee';
};

type DashboardProps = {
  user: User;
  onNavigate: (view: 'dashboard' | 'assets' | 'inventory' | 'faults' | 'users') => void;
};

export function Dashboard({ user, onNavigate }: DashboardProps) {
  // Mock statistics
  const stats = [
    { label: 'Total Assets', value: '1,247', change: '+12%', trend: 'up', icon: Package, color: 'blue' },
    { label: 'In Use', value: '892', change: '+5%', trend: 'up', icon: CheckCircle, color: 'green' },
    { label: 'Under Maintenance', value: '45', change: '-8%', trend: 'down', icon: Clock, color: 'yellow' },
    { label: 'Active Faults', value: '23', change: '-15%', trend: 'down', icon: AlertTriangle, color: 'red' },
  ];

  // Asset lifecycle data
  const lifecycleData = [
    { name: 'Procured', value: 156 },
    { name: 'In Use', value: 892 },
    { name: 'Under Maintenance', value: 45 },
    { name: 'Repaired', value: 98 },
    { name: 'Decommissioned', value: 56 },
  ];

  // Asset category data
  const categoryData = [
    { name: 'Hardware', value: 450 },
    { name: 'Software', value: 320 },
    { name: 'Peripherals', value: 280 },
    { name: 'Fleet', value: 150 },
    { name: 'Other', value: 47 },
  ];

  // Monthly trend data
  const trendData = [
    { month: 'Jan', assets: 1100, faults: 45 },
    { month: 'Feb', assets: 1150, faults: 38 },
    { month: 'Mar', assets: 1180, faults: 42 },
    { month: 'Apr', assets: 1200, faults: 35 },
    { month: 'May', assets: 1220, faults: 30 },
    { month: 'Jun', assets: 1247, faults: 23 },
  ];

  const COLORS = ['#00A3A1', '#10B981', '#F59E0B', '#EF4444', '#00BBD3'];

  // Recent activities
  const recentActivities = [
    { id: 1, type: 'asset', action: 'Laptop Dell XPS 15 checked out to John Doe', time: '5 min ago' },
    { id: 2, type: 'fault', action: 'Printer fault #1234 resolved by Mike Tech', time: '15 min ago' },
    { id: 3, type: 'asset', action: 'New asset received: Desktop HP EliteDesk', time: '1 hour ago' },
    { id: 4, type: 'maintenance', action: 'Scheduled maintenance for Server Room AC', time: '2 hours ago' },
    { id: 5, type: 'transfer', action: 'Asset transferred from IT Dept to Finance', time: '3 hours ago' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-[#00A3A1] to-[#00BBD3] rounded-xl p-6 text-white">
        <h2 className="mb-2">Welcome back, {user.name}</h2>
        <p className="text-teal-100">Here's what's happening with your assets today</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const colorClasses = {
            blue: 'bg-teal-100 text-[#00A3A1]',
            green: 'bg-green-100 text-green-600',
            yellow: 'bg-yellow-100 text-yellow-600',
            red: 'bg-red-100 text-red-600',
          };

          return (
            <div key={stat.label} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg ${colorClasses[stat.color as keyof typeof colorClasses]}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className={`flex items-center gap-1 text-${stat.trend === 'up' ? 'green' : 'red'}-600`}>
                  {stat.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  <span>{stat.change}</span>
                </div>
              </div>
              <div className="text-gray-600">{stat.label}</div>
              <div className="text-gray-900 mt-1">{stat.value}</div>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Asset Lifecycle Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-gray-900 mb-4">Asset Lifecycle Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={lifecycleData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#00A3A1" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Asset Categories Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-gray-900 mb-4">Asset Categories</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Trend Chart */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-gray-900 mb-4">Asset & Fault Trends (Last 6 Months)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="assets" stroke="#00A3A1" strokeWidth={2} name="Total Assets" />
            <Line type="monotone" dataKey="faults" stroke="#EF4444" strokeWidth={2} name="Active Faults" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-900">Recent Activity</h3>
          <Activity className="w-5 h-5 text-gray-400" />
        </div>
        <div className="space-y-3">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-[#00A3A1] rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-gray-900">{activity.action}</p>
                <p className="text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button
          onClick={() => onNavigate('assets')}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:border-[#00A3A1] hover:shadow-md transition-all text-left"
        >
          <Package className="w-8 h-8 text-[#00A3A1] mb-3" />
          <h3 className="text-gray-900 mb-2">Manage Assets</h3>
          <p className="text-gray-600">Add, edit, or view asset details</p>
        </button>

        <button
          onClick={() => onNavigate('inventory')}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:border-[#00A3A1] hover:shadow-md transition-all text-left"
        >
          <Activity className="w-8 h-8 text-green-600 mb-3" />
          <h3 className="text-gray-900 mb-2">Track Movement</h3>
          <p className="text-gray-600">Check in/out and transfers</p>
        </button>

        <button
          onClick={() => onNavigate('faults')}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:border-[#00A3A1] hover:shadow-md transition-all text-left"
        >
          <AlertTriangle className="w-8 h-8 text-red-600 mb-3" />
          <h3 className="text-gray-900 mb-2">Report Fault</h3>
          <p className="text-gray-600">Submit and track fault reports</p>
        </button>
      </div>
    </div>
  );
}