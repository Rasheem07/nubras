// app/settings/users/page.tsx
export default function UsersPage() {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Users Management</h1>
          <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
            Add New User
          </button>
        </div>
  
        <div className="bg-gray-800 rounded-lg">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search users..."
                  className="w-64 px-4 py-2 text-sm text-gray-300 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div className="flex space-x-2">
                <select className="px-4 py-2 text-sm text-gray-300 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600">
                  <option>Role: All</option>
                  <option>Admin</option>
                  <option>User</option>
                  <option>Editor</option>
                </select>
                <select className="px-4 py-2 text-sm text-gray-300 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600">
                  <option>Status: All</option>
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>
            </div>
  
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    <th className="px-6 py-3">User</th>
                    <th className="px-6 py-3">Role</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Last Active</th>
                    <th className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {[1, 2, 3].map((i) => (
                    <tr key={i} className="text-gray-300">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gray-600 rounded-full"></div>
                          <div className="ml-4">
                            <div className="text-sm font-medium">John Doe</div>
                            <div className="text-sm text-gray-400">john@example.com</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">Admin</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 text-xs font-medium text-green-400 bg-green-400/10 rounded-full">
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">2 hours ago</td>
                      <td className="px-6 py-4 text-sm">
                        <button className="text-gray-400 hover:text-white">Edit</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    )
  }