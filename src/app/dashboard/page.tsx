
'use client'
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Banknote, ChartArea, Loader2 } from 'lucide-react';


// Loading component with progressive messages
const LoadingScreen = () => {
  const [loadingStep, setLoadingStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const loadingMessages = [
    "Analyzing sales performance data...",
    "Calculating inventory metrics...",
    "Processing customer insights...",
    "Identifying business opportunities...",
    "Preparing your personalized dashboard..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 1;
        if (newProgress % 20 === 0 && loadingStep < 4) {
          setLoadingStep(prev => prev + 1);
        }
        return newProgress <= 100 ? newProgress : 100;
      });
    }, 100); // 10 seconds to reach 100%

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md bg-gray-800 rounded-xl shadow-2xl p-8 mb-8 relative overflow-hidden">
        <div
          className="absolute top-0 left-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
          style={{ width: `${progress}%`, transition: 'width 0.3s ease-in-out' }}
        ></div>

        <div className="flex items-center justify-center mb-6">
          <div className="relative">
            <Loader2 className="h-16 w-16 text-indigo-400 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-medium text-white">{progress}%</span>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white text-center mb-2">
          Business Intelligence
        </h2>

        <p className="text-center text-indigo-300 mb-6">
          {loadingMessages[loadingStep]}
        </p>

        <div className="space-y-3">
          {loadingMessages.map((message, index) => (
            <div key={index} className="flex items-center">
              <div className={`w-4 h-4 rounded-full mr-3 flex-shrink-0 ${index < loadingStep
                ? 'bg-green-500'
                : index === loadingStep
                  ? 'bg-indigo-500 animate-pulse'
                  : 'bg-gray-700'
                }`}></div>
              <p className={`text-sm ${index < loadingStep
                ? 'text-green-400'
                : index === loadingStep
                  ? 'text-white'
                  : 'text-gray-500'
                }`}>
                {message}
              </p>
            </div>
          ))}
        </div>
      </div>

      <p className="text-gray-400 text-center max-w-sm">
        Analyzing your tailoring business data to provide actionable insights and optimize operations
      </p>
    </div>
  );
};
// Fetch dashboard data
const fetchDashboardData = async () => {
  const response = await fetch('http://alnubrasstudio.ddns.net:8888/dashboard/overview');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return await response.json();
};

