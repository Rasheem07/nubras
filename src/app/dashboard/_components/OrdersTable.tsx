interface Order {
    id: string;
    customer: string;
    product: string;
    amount: string;
    status: 'Completed' | 'Pending' | 'Processing';
  }
  
  const statusStyles = {
    Completed: "bg-green-500/10 text-green-500",
    Pending: "bg-yellow-500/10 text-yellow-500",
    Processing: "bg-blue-500/10 text-blue-500",
  };
  
  export default function OrdersTable({ orders }: { orders: Order[] }) {
    return (
      <div className="bg-gray-800 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-gray-300">
            <thead className="text-gray-400 border-b border-gray-700">
              <tr>
                <th className="pb-3">Order ID</th>
                <th className="pb-3">Customer</th>
                <th className="pb-3">Product</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-700">
                  <td className="py-3">{order.id}</td>
                  <td>{order.customer}</td>
                  <td>{order.product}</td>
                  <td>{order.amount}</td>
                  <td>
                    <span className={`px-2 py-1 rounded ${statusStyles[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }