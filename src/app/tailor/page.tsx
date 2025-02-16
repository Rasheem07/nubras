'use client'
import React, { useState } from 'react';
import { 
  Scissors, Calendar, Package, CheckCircle, DollarSign, 
  Ruler, X, CreditCard, Clock, FilePlus, Search, Menu,
  ChevronUp
} from 'lucide-react';

// Keeping your existing interfaces
interface Measurements {
  chest?: number;
  waist?: number;
  shoulder?: number;
  sleeve?: number;
  inseam?: number;
  neck?: number;
  bust?: number;
  hip?: number;
  length?: number;
  armhole?: number;
}

interface Order {
  id: number;
  customer: string;
  phone: string;
  garment: string;
  measurements: Measurements;
  details: string;
  fabricType: string;
  fabricColor: string;
  deadline: string;
  status: string;
  price: number;
  depositPaid: number;
  fittingDate: string;
}

interface Fitting {
  id: number;
  customer: string;
  garment: string;
  date: string;
  time: string;
  notes: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
}

interface Payment {
  id: number;
  orderId: number;
  customer: string;
  amount: number;
  type: 'Deposit' | 'Balance' | 'Full Payment';
  date: string;
  method: 'Cash' | 'Card' | 'Transfer';
  status: 'Completed' | 'Pending';
}