// Custom color palette
const COLORS = ['#6366F1', '#8B5CF6', '#EC4899', '#F43F5E', '#10B981', '#14B8A6', '#0EA5E9'];
const CHART_LINE_COLOR = '#38BDF8';
const SUCCESS_COLOR = '#10B981';
const WARNING_COLOR = '#F59E0B';
const DANGER_COLOR = '#EF4444';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['dashboardData'],
    queryFn: fetchDashboardData,
    refetchInterval: 300000

  });

  if (isLoading) {
    return <LoadingScreen />
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
          <h2 className="text-2xl font-bold text-red-400 mb-2">Error Loading Dashboard</h2>
          <p>{error.message}</p>
        </div>
      </div>
    );
  }

  // Prepare data for sales chart
  const salesData = [
    { name: 'Ready-Made', value: data.summary.readyMadeSales },
    { name: 'Custom Tailored', value: data.summary.customTailoredSales },
  ];

  // Prepare data for payment status chart
  const paymentData = data.paymentStats.map((stat: any) => ({
    name: stat.paymentStatus.replace('_', ' '),
    value: stat._sum.totalAmount
  }));

  // Prepare data for section performance
  const sectionData = data.sectionPerformance.map((section: any) => ({
    name: section.name,
    sales: section.totalSalesAmount
  }));

  // Prepare data for inventory
  const inventoryData = data.fabricInventory.map((fabric: any) => ({
    name: fabric.name,
    available: fabric.quantityAvailable,
    reorder: fabric.reorderPoint
  }));

  return (
    <div className="min-h-screen bg-gray-900 text-white pb-10">
      {/* Header */}
      <header className="bg-gray-800 p-6 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Tailoring Business Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-400">Last updated: {new Date().toLocaleTimeString()}</span>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md transition duration-200"
            >
              Refresh
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-gray-800 border-b border-gray-700 px-6 py-3">
        <div className="container mx-auto">
          <div className="flex space-x-6">
            {['overview', 'sales', 'inventory', 'performance'].map(tab => (
              <button
                key={tab}
                className={`capitalize px-2 py-1 transition duration-200 border-b-2 ${activeTab === tab
                  ? 'border-indigo-500 text-white'
                  : 'border-transparent text-gray-400 hover:text-gray-200'
                  }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="container mx-auto px-6 py-8 overflow-y-auto max-h-[calc(100vh-112px-59px-71px)]">
        {/* Summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <SummaryCard
            title="Total Orders"
            value={data.summary.totalOrders}
            icon={ChartArea}
            change="+12%"
            positive={true}
          />
          <SummaryCard
            title="Total Sales"
            value={`$${data.summary.totalSales.toLocaleString()}`}
            icon={Banknote}
            change="+8%"
            positive={true}
          />
          <SummaryCard
            title="Customers"
            value={data.summary.totalCustomers}
            icon="👥"
            change="+5%"
            positive={true}
          />
          <SummaryCard
            title="Pending Orders"
            value={data.summary.pendingOrders}
            icon="⏳"
            change={data.summary.pendingOrders > 10 ? "+2" : "-3"}
            positive={data.summary.pendingOrders <= 10}
          />
        </div>

        {activeTab === 'overview' && (
          <>
            {/* Alerts section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Alerts</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Alert
                  type={data.summary.lowStockFabrics > 5 ? "error" : "warning"}
                  title="Low Stock Fabrics"
                  message={`${data.summary.lowStockFabrics} fabrics are below reorder point`}
                />
                <Alert
                  type={data.summary.lowStockProducts > 5 ? "error" : "warning"}
                  title="Low Stock Products"
                  message={`${data.summary.lowStockProducts} products are below reorder point`}
                />
                <Alert
                  type={data.summary.pendingOrders > 20 ? "error" : "warning"}
                  title="Pending Orders"
                  message={`${data.summary.pendingOrders} orders need attention`}
                />
                {data.paymentStats.some((stat: any) => stat.paymentStatus === 'OVERDUE') && (
                  <Alert
                    type="error"
                    title="Overdue Payments"
                    message={`${data.paymentStats.find((stat: any) => stat.paymentStatus === 'OVERDUE')?._count?.InvoiceId || 0} invoices are overdue`}
                  />
                )}
              </div>
            </div>

            {/* Chart row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <ChartCard title="Sales by Type">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={salesData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {salesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Section Performance">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={sectionData.slice(0, 5)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="name" stroke="#aaa" />
                    <YAxis stroke="#aaa" />
                    <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                    <Bar dataKey="sales" fill={CHART_LINE_COLOR} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>

            {/* Recent orders */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
              <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-700">
                        <th className="px-4 py-3 text-left">Order ID</th>
                        <th className="px-4 py-3 text-left">Customer</th>
                        <th className="px-4 py-3 text-left">Sales Person</th>
                        <th className="px-4 py-3 text-left">Amount</th>
                        <th className="px-4 py-3 text-left">Status</th>
                        <th className="px-4 py-3 text-left">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.recentOrders.map((order: any) => (
                        <tr key={order.InvoiceId} className="border-t border-gray-700 hover:bg-gray-750">
                          <td className="px-4 py-3">#{order.InvoiceId}</td>
                          <td className="px-4 py-3">{order.Customer?.name || 'N/A'}</td>
                          <td className="px-4 py-3">{order.SalesPerson?.name || 'N/A'}</td>
                          <td className="px-4 py-3">${order.totalAmount.toLocaleString()}</td>
                          <td className="px-4 py-3">
                            <StatusBadge status={order.status} />
                          </td>
                          <td className="px-4 py-3">{new Date(order.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'sales' && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <ChartCard title="Payment Status">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={paymentData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {paymentData.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Sales by Type">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={salesData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {salesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>

            {/* Top salespeople */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Top Sales Persons</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.topSalesPersons.map((person: any) => (
                  <div key={person.id} className="bg-gray-800 rounded-lg shadow-lg p-4">
                    <div className="flex items-center space-x-4">
                      <div className="bg-indigo-500 rounded-full w-12 h-12 flex items-center justify-center">
                        <span className="text-xl">{person.name.charAt(0)}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold">{person.name}</h3>
                        <p className="text-gray-400">{person.email}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="flex justify-between mb-1">
                        <span>Total Sales</span>
                        <span className="font-semibold">${person.totalSalesAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Commission</span>
                        <span className="font-semibold">${(person.totalSalesAmount * 0.05).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top customers */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Top Customers</h2>
              <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-700">
                      <th className="px-4 py-3 text-left">Customer</th>
                      <th className="px-4 py-3 text-left">Email</th>
                      <th className="px-4 py-3 text-left">Phone</th>
                      <th className="px-4 py-3 text-left">Total Spent</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.topCustomers.map((customer: any) => (
                      <tr key={customer.id} className="border-t border-gray-700 hover:bg-gray-750">
                        <td className="px-4 py-3">{customer.name}</td>
                        <td className="px-4 py-3">{customer.email}</td>
                        <td className="px-4 py-3">{customer.phone || 'N/A'}</td>
                        <td className="px-4 py-3">${customer.totalSpent.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeTab === 'inventory' && (
          <>
            {/* Inventory alerts */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Inventory Status</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <SummaryCard
                  title="Low Stock Fabrics"
                  value={data.summary.lowStockFabrics}
                  icon="🧵"
                  change={data.summary.lowStockFabrics > 5 ? "+2" : "-1"}
                  positive={data.summary.lowStockFabrics <= 5}
                />
                <SummaryCard
                  title="Low Stock Products"
                  value={data.summary.lowStockProducts}
                  icon="👔"
                  change={data.summary.lowStockProducts > 5 ? "+3" : "-2"}
                  positive={data.summary.lowStockProducts <= 5}
                />
              </div>

              {/* Fabric inventory chart */}
              <ChartCard title="Fabric Inventory Levels">
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={inventoryData.slice(0, 8)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="name" stroke="#aaa" />
                    <YAxis stroke="#aaa" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="available" fill={CHART_LINE_COLOR} name="Available Quantity" />
                    <Bar dataKey="reorder" fill={DANGER_COLOR} name="Reorder Point" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>

            {/* Low stock fabrics */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Low Stock Fabrics</h2>
              <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-700">
                      <th className="px-4 py-3 text-left">Fabric</th>
                      <th className="px-4 py-3 text-left">Supplier</th>
                      <th className="px-4 py-3 text-left">Available</th>
                      <th className="px-4 py-3 text-left">Reorder Point</th>
                      <th className="px-4 py-3 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.fabricInventory.map((fabric: any) => (
                      <tr key={fabric.id} className="border-t border-gray-700 hover:bg-gray-750">
                        <td className="px-4 py-3">{fabric.fabricName}</td>
                        <td className="px-4 py-3">{fabric.supplier?.name || 'N/A'}</td>
                        <td className="px-4 py-3">{fabric.quantityAvailable} yards</td>
                        <td className="px-4 py-3">{fabric.reorderPoint} yards</td>
                        <td className="px-4 py-3">
                          <InventoryStatusBadge
                            available={fabric.quantityAvailable}
                            reorderPoint={fabric.reorderPoint}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Low stock products */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Low Stock Products</h2>
              <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-700">
                      <th className="px-4 py-3 text-left">Product</th>
                      <th className="px-4 py-3 text-left">Available</th>
                      <th className="px-4 py-3 text-left">Reorder Point</th>
                      <th className="px-4 py-3 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.productInventory.map((item: any) => (
                      <tr key={item.id} className="border-t border-gray-700 hover:bg-gray-750">
                        <td className="px-4 py-3">{item.product?.name || 'N/A'}</td>
                        <td className="px-4 py-3">{item.quantityAvailable}</td>
                        <td className="px-4 py-3">{item.reorderPoint}</td>
                        <td className="px-4 py-3">
                          <InventoryStatusBadge
                            available={item.quantityAvailable}
                            reorderPoint={item.reorderPoint}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeTab === 'performance' && (
          <>
            {/* Section performance */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Section Performance</h2>
              <ChartCard title="Sales by Section">
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={sectionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="name" stroke="#aaa" />
                    <YAxis stroke="#aaa" />
                    <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                    <Bar dataKey="sales" fill={CHART_LINE_COLOR} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>

            {/* Tailor performance */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Tailor Performance</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.tailorPerformance.map((tailor: any) => (
                  <div key={tailor.id} className="bg-gray-800 rounded-lg shadow-lg p-4">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="bg-indigo-500 rounded-full w-12 h-12 flex items-center justify-center">
                        <span className="text-xl">{tailor.name.charAt(0)}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold">{tailor.name}</h3>
                        <p className="text-gray-400 capitalize">{tailor.role.toLowerCase().replace('_', ' ')}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Orders Completed</span>
                        <span className="font-semibold">{tailor.orders?.length || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Productivity</span>
                        <span className="font-semibold">
                          {tailor.orders?.length > 10 ? 'High' : tailor.orders?.length > 5 ? 'Medium' : 'Low'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Salary</span>
                        <span className="font-semibold">${tailor.salary?.amount || 0}/month</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

// Component for summary cards
function SummaryCard({ title, value, Icon, change, positive }: any) {
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-gray-400 text-sm mb-1">{title}</h3>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <Icon className="h-4 w-4"/>
      </div>
      {change && (
        <div className={`mt-4 text-sm ${positive ? 'text-green-500' : 'text-red-500'}`}>
          {positive ? '↑' : '↓'} {change} from last period
        </div>
      )}
    </div>
  );
}

// Component for alerts
function Alert({ type, title, message }: any) {
  const bgColor = type === 'error' ? 'bg-red-900 bg-opacity-30' :
    type === 'warning' ? 'bg-yellow-900 bg-opacity-30' :
      'bg-green-900 bg-opacity-30';

  const borderColor = type === 'error' ? 'border-red-500' :
    type === 'warning' ? 'border-yellow-500' :
      'border-green-500';

  const icon = type === 'error' ? '⚠️' :
    type === 'warning' ? '⚠️' :
      '✅';

  return (
    <div className={`rounded-lg shadow-lg p-4 border-l-4 ${borderColor} ${bgColor}`}>
      <div className="flex items-center">
        <div className="mr-3">{icon}</div>
        <div>
          <h3 className="font-semibold">{title}</h3>
          <p className="text-gray-300">{message}</p>
        </div>
      </div>
    </div>
  );
}

// Component for charts
function ChartCard({ title, children }: any) {
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      {children}
    </div>
  );
}

// Component for order status badge
function StatusBadge({ status }: any) {
  let bgColor;
  let textColor = 'text-white';

  switch (status.toLowerCase()) {
    case 'confirmed':
      bgColor = 'bg-blue-600';
      break;
    case 'processing':
    case 'tailoring':
      bgColor = 'bg-yellow-600';
      break;
    case 'completed':
      bgColor = 'bg-green-600';
      break;
    case 'cancelled':
      bgColor = 'bg-red-600';
      break;
    default:
      bgColor = 'bg-gray-600';
  }

  return (
    <span className={`px-2 py-1 rounded-md text-xs font-medium ${bgColor} ${textColor}`}>
      {status.replace('_', ' ')}
    </span>
  );
}

// Component for inventory status badge
function InventoryStatusBadge({ available, reorderPoint }: any) {
  let bgColor;
  let text;

  if (available <= reorderPoint * 0.5) {
    bgColor = 'bg-red-600';
    text = 'Critical';
  } else if (available <= reorderPoint) {
    bgColor = 'bg-yellow-600';
    text = 'Low';
  } else {
    bgColor = 'bg-green-600';
    text = 'Sufficient';
  }

  return (
    <span className={`px-2 py-1 rounded-md text-xs font-medium ${bgColor} text-white`}>
      {text}
    </span>
  );
}