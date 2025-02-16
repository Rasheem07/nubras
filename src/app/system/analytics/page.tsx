// app/settings/analytics/page.tsx
'use client'
import { 
    LineChart, 
    Line, 
    AreaChart, 
    Area,
    BarChart,
    Bar,
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer 
  } from 'recharts';
  
  const performanceData = [
    { time: '00:00', responseTime: 245, errorRate: 0.12, requests: 1200 },
    { time: '04:00', responseTime: 278, errorRate: 0.15, requests: 1400 },
    { time: '08:00', responseTime: 342, errorRate: 0.18, requests: 2100 },
    { time: '12:00', responseTime: 389, errorRate: 0.21, requests: 2400 },
    { time: '16:00', responseTime: 287, errorRate: 0.14, requests: 1800 },
    { time: '20:00', responseTime: 256, errorRate: 0.13, requests: 1500 },
    { time: '22:00', responseTime: 300, errorRate: 0.13, requests: 3432 },
  ];
  
  export default function AnalyticsPage() {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-white">System Analytics</h1>
  
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-sm font-medium text-gray-400">Average Response Time</h3>
            <p className="mt-2 text-2xl font-semibold text-white">247ms</p>
            <div className="h-16 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <Line type="monotone" dataKey="responseTime" stroke="#22c55e" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
  
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-sm font-medium text-gray-400">Error Rate</h3>
            <p className="mt-2 text-2xl font-semibold text-white">0.12%</p>
            <div className="h-16 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceData}>
                  <Area type="monotone" dataKey="errorRate" stroke="#ef4444" fill="#ef4444" fillOpacity={0.2} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
  
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-sm font-medium text-gray-400">Total Requests</h3>
            <p className="mt-2 text-2xl font-semibold text-white">12.5k</p>
            <div className="h-16 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData}>
                  <Bar dataKey="requests" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
  
        {/* Detailed Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-sm font-medium text-gray-400 mb-4">Response Time Trend</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="time" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', border: 'none' }}
                    itemStyle={{ color: '#e5e7eb' }}
                    labelStyle={{ color: '#e5e7eb' }}
                  />
                  <Line type="monotone" dataKey="responseTime" stroke="#22c55e" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
  
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-sm font-medium text-gray-400 mb-4">Error Rate Analysis</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="time" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', border: 'none' }}
                    itemStyle={{ color: '#e5e7eb' }}
                    labelStyle={{ color: '#e5e7eb' }}
                  />
                  <Area type="monotone" dataKey="errorRate" stroke="#ef4444" fill="#ef4444" fillOpacity={0.2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
  
        {/* Request Distribution */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-sm font-medium text-gray-400 mb-4">Request Distribution</h3>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%" minHeight={400}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: 'none' }}
                  itemStyle={{ color: '#e5e7eb' }}
                  labelStyle={{ color: '#e5e7eb' }}
                />
                <Bar dataKey="requests" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    )
  }