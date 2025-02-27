import { useState } from "react";
import Modal from "../../_components/Modal";

export default function OrdersTable({ filteredOrders }: {filteredOrders: any[]}) {
  const [selectedRelationData, setSelectedRelationData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");

  const handleViewRelation = (title: string, relatedData: any) => {
    setModalTitle(title);
    setSelectedRelationData(relatedData);
    setShowModal(true);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-gray-300">
        <thead className="text-gray-400 border-b border-gray-700">
          <tr>
            <th className="pb-3 px-4">Invoice ID</th>
            <th className="pb-3 px-4">Date</th>
            <th className="pb-3 px-4">Customer</th>
            <th className="pb-3 px-4">Location</th>
            <th className="pb-3 px-4">Total</th>
            <th className="pb-3 px-4">Total Paid</th>
            <th className="pb-3 px-4">Total Pending</th>
            <th className="pb-3 px-4">Status</th>
            <th className="pb-3 px-4">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {filteredOrders.map((order) => (
            <tr
              key={order.InvoiceId}
              className="hover:bg-gray-700 cursor-pointer"
            >
              <td className="py-2 px-4">{order.InvoiceId}</td>
              <td className="py-2 px-4">
                {new Date(order.createdAt).toLocaleDateString()}
              </td>
              <td
                className="py-2 px-4 text-blue-400 hover:text-blue-300 cursor-pointer"
                onClick={() => handleViewRelation("Customer Details", [order.customer])}
              >
                {order.customerName}
              </td>
              <td className="py-2 px-4">{order.customerLocation}</td>
              <td className="py-2 px-4">{order.totalAmount.toFixed(2)}</td>
              <td className="py-2 px-4">{order.PaidAmount.toFixed(2)}</td>
              <td className="py-2 px-4">{order.PendingAmount.toFixed(2)}</td>
              <td className="py-2 px-4">
                <span
                  className={`px-2 py-0.5 text-xs rounded ${
                    order.status.toLowerCase() === "delivered"
                      ? "bg-green-500/10 text-green-500"
                      : order.status.toLowerCase() === "confirmed"
                      ? "bg-yellow-500/20 text-yellow-500"
                      : order.status.toLowerCase() === "processing"
                      ? "bg-blue-500/10 text-blue-500"
                      : order.status.toLowerCase() === "tailoring"
                      ? "bg-orange-500/10 text-orange-500"
                      : order.status.toLowerCase() === "ready"
                      ? "bg-green-500/10 text-green-500"
                      : order.status.toLowerCase() === "cancelled"
                      ? "bg-red-500/10 text-red-500"
                      : "bg-gray-500/10 text-gray-500"
                  }`}
                >
                  {order.status}
                </span>
              </td>
              <td className="py-2 px-4 space-x-2">
                <button
                  className="text-blue-400 hover:text-blue-300"
                  onClick={() => handleViewRelation("Order Items", order.items)}
                >
                  View Items
                </button>
                <button
                  className="text-green-400 hover:text-green-300"
                  onClick={() => handleViewRelation("Payment Details", order.payments)}
                >
                  View Payments
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <h2 className="text-lg font-semibold mb-4">{modalTitle}</h2>
          <table className="w-full text-left text-gray-300 border border-gray-700">
            <thead className="text-gray-400 border-b border-gray-700">
              <tr>
                {selectedRelationData.length > 0 &&
                  Object.keys(selectedRelationData[0]).map((key) => (
                    <th key={key} className="pb-2 px-4 capitalize">
                      {key}
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {selectedRelationData.map((record, index) => (
                <tr key={index}>
                  {Object.values(record).map((value, idx) => (
                    <td key={idx} className="py-2 px-4">
                      {typeof value === "number" ? value.toFixed(2) : String(value)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Modal>
      )}
    </div>
  );
}
