"use client"

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useState } from 'react';
import Link from 'next/link';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Loader2, Package, Truck, CheckCircle2, ClipboardCheck, PackageCheck } from 'lucide-react';
import * as XLSX from 'xlsx';
import { useReactToPrint } from 'react-to-print';
import { useRef } from 'react';
import OrderInvoicePDF from "../../_components/OrderInvoicePDF";
import Modal from "../../_components/Modal";
import OrderPDF from "../../_components/orderInvoiceForSingle";

interface Order {
    InvoiceId: string;
    date: Date;
    branch: string;
    status: string;
    orderedFrom: string;
    customerName: string;
    customerLocation: string;
    paymentStatus: string;
    productName: string;
    productPrice: number;
    salesPersonName: string;
    quantity: number;
    totalAmount: number;
    deliveryDate?: Date;
    paymentDate?: Date;
    orderRegisteredBy?: string;
}

export default function CustomerInvoicesPage() {

    const { id } = useParams();

    const { data, isLoading, error } = useQuery({
        queryKey: ['salesPersonInvoices', id],
        queryFn: () => getSalesPersonInvoices(id as string),
    });

    const getSalesPersonInvoices = async (id: string) => {
        const response = await fetch(`http://alnubrasstudio.ddns.net/orders/sales-person/${id}`);
        return response.json();
    }

    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const componentRef = useRef<HTMLDivElement>(null);
    const handlePrint = useReactToPrint({
        contentRef: componentRef,
        documentTitle: `Invoice-${selectedOrder?.InvoiceId || 'Order'}`,
    });


    const getOrderStage = (status: string) => {
        switch (status) {
            case 'Pending': return 1;
            case 'Processing': return 2;
            case 'Shipped': return 3;
            case 'Completed': return 4;
            default: return 0;
        }
    };

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredOrders.map((order: Order) => ({
            'Invoice ID': order.InvoiceId,
            'Date': new Date(order.date).toLocaleDateString(),
            'Customer Name': order.customerName,
            'Location': order.customerLocation,
            'Product': order.productName,
            'Price': order.productPrice,

            'Quantity': order.quantity,
            'Total Amount': order.totalAmount,
            'Status': order.status,
            'Branch': order.branch,
            'Ordered From': order.orderedFrom,
            'Sales Person': order.salesPersonName,
            'Payment Status': order.paymentStatus
        })));

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders');
        XLSX.writeFile(workbook, 'orders.xlsx');
    };

    const filteredOrders = data && data.filter((order: Order) => {
        try {
            const search = searchTerm.toLowerCase().trim();

            if (!search) {
                return statusFilter === 'all' || order.status === statusFilter;
            }

            const searchableFields = [
                order?.InvoiceId,
                order?.customerName,
                order?.customerLocation,
                order?.productName,
                order?.salesPersonName,
                order?.branch,
                order?.orderedFrom,
                order?.status,
                order?.paymentStatus,
                order?.productPrice?.toString(),
                order?.quantity?.toString(),
                order?.orderRegisteredBy,
                order?.date ? new Date(order.date).toLocaleDateString() : ''
            ].filter(Boolean).map(field => field!.toLowerCase());

            const matchesSearch = searchableFields.some(field => field.includes(search));
            const matchesStatus = statusFilter === 'all' || order.status === statusFilter.toUpperCase();


            return matchesSearch && matchesStatus;
        } catch (error) {
            console.error('Error filtering order:', error);
            return false;
        }
    });

    const handleOrderClick = (order: Order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    if (isLoading) {
        return (
            <div className="p-6 mt-12 bg-gray-900 text-white flex flex-col items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-2" />
                <p className="text-gray-400">Loading orders...</p>
            </div>
        );
    }

    if (error) {
        return <div className="p-6 bg-gray-900 text-red-500">Error loading orders: {error.message}</div>;
    }

    if (filteredOrders.length === 0) {
        return (
            <div className="p-6 bg-gray-900">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-white">Orders</h1>
                    <Link
                        href="/orders/create"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
                        New Order
                    </Link>
                </div>

                <div className="bg-gray-800 rounded-xl p-6">
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="Search orders by any field..."
                                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 border border-gray-600"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <select
                            className="bg-gray-700 text-white rounded-lg px-4 py-2 border border-gray-600"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">All Status</option>
                            <option value="Completed">Completed</option>
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                        </select>
                    </div>

                    <div className="text-center py-8 text-gray-400">
                        <p>No orders found matching your search criteria.</p>
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setStatusFilter('all');
                            }}
                            className="mt-4 text-blue-400 hover:text-blue-300"
                        >
                            Clear filters
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-900 overflow-y-auto max-h-[calc(100vh-71px)]">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-white">Orders</h1>
                <Link
                    href="/orders/create"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
                    New Order
                </Link>
            </div>

            <div className="bg-gray-800 rounded-xl p-6">
                <div className="flex flex-col sm:flex-row items-start gap-4 mb-6">
                    <div className="flex-1 w-full">
                        <div className="relative pb-2">
                            <input
                                type="text"
                                placeholder="Search orders by any field..."
                                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 border border-gray-600"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            {searchTerm && (
                                <p className="absolute left-0 -bottom-4 text-green-400 text-sm">
                                    Found {filteredOrders.length} matching orders
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="flex gap-4 items-start">
                        <select
                            className="bg-gray-700 text-white rounded-lg px-4 py-2 border border-gray-600 whitespace-nowrap"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">All Status</option>
                            <option value="Completed">Completed</option>
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                        </select>
                        <PDFDownloadLink
                            document={<OrderInvoicePDF orders={filteredOrders} />}
                            fileName="orders.pdf"
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                            Export PDF
                        </PDFDownloadLink>
                        <button
                            onClick={exportToExcel}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><line x1="10" y1="9" x2="8" y2="9" /></svg>
                            Export Excel
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-gray-300">
                        <thead className="text-gray-400 border-b border-gray-700">
                            <tr>
                                <th className="pb-3 px-4">Invoice ID</th>
                                <th className="pb-3 px-4">Date</th>
                                <th className="pb-3 px-4">Customer</th>
                                <th className="pb-3 px-4">Location</th>
                                <th className="pb-3 px-4">Product</th>
                                <th className="pb-3 px-4">Price</th>
                                <th className="pb-3 px-4">Quantity</th>
                                <th className="pb-3 px-4">Total</th>
                                <th className="pb-3 px-4">Status</th>
                                <th className="pb-3 px-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {filteredOrders.map((order: Order) => (
                                <tr key={order.InvoiceId} className="hover:bg-gray-700 cursor-pointer" onClick={() => handleOrderClick(order)}>
                                    <td className="py-2 px-4">{order.InvoiceId}</td>
                                    <td className="py-2 px-4">{new Date(order.date).toLocaleDateString()}</td>
                                    <td className="py-2 px-4">{order.customerName}</td>
                                    <td className="py-2 px-4">{order.customerLocation}</td>
                                    <td className="py-2 px-4">{order.productName}</td>
                                    <td className="py-2 px-4">${order.productPrice.toFixed(2)}</td>
                                    <td className="py-2 px-4">{order.quantity}</td>
                                    <td className="py-2 px-4">${order.totalAmount.toFixed(2)}</td>
                                    <td className="py-2 px-4">
                                        <span className={`px-2 py-0.5 text-xs rounded ${order.status.toLowerCase() === 'completed' ? 'bg-green-500/10 text-green-500' :
                                                order.status.toLowerCase() === 'pending' ? 'bg-yellow-500/20 text-yellow-500' :
                                                    order.status.toLowerCase() === 'processing' ? 'bg-blue-500/10 text-blue-500' :
                                                        order.status.toLowerCase() === 'delivered' ? 'bg-green-500/10 text-green-500' :
                                                            order.status.toLowerCase() === 'cancelled' ? 'bg-red-500/10 text-red-500' :
                                                                'bg-gray-500/10 text-gray-500'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="py-2 px-4">
                                        <button className="text-blue-400 hover:text-blue-300">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && selectedOrder && (
                <Modal onClose={() => setIsModalOpen(false)}>
                    <div ref={componentRef} className="bg-gray-800 p-8 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-2">Order Details</h2>
                                <p className="text-gray-400">Invoice Date: {new Date(selectedOrder.date).toLocaleDateString()}</p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handlePrint()}
                                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
                                    Print
                                </button>
                                <PDFDownloadLink
                                    document={<OrderPDF order={selectedOrder} />}
                                    fileName={`invoice-${selectedOrder.InvoiceId}.pdf`}
                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2"
                                >

                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                                    Download PDF
                                </PDFDownloadLink>
                            </div>
                        </div>

                        <div className="mb-8">
                            <div className="relative">
                                <div className="absolute top-5 left-0 right-0 h-0.5">
                                    <div className="h-full bg-gray-600 w-full" />
                                    <div
                                        className="h-full bg-emerald-500 absolute top-0 left-0 transition-all duration-500"
                                        style={{ width: `${(getOrderStage(selectedOrder.status) / 4) * 100}%` }}
                                    />
                                </div>
                                <div className="flex justify-between mb-2 relative">
                                    <div className="flex flex-col items-center flex-1">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 ${getOrderStage(selectedOrder.status) >= 1
                                            ? 'bg-emerald-500 ring-2 ring-emerald-300'
                                            : getOrderStage(selectedOrder.status) === 0
                                                ? 'bg-yellow-500 ring-2 ring-yellow-300'
                                                : 'bg-gray-600'
                                            }`}>
                                            <ClipboardCheck className={`w-5 h-5 ${getOrderStage(selectedOrder.status) >= 1 ? 'text-white' : 'text-gray-300'}`} />
                                        </div>
                                        <span className={`text-sm mt-2 ${getOrderStage(selectedOrder.status) === 1 ? 'font-bold text-white' : 'text-gray-300'}`}>Confirmed</span>
                                    </div>
                                    <div className="flex flex-col items-center flex-1">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 ${getOrderStage(selectedOrder.status) >= 2
                                            ? 'bg-emerald-500 ring-2 ring-emerald-300'
                                            : getOrderStage(selectedOrder.status) === 1
                                                ? 'bg-yellow-500 ring-2 ring-yellow-300'
                                                : 'bg-gray-600'
                                            }`}>
                                            <Package className={`w-5 h-5 ${getOrderStage(selectedOrder.status) >= 2 ? 'text-white' : 'text-gray-300'}`} />
                                        </div>
                                        <span className={`text-sm mt-2 ${getOrderStage(selectedOrder.status) === 2 ? 'font-bold text-white' : 'text-gray-300'}`}>Packed</span>
                                    </div>
                                    <div className="flex flex-col items-center flex-1">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 ${getOrderStage(selectedOrder.status) >= 3
                                            ? 'bg-emerald-500 ring-2 ring-emerald-300'
                                            : getOrderStage(selectedOrder.status) === 2
                                                ? 'bg-yellow-500 ring-2 ring-yellow-300'
                                                : 'bg-gray-600'
                                            }`}>
                                            <Truck className={`w-5 h-5 ${getOrderStage(selectedOrder.status) >= 3 ? 'text-white' : 'text-gray-300'}`} />
                                        </div>
                                        <span className={`text-sm mt-2 ${getOrderStage(selectedOrder.status) === 3 ? 'font-bold text-white' : 'text-gray-300'}`}>Shipped</span>
                                    </div>
                                    <div className="flex flex-col items-center flex-1">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 ${getOrderStage(selectedOrder.status) >= 4
                                            ? 'bg-emerald-500 ring-2 ring-emerald-300'
                                            : getOrderStage(selectedOrder.status) === 3
                                                ? 'bg-yellow-500 ring-2 ring-yellow-300'
                                                : 'bg-gray-600'
                                            }`}>
                                            <PackageCheck className={`w-5 h-5 ${getOrderStage(selectedOrder.status) >= 4 ? 'text-white' : 'text-gray-300'}`} />
                                        </div>
                                        <span className={`text-sm mt-2 ${getOrderStage(selectedOrder.status) === 4 ? 'font-bold text-white' : 'text-gray-300'}`}>Delivered</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-8 mb-8 text-gray-300">
                            <div className="bg-gray-700/30 p-4 rounded-lg">
                                <h3 className="font-semibold text-lg mb-2 text-white">Order Information</h3>
                                <p><span className="text-gray-400">Invoice ID:</span> {selectedOrder.InvoiceId}</p>
                                <p><span className="text-gray-400">Branch:</span> {selectedOrder.branch}</p>
                                <p><span className="text-gray-400">Ordered From:</span> {selectedOrder.orderedFrom}</p>
                                <p><span className="text-gray-400">Sales Person:</span> {selectedOrder.salesPersonName}</p>
                                <p><span className="text-gray-400">Status:</span>
                                    <span className={`ml-2 px-2 py-0.5 rounded text-sm ${selectedOrder.status === 'Completed' ? 'bg-green-500/10 text-green-500' :
                                        selectedOrder.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-500' :
                                            'bg-blue-500/10 text-blue-500'
                                        }`}>
                                        {selectedOrder.status}
                                    </span>
                                </p>
                            </div>
                            <div className="bg-gray-700/30 p-4 rounded-lg">
                                <h3 className="font-semibold text-lg mb-2 text-white">Customer Details</h3>
                                <p><span className="text-gray-400">Name:</span> {selectedOrder.customerName}</p>
                                <p><span className="text-gray-400">Location:</span> {selectedOrder.customerLocation}</p>
                                <p><span className="text-gray-400">Payment Status:</span> {selectedOrder.paymentStatus}</p>
                            </div>
                        </div>

                        <div className="bg-gray-700/30 rounded-lg overflow-hidden mb-6">
                            <table className="w-full text-gray-300">
                                <thead className="bg-gray-700">
                                    <tr>
                                        <th className="text-left py-3 px-4">Product</th>
                                        <th className="text-right py-3 px-4">Quantity</th>
                                        <th className="text-right py-3 px-4">Unit Price</th>
                                        <th className="text-right py-3 px-4">Total Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="py-4 px-4">{selectedOrder.productName}</td>
                                        <td className="py-4 px-4 text-right">{selectedOrder.quantity}</td>
                                        <td className="py-4 px-4 text-right">${selectedOrder.productPrice.toFixed(2)}</td>
                                        <td className="py-4 px-4 text-right">${selectedOrder.totalAmount.toFixed(2)}</td>
                                    </tr>
                                </tbody>
                                <tfoot className="border-t border-gray-600">
                                    <tr>
                                        <td colSpan={3} className="py-4 px-4 text-right font-semibold">Total Amount:</td>
                                        <td className="py-4 px-4 text-right font-bold text-white">${selectedOrder.totalAmount.toFixed(2)}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}