const TailorDashboard = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Your existing state data
  const [orders] = useState([
    {
      id: 1,
      customer: "John Doe",
      phone: "+1 234-567-8900",
      garment: "Three-Piece Suit",
      measurements: {
        chest: 40,
        waist: 34,
        shoulder: 18,
        sleeve: 25,
        inseam: 32,
        neck: 16
      },
      details: "Peak lapels, double-breasted vest, pleated trousers",
      fabricType: "Wool Blend",
      fabricColor: "Navy Blue",
      deadline: "2025-02-20",
      status: "In Progress",
      price: 899.99,
      depositPaid: 300,
      fittingDate: "2025-02-18"
    },
    {
      id: 2,
      customer: "Jane Smith",
      phone: "+1 234-567-8901",
      garment: "Evening Gown",
      measurements: {
        bust: 36,
        waist: 28,
        hip: 38,
        length: 60,
        shoulder: 15,
        armhole: 16
      },
      details: "Mermaid style, sweetheart neckline, beaded bodice",
      fabricType: "Silk Satin",
      fabricColor: "Burgundy",
      deadline: "2025-02-25",
      status: "Fitting Scheduled",
      price: 599.99,
      depositPaid: 200,
      fittingDate: "2025-02-19"
    }
  ]);

  const [fittings] = useState<Fitting[]>([
    {
      id: 1,
      customer: "John Doe",
      garment: "Three-Piece Suit",
      date: "2025-02-18",
      time: "10:00 AM",
      notes: "First fitting - Jacket and vest",
      status: "Scheduled"
    },
    {
      id: 2,
      customer: "Jane Smith",
      garment: "Evening Gown",
      date: "2025-02-19",
      time: "2:00 PM",
      notes: "Final fitting before delivery",
      status: "Scheduled"
    }
  ]);

  const [payments] = useState<Payment[]>([
    {
      id: 1,
      orderId: 1,
      customer: "John Doe",
      amount: 300,
      type: "Deposit",
      date: "2025-02-15",
      method: "Card",
      status: "Completed"
    },
    {
      id: 2,
      orderId: 2,
      customer: "Jane Smith",
      amount: 200,
      type: "Deposit",
      date: "2025-02-16",
      method: "Cash",
      status: "Completed"
    }
  ]);

  const navItems = [
    { id: 'orders', icon: Package, label: 'Orders' },
    { id: 'measurements', icon: Ruler, label: 'Measurements' },
    { id: 'fittings', icon: Calendar, label: 'Fittings' },
    { id: 'payments', icon: CreditCard, label: 'Payments' },
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Top Navigation */}
      <nav className="fixed top-0 w-full bg-gray-800 border-b border-gray-700 z-20">
        <div className="px-4 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <button onClick={toggleSidebar} className="mr-4">
              <Menu className="h-6 w-6 text-gray-400" />
            </button>
            <Scissors className="h-6 w-6 text-indigo-400" />
            <span className="ml-2 text-lg font-semibold text-white">Tailor Studio</span>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Sheet Navigation */}
      <div className={`fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-300 ${
        isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`} onClick={toggleSidebar}>
        <div 
          className={`fixed bottom-0 left-0 right-0 bg-gray-800 rounded-t-2xl transform transition-transform duration-300 ${
            isSidebarOpen ? 'translate-y-0' : 'translate-y-full'
          }`}
          onClick={e => e.stopPropagation()}
        >
          <div className="p-4">
            <div className="flex justify-center mb-2">
              <div className="w-12 h-1 bg-gray-600 rounded-full" />
            </div>
            <div className="space-y-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center p-3 rounded-lg ${
                    activeTab === item.id 
                      ? 'bg-indigo-600 text-white' 
                      : 'text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="pt-16 px-4 pb-20">
        {/* Stats Cards - Now in a scrollable row */}
        <div className="overflow-x-auto py-4 -mx-4 px-4">
          <div className="flex space-x-4 w-max min-w-full">
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 w-60">
              <div className="flex items-center">
                <Package className="h-6 w-6 text-indigo-400" />
                <div className="ml-3">
                  <p className="text-sm text-gray-400">Active Orders</p>
                  <p className="text-xl font-semibold text-white">{orders.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 w-60">
              <div className="flex items-center">
                <Calendar className="h-6 w-6 text-indigo-400" />
                <div className="ml-3">
                  <p className="text-sm text-gray-400">Today's Fittings</p>
                  <p className="text-xl font-semibold text-white">3</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 w-60">
              <div className="flex items-center">
                <DollarSign className="h-6 w-6 text-yellow-400" />
                <div className="ml-3">
                  <p className="text-sm text-gray-400">Pending Payments</p>
                  <p className="text-xl font-semibold text-white">$1,299</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="mt-6">
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-white">Active Orders</h2>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm">
                  New Order
                </button>
              </div>
              <div className="space-y-4">
                {orders.map((order) => (
                  <div 
                    key={order.id} 
                    className="bg-gray-800 rounded-lg p-4 border border-gray-700"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-white font-medium">{order.customer}</h3>
                        <p className="text-gray-400 text-sm">{order.phone}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        order.status === 'Completed'
                          ? 'bg-green-900 text-green-300'
                          : 'bg-yellow-900 text-yellow-300'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="mb-3">
                      <p className="text-white text-sm">{order.garment}</p>
                      <p className="text-gray-400 text-sm">{order.fabricType} - {order.fabricColor}</p>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <div className="text-gray-400">
                        Fitting: {order.fittingDate}
                      </div>
                      <div className="text-white font-medium">
                        ${order.price - order.depositPaid} due
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Similar card-based layouts for other tabs */}
          {activeTab === 'measurements' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-white">Measurements</h2>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm">
                  Add New
                </button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search customers..."
                  className="w-full bg-gray-700 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <div className="mb-3">
                      <h3 className="text-white font-medium">{order.customer}</h3>
                      <p className="text-gray-400 text-sm">{order.garment}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(order.measurements).slice(0, 4).map(([key, value]) => (
                        <div key={key} className="bg-gray-700 p-2 rounded">
                          <p className="text-gray-400 text-xs capitalize">{key}</p>
                          <p className="text-white font-medium">{value}"</p>
                        </div>
                      ))}
                    </div>
                    <button className="mt-3 text-indigo-400 text-sm">
                      View All Measurements
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'fittings' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-white">Today's Fittings</h2>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm">
                  Schedule New
                </button>
              </div>
              <div className="space-y-4">
                {fittings.map((fitting) => (
                  <div key={fitting.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 text-indigo-400 mr-2" />
                        <div>
                          <p className="text-white font-medium">{fitting.time}</p>
                          <p className="text-gray-400 text-sm">{fitting.date}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        fitting.status === 'Scheduled' 
                          ? 'bg-yellow-900 text-yellow-300'
                          : 'bg-green-900 text-green-300'
                      }`}>
                        {fitting.status}
                      </span>
                    </div>
                    <div className="mb-3">
                      <h3 className="text-white font-medium">{fitting.customer}</h3>
                      <p className="text-gray-400 text-sm">{fitting.garment}</p>
                    </div>
                    <div className="bg-gray-700 p-3 rounded mb-3">
                      <p className="text-sm text-white">{fitting.notes}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="flex-1 bg-gray-700 text-white px-3 py-2 rounded text-sm">
                        Reschedule
                      </button>
                      <button className="flex-1 bg-indigo-600 text-white px-3 py-2 rounded text-sm">
                        Complete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-white">Payments</h2>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm">
                  Record Payment
                </button>
              </div>
              <select className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg mb-4">
                <option>All Payments</option>
                <option>Deposits</option>
                <option>Balances</option>
                <option>Completed</option>
                <option>Pending</option>
              </select>
              <div className="space-y-4">
                {payments.map((payment) => (
                  <div key={payment.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-white font-medium">{payment.customer}</h3>
                        <p className="text-gray-400 text-sm">Order #{payment.orderId}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        payment.status === 'Completed'
                          ? 'bg-green-900 text-green-300'
                          : 'bg-yellow-900 text-yellow-300'
                      }`}>
                        {payment.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400 text-sm">{payment.date}</span>
                      <span className="text-white font-medium">${payment.amount}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        payment.type === 'Deposit' 
                          ? 'bg-blue-900 text-blue-300'
                          : 'bg-purple-900 text-purple-300'
                      }`}>
                        {payment.type}
                      </span>
                      <span className="text-gray-400">{payment.method}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40">
          <div className="fixed bottom-0 left-0 right-0 bg-gray-800 rounded-t-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gray-800 p-4 border-b border-gray-700">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white">Order Details</h3>
                <button onClick={() => setSelectedOrder(null)}>
                  <X className="h-6 w-6 text-gray-400" />
                </button>
              </div>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2">Customer</h4>
                <p className="text-white">{selectedOrder.customer}</p>
                <p className="text-gray-400">{selectedOrder.phone}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2">Garment</h4>
                <p className="text-white">{selectedOrder.garment}</p>
                <p className="text-gray-400">{selectedOrder.fabricType} - {selectedOrder.fabricColor}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2">Measurements</h4>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(selectedOrder.measurements).map(([key, value]) => (
                    <div key={key} className="bg-gray-700 p-3 rounded-lg">
                      <p className="text-gray-400 text-sm capitalize">{key}</p>
                      <p className="text-white font-medium">{value}"</p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2">Details</h4>
                <p className="text-white">{selectedOrder.details}</p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-gray-700 p-3 rounded-lg">
                  <p className="text-gray-400 text-sm">Total Price</p>
                  <p className="text-white font-medium">${selectedOrder.price}</p>
                </div>
                <div className="bg-gray-700 p-3 rounded-lg">
                  <p className="text-gray-400 text-sm">Deposit</p>
                  <p className="text-white font-medium">${selectedOrder.depositPaid}</p>
                </div>
                <div className="bg-gray-700 p-3 rounded-lg">
                  <p className="text-gray-400 text-sm">Balance</p>
                  <p className="text-white font-medium">${selectedOrder.price - selectedOrder.depositPaid}</p>
                </div>
              </div>
              {selectedOrder.status !== 'Completed' && (
                <button className="w-full bg-green-600 text-white py-3 rounded-lg mt-4">
                  Mark as Completed
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TailorDashboard;