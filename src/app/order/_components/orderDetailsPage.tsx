import React from 'react';
import { CheckCircle, Clock, Truck, Package, Scissors, CreditCard, Wallet } from 'lucide-react';
import { OrderData, OrderStep } from '@/types/index';
import { PDFDownloadLink } from '@react-pdf/renderer';
import OrderInvoicePDF from '@/app/dashboard/_components/orderInvoiceForSingle';
import CheckoutButton from './checkout';

interface OrderDetailsPageProps {
    orderData: OrderData;
}

const OrderDetailsPage: React.FC<OrderDetailsPageProps> = ({ orderData }) => {
    const formatDate = (dateString: string): string => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const steps: OrderStep[] = [
        {
            title: 'Order Placed',
            description: 'Your order has been received',
            icon: Package,
            date: formatDate(orderData.date)
        },
        {
            title: 'Processing',
            description: 'Measurements verified',
            icon: Clock,
            date: formatDate(orderData.date)
        },
        {
            title: 'Tailoring',
            description: 'Your outfit is being crafted',
            icon: Scissors,
            date: 'Estimated: ' + formatDate(orderData.deliveryDate)
        },
        {
            title: 'Ready',
            description: 'Your outfit is ready',
            icon: CheckCircle,
            date: formatDate(orderData.deliveryDate)
        },
        {
            title: 'Delivered',
            description: 'Order completed',
            icon: Truck,
            date: formatDate(orderData.deliveryDate)
        }
    ];

    const getCurrentStep = (status: string): number => {
        switch (status) {
            case 'PROCCESSING':
                return 1;
            case 'TAILORING':
                return 2;
            case 'READY':
                return 3;
            case 'DELIVERED':
                return 4;
            default:
                return 0;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800';
            case 'COMPLETED':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-blue-100 text-blue-800';
        }
    };

    const currentStep = getCurrentStep(orderData.status);

 
    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
                <div className="max-w-4xl flex justify-between items-center mx-auto px-4 py-8">
                    <div>
                        <h1 className="text-3xl font-bold">Order Details</h1>
                        <p className="mt-2 text-blue-100">Invoice #{orderData.InvoiceId}</p>
                    </div>
                    <StatusBadge status={orderData.status} />
                </div>
            </div>

            <div className="overflow-y-auto max-h-[calc(100vh-81px-108px)]">
                {/* Order Tracking */}
                <div className="max-w-4xl mx-auto px-4 py-8">
                    <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
                        <h2 className="text-xl font-semibold text-gray-900 mb-8">Order Status</h2>
                        <div className="relative">
                            {/* Progress Line */}
                            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 rounded-full" />
                            <div
                                className="absolute top-1/2 left-0 h-1 bg-blue-500 -translate-y-1/2 transition-all duration-500 rounded-full"
                                style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                            />
                            {/* Steps */}
                            <div className="relative flex justify-between">
                                {steps.map((step, index) => {
                                    const StepIcon = step.icon;
                                    const isCompleted = index <= currentStep;
                                    const isCurrent = index === currentStep;
                                    return (
                                        <div key={step.title} className="flex flex-col items-center">
                                            <div
                                                className={`w-12 h-12 rounded-full flex items-center justify-center 
                                                ${isCompleted ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'} 
                                                ${isCurrent ? 'ring-4 ring-blue-100' : ''} 
                                                transition-all duration-200 shadow-sm`}
                                            >
                                                <StepIcon className="w-6 h-6" />
                                            </div>
                                            <div className="text-center mt-4">
                                                <p className={`text-sm font-semibold ${isCompleted ? 'text-blue-600' : 'text-gray-500'}`}>
                                                    {step.title}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">{step.description}</p>
                                                <p className="text-xs text-gray-400 mt-1">{step.date}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>


                {/* Main Content */}
                <div className="max-w-4xl mx-auto px-4 space-y-6 pb-12">
                    <PaymentBreakdown total={orderData.totalAmount} paid={orderData.PaidAmount} pending={orderData.PendingAmount} />

                    {/* Order Summary */}
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Order Date</h3>
                                <p className="mt-2 text-gray-900 font-medium">{formatDate(orderData.date)}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Delivery Date</h3>
                                <p className="mt-2 text-gray-900 font-medium">{formatDate(orderData.deliveryDate)}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Status</h3>
                                <p className="mt-2">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                        {orderData.status}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Customer Details */}
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Customer Information</h2>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <h3 className="text-sm font-medium text-gray-500">Name</h3>
                                <p className="mt-2 text-gray-900 font-medium">{orderData.Customer.name}</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                                <p className="mt-2 text-gray-900 font-medium">{orderData.Customer.phone}</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <h3 className="text-sm font-medium text-gray-500">Location</h3>
                                <p className="mt-2 text-gray-900 font-medium">{orderData.Customer.location}</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <h3 className="text-sm font-medium text-gray-500">Total Orders</h3>
                                <p className="mt-2 text-gray-900 font-medium">{orderData.Customer.totalOrders}</p>
                            </div>
                        </div>
                    </div>

                    {/* Transaction History */}
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Transaction History</h2>
                        <div className="space-y-4">
                            {orderData.Transactions.map((transaction) => (
                                <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center space-x-4">
                                        {transaction.paymentType === 'CASH' ? (
                                            <Wallet className="w-8 h-8 text-green-600" />
                                        ) : (
                                            <CreditCard className="w-8 h-8 text-blue-600" />
                                        )}
                                        <div>
                                            <p className="font-medium text-gray-900">{transaction.paymentType}</p>
                                            <p className="text-sm text-gray-500">{formatDate(transaction.paymentDate)}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium text-gray-900">₹{transaction.amount}</p>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                                            {orderData.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>


                    {/* Product Details */}
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Product Details</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <h3 className="text-sm font-medium text-gray-500">Product</h3>
                                <p className="mt-2 text-gray-900 font-medium">{orderData.product.name}</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <h3 className="text-sm font-medium text-gray-500">Quantity</h3>
                                <p className="mt-2 text-gray-900 font-medium">{orderData.quantity}</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <h3 className="text-sm font-medium text-gray-500">Price</h3>
                                <p className="mt-2 text-gray-900 font-medium">₹{orderData.product.price}</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <h3 className="text-sm font-medium text-gray-500">Total</h3>
                                <p className="mt-2 text-gray-900 font-medium">₹{orderData.totalAmount}</p>
                            </div>
                        </div>
                    </div>

                    {/* Measurements */}
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Measurements</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                            {orderData.Measurement[0] && Object.entries(orderData.Measurement[0])
                                .filter(([key]) => !['id', 'orderId', 'createdAt', 'updatedAt', 'orderInvoiceId', 'productName', 'fabricId'].includes(key))
                                .slice(0, orderData.Measurement.length - 2).map(([key, value]) => (
                                    <div key={key} className="p-4 bg-gray-50 rounded-lg border">
                                        <h3 className="text-sm font-medium text-gray-500 capitalize">{key}</h3>
                                        <p className="mt-2 text-gray-900 font-medium">{value}</p>
                                    </div>
                                ))}
                        </div>
                        {orderData.Measurement[0]?.notes && (
                            <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                                <h3 className="text-sm font-medium text-yellow-800">Notes</h3>
                                <p className="mt-2 text-yellow-700">{orderData.Measurement[0].notes}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>


            {/* Footer */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 shadow-inner">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex space-x-8">
                            <div>
                                <p className="text-sm text-gray-500">Total Amount</p>
                                <p className="text-xl font-semibold text-blue-600">₹{orderData.totalAmount}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Paid Amount</p>
                                <p className="text-xl font-semibold text-green-600">₹{orderData.PaidAmount}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Pending Amount</p>
                                <p className="text-xl font-semibold text-red-600">₹{orderData.PendingAmount}</p>
                            </div>
                        </div>
                        <div className="flex space-x-4">
                            <button className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                                Cancel Order
                            </button>
                            {orderData.paymentStatus !== "FULL PAYMENT" && (
                              <CheckoutButton />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Styling Utilities
const StatusBadge = ({ status }: { status: string }) => {
    const getStatusStyles = (status: string) => {
        switch (status.toUpperCase()) {
            case 'PROCCESSING':
                return 'bg-yellow-100 text-yellow-800';
            case 'TAILORING':
                return 'bg-blue-100 text-blue-800';
            case 'READY':
                return 'bg-green-100 text-green-800';
            case 'DELIVERED':
                return 'bg-purple-100 text-purple-800';
            case 'NO PAYMENT':
                return 'bg-red-100 text-red-800';
            case 'PARTIAL PAYMENT':
                return 'bg-orange-100 text-orange-800';
            case 'FULL PAYMENT':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusStyles(status)}`}>
            {status}
        </span>
    );
};

// Card Components
const InfoCard = ({ title, children, className = '' }: { title: string; children: React.ReactNode; className?: string }) => (
    <div className={`bg-white rounded-xl shadow-sm p-6 border border-gray-100 ${className}`}>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">{title}</h2>
        {children}
    </div>
);

const DataField = ({ label, value, className = '' }: { label: string; value: React.ReactNode; className?: string }) => (
    <div className={`p-4 bg-gray-50 rounded-lg ${className}`}>
        <h3 className="text-sm font-medium text-gray-500">{label}</h3>
        <div className="mt-2 text-gray-900 font-medium">{value}</div>
    </div>
);

// Additional Features
const PaymentBreakdown = ({ paid, pending, total }: { paid: number; pending: number; total: number }) => (
    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="text-sm font-semibold text-blue-800 mb-3">Payment Breakdown</h3>
        <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
                <div>
                    <span className="text-xs font-semibold inline-block text-blue-800">
                        {Math.round((paid / total) * 100)}% Paid
                    </span>
                </div>
                <div className="text-right">
                    <span className="text-xs font-semibold inline-block text-blue-800">
                        ₹{paid} / ₹{total}
                    </span>
                </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                <div
                    style={{ width: `${(paid / total) * 100}%` }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                />
            </div>
        </div>
    </div>
);

// Export the enhanced component
export default OrderDetailsPage;