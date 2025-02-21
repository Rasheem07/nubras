'use client'
import { useState } from 'react';
import Link from 'next/link';
import { PDFDownloadLink } from '@react-pdf/renderer';
import * as XLSX from 'xlsx';
import { useReactToPrint } from 'react-to-print';
import { useRef } from 'react';
import { ClipboardCheck, Package, PackageCheck, Truck } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import OrderPDF from '../../_components/orderInvoiceForSingle';

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

const OrderDetailsPage = () => {

    const { InvoiceId } = useParams();
    const componentRef = useRef<HTMLDivElement>(null);
    const handlePrint = useReactToPrint({
        contentRef: componentRef,
        documentTitle: `Invoice-${InvoiceId || 'Order'}`,
    });



    const getOrderById = async (InvoiceId: string) => {
        const response = await fetch(`http://34.18.99.10/orders/${InvoiceId}`);
        return response.json();
    }

    const { data: selectedOrder, isLoading, error } = useQuery({
        queryKey: ['order', InvoiceId],
        queryFn: () => getOrderById(InvoiceId as string),
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

    if (isLoading) return <div>Loading...</div>;
    return (
        <div ref={componentRef} className="p-8 rounded-xl  w-full overflow-y-auto max-h-[calc(100vh-71px)]">
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
                <div className="bg-gray-800 border border-gray-700 p-4 rounded-lg">
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
                <div className="bg-gray-800 border border-gray-700 p-4 rounded-lg">
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
                            <td className="py-4 px-4 text-right">${Number(selectedOrder.productPrice)?.toFixed(2)}</td>
                            <td className="py-4 px-4 text-right">${Number(selectedOrder.totalAmount)?.toFixed(2)}</td>
                        </tr>
                    </tbody>

                    <tfoot className="border-t border-gray-600">

                        <tr>
                            <td colSpan={3} className="py-4 px-4 text-right font-semibold">Total Amount:</td>
                            <td className="py-4 px-4 text-right font-bold text-white">${Number(selectedOrder.totalAmount)?.toFixed(2)}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>

    )
}


export default OrderDetailsPage;