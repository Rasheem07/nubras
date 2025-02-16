"use client"
import { useState } from "react";
import StatsGrid from "./_components/StatsGrid";
import OrdersTable from "./_components/OrdersTable";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function Home() {
  const [selectedYear, setSelectedYear] = useState("2024");

  const orders = [
    {
      id: "#ORD-001", 
      customer: "John Doe",
      product: "Product A",
      amount: "$120.00",
      status: "Completed" as const,
    },
    {
      id: "#ORD-002",
      customer: "Jane Smith", 
      product: "Product B",
      amount: "$85.00",
      status: "Pending" as const,
    },
    {
      id: "#ORD-003",
      customer: "Robert Johnson",
      product: "Product C", 
      amount: "$200.00",
      status: "Processing" as const,
    },
  ];

  const salesData = {
    "2024": [
      { month: 'Jan', sales: 4000 },
      { month: 'Feb', sales: 3000 },
      { month: 'Mar', sales: 2000 },
      { month: 'Apr', sales: 2780 },
      { month: 'May', sales: 1890 },
      { month: 'Jun', sales: 2390 },
      { month: 'Jul', sales: 3490 },
      { month: 'Aug', sales: 4000 },
      { month: 'Sep', sales: 3200 },
      { month: 'Oct', sales: 2800 },
      { month: 'Nov', sales: 2400 },
      { month: 'Dec', sales: 3900 },
    ],
    "2023": [
      { month: 'Jan', sales: 3500 },
      { month: 'Feb', sales: 2800 },
      { month: 'Mar', sales: 3200 },
      { month: 'Apr', sales: 2500 },
      { month: 'May', sales: 2900 },
      { month: 'Jun', sales: 3100 },
      { month: 'Jul', sales: 2700 },
      { month: 'Aug', sales: 3300 },
      { month: 'Sep', sales: 3600 },
      { month: 'Oct', sales: 3000 },
      { month: 'Nov', sales: 2600 },
      { month: 'Dec', sales: 3400 },
    ],
    "2022": [
      { month: 'Jan', sales: 2800 },
      { month: 'Feb', sales: 2500 },
      { month: 'Mar', sales: 2900 },
      { month: 'Apr', sales: 2200 },
      { month: 'May', sales: 2600 },
      { month: 'Jun', sales: 2400 },
      { month: 'Jul', sales: 2700 },
      { month: 'Aug', sales: 2900 },
      { month: 'Sep', sales: 3100 },
      { month: 'Oct', sales: 2800 },
      { month: 'Nov', sales: 2500 },
      { month: 'Dec', sales: 3000 },
    ]
  };

  return (
    <main className="p-6 bg-gray-900 overflow-y-auto max-h-[calc(100vh-71px)]">
      <StatsGrid />
      <OrdersTable orders={orders} />
      <div className="bg-gray-800 rounded-xl p-6 mt-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Monthly Sales</h2>
          <select 
            className="bg-gray-700 text-white rounded-lg px-3 py-1 border border-gray-600"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
          </select>
        </div>

        <div className="w-full h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={salesData[selectedYear as keyof typeof salesData]}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{ 
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '0.5rem',
                  color: '#fff'
                }}
              />
              <Bar dataKey="sales" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </main>
  );
}