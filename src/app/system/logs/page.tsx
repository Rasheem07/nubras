// app/settings/logs/page.tsx
export default function LogsPage() {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">System Logs</h1>
          <div className="flex space-x-4">
            <select className="px-4 py-2 text-sm text-gray-300 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600">
              <option>Last 24 hours</option>
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Custom range</option>
            </select>
            <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
              Export Logs
            </button>
          </div>
        </div>
  
        {/* Log Filters */}
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex flex-wrap gap-4">
            <input
              type="text"
              placeholder="Search logs..."
              className="flex-1 px-4 py-2 text-sm text-gray-300 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <select className="px-4 py-2 text-sm text-gray-300 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600">
              <option>All Levels</option>
              <option>Error</option>
              <option>Warning</option>
              <option>Info</option>
              <option>Debug</option>
            </select>
            <select className="px-4 py-2 text-sm text-gray-300 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600">
              <option>All Services</option>
              <option>Authentication</option>
              <option>API</option>
              <option>Database</option>
              <option>Payment</option>
            </select>
          </div>
        </div>
  
        {/* Log Table */}
        <div className="bg-gray-800 rounded-lg">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  <th className="px-6 py-3">Timestamp</th>
                  <th className="px-6 py-3">Level</th>
                  <th className="px-6 py-3">Service</th>
                  <th className="px-6 py-3">User</th>
                  <th className="px-6 py-3">Message</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {[
                  { level: 'error', service: 'API', message: 'Failed to process payment' },
                  { level: 'info', service: 'Auth', message: 'User login successful' },
                  { level: 'warning', service: 'Database', message: 'High CPU usage detected' },
                ].map((log, i) => (
                  <tr key={i} className="text-gray-300">
                    <td className="px-6 py-4 text-sm">
                      {new Date().toISOString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full
                        ${log.level === 'error' ? 'text-red-400 bg-red-400/10' : 
                          log.level === 'warning' ? 'text-yellow-400 bg-yellow-400/10' : 
                          'text-green-400 bg-green-400/10'}`}>
                        {log.level}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">{log.service}</td>
                    <td className="px-6 py-4 text-sm">john@example.com</td>
                    <td className="px-6 py-4 text-sm">{log.message}</td>
                    <td className="px-6 py-4 text-sm">
                      <button className="text-gray-400 hover:text-white">Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
  
          {/* Pagination */}
          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-700">
            <div className="text-sm text-gray-400">
              Showing 1-3 of 123 logs
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 text-sm text-gray-300 bg-gray-700 rounded-lg hover:bg-gray-600">
                Previous
              </button>
              <button className="px-3 py-1 text-sm text-gray-300 bg-gray-700 rounded-lg hover:bg-gray-600">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }