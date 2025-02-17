import React, { useState } from 'react';
import { ChevronDownIcon, CalendarIcon, UserIcon, Map } from 'lucide-react';

interface Order {
  InvoiceId: string;
  status: string;
  customerName: string;
  customerLocation: string;
  productName: string;
  quantity: number;
  totalAmount: number;
  PaidAmount: number;
  PendingAmount: number;
  dueDate: string;
  Measurement: string;
  Fabric: string;
  assignedTo: string;
}

interface OrderCardProps {
  order: Order;
}

const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-500';
      case 'in progress': return 'bg-yellow-500';
      case 'overdue': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const progressPercentage: number = (order.PaidAmount / order.totalAmount) * 100;

  return (
    <div className="bg-gray-800 rounded-xl p-4 my-3 w-11/12 max-w-sm mx-auto shadow-lg">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-white text-lg font-bold">{order.InvoiceId}</h2>
        <span className={`${getStatusColor(order.status)} text-xs font-semibold px-2 py-1 rounded-full`}>
          {order.status}
        </span>
      </div>

      <div className="text-gray-300 text-sm mb-2">
        <div className="flex items-center">
          <UserIcon className="h-4 w-4 mr-2" />
          {order.customerName}
        </div>
        <div className="flex items-center mt-1">
          <Map className="h-4 w-4 mr-2" />
          {order.customerLocation}
        </div>
      </div>

      <div className="text-white mb-2">
        <p>{order.productName} (x{order.quantity})</p>
        <p className="font-semibold">Total: ${order.totalAmount.toFixed(2)}</p>
      </div>

      <div className="mb-2">
        <div className="flex justify-between text-sm text-gray-400">
          <span>Paid: ${order.PaidAmount.toFixed(2)}</span>
          <span>Pending: ${order.PendingAmount.toFixed(2)}</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
          <div 
            className="bg-blue-500 h-2 rounded-full" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      <div className="flex items-center text-gray-400 text-sm mb-2">
        <CalendarIcon className="h-4 w-4 mr-2" />
        Due: {new Date(order.dueDate).toLocaleDateString()}
      </div>

      <div 
        className="text-gray-400 text-sm mb-2 cursor-pointer flex items-center"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <ChevronDownIcon className={`h-4 w-4 mr-1 transition-transform ${isExpanded ? 'transform rotate-180' : ''}`} />
             {isExpanded ? 'Hide Details' : 'Show Details'}
      </div>

      {isExpanded && (
        <div className="text-gray-300 text-sm mt-2">
          <p>Measurement: {order.Measurement}</p>
          <p>Fabric: {order.Fabric}</p>
          <p>Assigned to: {order.assignedTo}</p>
        </div>
      )}

      <button className="w-full bg-blue-500 text-white py-2 rounded-md mt-3 hover:bg-blue-600 transition-colors duration-200">
        Update Order
      </button>
    </div>
  );
};

export default OrderCard;

