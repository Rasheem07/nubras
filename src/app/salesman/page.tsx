"use client"
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { Loader2, Package, Truck, CheckCircle2, ClipboardCheck, PackageCheck, XCircle, Trash, ArrowLeft, Box, TruckIcon, Scissors, ShoppingCart, Calendar, TimerReset, IdCard, ChartArea, Badge, ShoppingBag, User, AlertOctagon, Phone, Pin, Map, Banknote, Clock, Edit, LogOut } from 'lucide-react';
import * as XLSX from 'xlsx';
import { useReactToPrint } from 'react-to-print';
import { useRef } from 'react';
import { toast } from 'sonner';
import { Item, Order } from '../dashboard/orders/types/Order';
import Modal from '../dashboard/_components/Modal';
import DataTable from '../dashboard/_components/DataTable.';
import { useRouter } from 'next/navigation';

const fetchOrders = async (): Promise<Order[]> => {
    const response = await fetch('http://alnubrasstudio.ddns.net/orders/salesman', {
        credentials: 'include'
    });
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
};

export default function OrdersPage() {
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [transactionsModal, setTransactionsModel] = useState(false);
    const [CustomerModal, setCustomerModal] = useState(false);
    const [salespersonModal, setsalespersonModal] = useState(false);
    const [itemsModal, setitemsModal] = useState(false);
    const componentRef = useRef<HTMLDivElement>(null);
    const handlePrint = useReactToPrint({
        contentRef: componentRef,
        documentTitle: `Invoice-${selectedOrder?.InvoiceId || 'Order'}`,
    });

    const { data: orders = [], isLoading, error } = useQuery({
        queryKey: ['orders'],
        queryFn: fetchOrders,
        staleTime: 5 * 60 * 1000,
        gcTime: 30 * 60 * 1000
    });

    const getOrderStage = (status: string) => {
        switch (status) {
            case 'confirmed': return 1;
            case 'processing': return 2;
            case 'tailoring': return 3;
            case 'ready': return 4;
            case 'delivered': return 5;
            default: return 0;
        }
    };

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredOrders.map(order => ({
            'Invoice ID': order.InvoiceId,
            'Date': new Date(order.createdAt).toLocaleDateString(),
            'Customer Name': order.customerName,
            'Location': order.customerLocation,
            'Status': order.status,
            products: order.items
                .map((item) => `${item.productName} (${item.sectionName}) - ${item.quantity} x $${item.productPrice}`)
                .join("; "),
            'Branch': order.branch,
            'Ordered From': order.orderedFrom,
            'Sales Person': order.salesPersonName,
            'Payment Status': order.paymentStatus,
            'Cash amount': order.Transactions.filter(transaction => transaction.paymentType == "CASH").reduce((acc, item) => acc + item.amount, 0),
            'Bank transfer amount': order.Transactions.filter(transaction => transaction.paymentType == "BANK_TRANSFER").reduce((acc, item) => acc + item.amount, 0),
            'Visa amount': order.Transactions.filter(transaction => transaction.paymentType == "VISA").reduce((acc, item) => acc + item.amount, 0),
            'Total Amount': order.totalAmount,
            'pending amount': order.PendingAmount,
            'Total paid amount': order.PaidAmount,
            'Payment due date': new Date(order.PaymentdueDate).toLocaleDateString(),
            'Deliver date': new Date(order.deliveryDate).toLocaleDateString(),
            'Payment complete Date': order.paymentDate ? new Date(order.paymentDate).toLocaleDateString() : ""
        })));

        const productsSheet = XLSX.utils.json_to_sheet(
            filteredOrders.flatMap(order =>
                order.items.map(item => ({
                    'Invoice ID': order.InvoiceId,
                    'Product Name': item.productName,
                    'Section': item.sectionName,
                    'Price': item.productPrice,
                    'Quantity': item.quantity
                }))
            )
        );

        const transactions = XLSX.utils.json_to_sheet(
            filteredOrders.flatMap(order =>
                order.Transactions
            )
        );
        // const measurements =  XLSX.utils.json_to_sheet(
        //   filteredOrders.flatMap(order =>
        //     order.Transactions
        //   )
        // );

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders');
        XLSX.utils.book_append_sheet(workbook, productsSheet, 'Products');
        XLSX.utils.book_append_sheet(workbook, transactions, 'Transactions');
        // XLSX.utils.book_append_sheet(workbook, transactions, 'Measurements');
        XLSX.writeFile(workbook, 'orders.xlsx');
    };

    const filteredOrders = orders.filter((order: Order) => {
        try {
            const search = searchTerm.toLowerCase().trim();

            if (!search) {
                return statusFilter === 'all' || order.status === statusFilter;
            }

            const searchableFields = [
                order?.InvoiceId,
                order?.customerName,
                order?.customerLocation,
                order?.salesPersonName,
                order?.branch,
                order?.orderedFrom,
                order?.status,
                order?.paymentStatus,
                order?.orderRegisteredBy,
                order?.createdAt ? new Date(order.createdAt).toLocaleDateString() : ''
            ].filter(Boolean).map(field => field!.toLocaleString.toString());

            const matchesSearch = searchableFields.some(field => field.includes(search));
            const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

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

    const handleTransactionModal = (order: Order) => {
        setSelectedOrder(order)
        setTransactionsModel(true)
    }
    const handleCustomerModal = (order: Order) => {
        setSelectedOrder(order)
        setCustomerModal(true)
    }
    const handleItemsModal = (order: Order) => {
        setSelectedOrder(order)
        setitemsModal(true)
    }
    const handleSalesPersonModal = (order: Order) => {
        setSelectedOrder(order)
        setsalespersonModal(true)
    }

    const stages = [
        'confirmed',
        'processing',
        'tailoring',
        'ready',
        'delivered',
        'cancelled'
    ];

    const getNextStage = (currentStage: string) => {
        const currentIndex = stages.findIndex(stage => stage === currentStage);
        return stages[currentIndex + 1];
    };


    const queryClient = useQueryClient();

    const handleCancelOrder = async () => {
        if (!selectedOrder) return;
        const response = await fetch(`http://alnubrasstudio.ddns.net/orders/cancel/${selectedOrder.InvoiceId}`, {
            method: 'DELETE',
            credentials: 'include'
        });
        if (response.ok) {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            toast.success('Order cancelled successfully');
        } else {
            toast.error('Failed to cancel order');
        }
    }

    const { mutate: cancelOrder, isPending } = useMutation({
        mutationFn: handleCancelOrder,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            toast.success('Order cancelled successfully');
        },
        onError: () => {
            toast.error('Failed to cancel order');
        }
    });

    const handleUpdateOrderStatus = async () => {
        const status = getNextStage(selectedOrder?.status || '').toLowerCase();
        const response = await fetch(`http://alnubrasstudio.ddns.net/orders/update/${selectedOrder?.InvoiceId}`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: status })

        });
        if (response.ok) {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            toast.success('Order status updated successfully');
            setIsModalOpen(false)
        } else {
            toast.error('Failed to update order status');
        }
    }

    const { mutate: updateOrderStatus, isPending: isUpdating } = useMutation({
        mutationFn: handleUpdateOrderStatus,
    });

    const handleDeleteOrder = async () => {
        const response = await fetch(`http://alnubrasstudio.ddns.net/orders/delete/${selectedOrder?.InvoiceId}`, {
            method: 'DELETE',
            credentials: 'include'
        });
        if (response.ok) {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            toast.success('Order deleted successfully');
        } else {
            toast.error('Failed to delete order');
        }
    }

    // Using fetch
    async function downloadInvoicePdf(invoiceId: number) {
        try {
            const response = await fetch(`http://alnubrasstudio.ddns.net/invoices/pdf/${invoiceId}`);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            // Create a temporary link element
            const link = document.createElement('a');
            link.href = url;
            link.download = `invoice-${invoiceId}.pdf`;

            // Trigger download
            document.body.appendChild(link);
            link.click();

            // Clean up
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            const wait = new Promise(resovle => {
                setTimeout(() => {
                    resovle(null);
                }, 500)
            });
            await wait;

        } catch (error) {
            console.error('Error downloading invoice:', error);
        }
    }

    const { mutate: downloadInvoice, isPending: isDownloading } = useMutation({
        mutationFn: (id: number) => downloadInvoicePdf(id)
    })

    const { mutate: deleteOrder, isPending: isDeleting } = useMutation({
        mutationFn: handleDeleteOrder,
    });


    const handlePrintInvoice = async (invoiceId: number) => {
        const response = await fetch(`http://alnubrasstudio.ddns.net/invoices/pdf/${invoiceId}`);
        const blob = await response.blob();
        const fileURL = URL.createObjectURL(blob);
        const newWindow = window.open(fileURL, "_blank");
        if (newWindow) {
            newWindow.onload = () => {
                newWindow.focus();
                newWindow.print();
            };
        }
    };

    const { mutate: printInvoice, isPending: isPrinting } = useMutation({
        mutationFn: (id: number) => handlePrintInvoice(id)
    })

    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);    

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent | any) => {
            if (menuRef.current && !menuRef.current?.contains(event.target)) {
                setIsProfileMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleProfileMenu = () => {
        setIsProfileMenuOpen(!isProfileMenuOpen);
    };

    const router = useRouter()
    const handleLogout = async () => {
        await fetch('http://alnubrasstudio.ddns.net/auth/logout', {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: 'include'
        })
        document.cookie == ""
        router.push('/login')
    }

    const { mutate: logout, isPending: loggingOut } = useMutation({
        mutationFn: handleLogout
    })

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
                        href="/dashboard/orders/create"
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

                            {stages.map((stage: string, i: number) => (
                                <option value={stage} key={i}>{stage}</option>
                            ))}
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
        <div className="p-4 sm:p-6 bg-gray-900 overflow-y-auto max-h-[calc(100vh-71px)]">

            <div className="flex justify-between items-center mb-6">

                <h1 className="text-2xl font-bold text-white">Orders</h1>
                <div className="flex items-center gap-6">


                <Link
                    href="/salesman/new"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
                    New Order
                </Link>
                 <div className="relative" ref={menuRef}>
                    <button
                        onClick={toggleProfileMenu}
                        className="flex items-center space-x-2 focus:outline-none focus:ring-2 ring-gray-600 rounded-full"
                    >
                        <div className="w-10 h-10 rounded-full bg-green-500 hover:bg-green-600 transition-colors duration-200 flex items-center justify-center cursor-pointer">
                            <span className="font-semibold text-lg">A</span>
                        </div>
                    </button>

                    {isProfileMenuOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-zinc-50 rounded-lg shadow-lg py-2 text-gray-800 z-50">
                            <button className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-100 w-full transition-colors duration-200">
                                <User className="w-4 h-4" />
                                <span>Account</span>
                            </button>

                            <div className="border-t border-gray-200 my-1"></div>

                            <button
                                onClick={() => logout()}
                                className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-100 w-full text-red-600 transition-colors duration-200"
                            >
                                {loggingOut ? (
                                    <>
                                        <Loader2 className='h-4 w-4 animate-spin' />
                                        Logging out..
                                    </>
                                ) : (
                                    <>      
                                        <LogOut className="w-4 h-4" />
                                        <span>Logout</span>
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </div>
                </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-3 sm:p-6">
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
                            {stages.map((stage: string, i: number) => (
                                <option value={stage} key={i}>{stage}</option>
                            ))}
                        </select>
                        {/* <PDFDownloadLink
                document={<OrderInvoicePDF orders={filteredOrders} />}
                fileName="orders.pdf"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Export PDF
              </PDFDownloadLink> */}
                        <button
                            onClick={exportToExcel}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><line x1="10" y1="9" x2="8" y2="9" /></svg>
                            Export Excel
                        </button>
                    </div>
                </div>

                <div className="sm:hidden space-y-4">
                    {filteredOrders.map((order) => (
                        <div
                            key={order.InvoiceId}
                            className="bg-gray-800 rounded-xl p-4 shadow-md border border-gray-700"
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <span className="text-gray-400 text-xs">Invoice ID</span>
                                    <h3 className="text-white font-semibold">#{order.InvoiceId}</h3>
                                </div>
                                <span className={`px-2 py-1 text-xs rounded ${order.status.toLowerCase() === 'delivered' ? 'bg-green-500/10 text-green-500' :
                                    order.status.toLowerCase() === 'confirmed' ? 'bg-yellow-500/20 text-yellow-500' :
                                        order.status.toLowerCase() === 'processing' ? 'bg-blue-500/10 text-blue-500' :
                                            order.status.toLowerCase() === 'tailoring' ? 'bg-orange-500/10 text-orange-500' :
                                                order.status.toLowerCase() === 'ready' ? 'bg-green-500/10 text-green-500' :
                                                    order.status.toLowerCase() === 'cancelled' ? 'bg-red-500/10 text-red-500' :
                                                        'bg-gray-500/10 text-gray-500'
                                    }`}>
                                    {order.status}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-3">
                                <div>
                                    <span className="text-gray-400 text-xs">Date</span>
                                    <p className="text-white">{new Date(order.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <span className="text-gray-400 text-xs">Total</span>
                                    <p className="text-white">AED {order.totalAmount.toFixed(2)}</p>
                                </div>
                                <div>
                                    <span className="text-gray-400 text-xs">Paid</span>
                                    <p className="text-white">AED {order.PaidAmount.toFixed(2)}</p>
                                </div>
                                <div>
                                    <span className="text-gray-400 text-xs">Pending</span>
                                    <p className="text-white">AED {(Number(order.totalAmount) - Number(order.PaidAmount)).toFixed(2)}</p>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 mt-4">
                                <button
                                    onClick={() => handleItemsModal(order)}
                                    className="px-3 py-1.5 text-xs rounded bg-pink-500/10 text-pink-500 flex items-center gap-1"
                                >
                                    <Package size={14} /> Products
                                </button>
                                <button
                                    onClick={() => handleCustomerModal(order)}
                                    className="px-3 py-1.5 text-xs rounded bg-blue-500/10 text-blue-500 flex items-center gap-1"
                                >
                                    <User size={14} /> Customer
                                </button>
                                <button
                                    onClick={() => handleTransactionModal(order)}
                                    className="px-3 py-1.5 text-xs rounded bg-green-500/10 text-green-500 flex items-center gap-1"
                                >
                                    <Badge size={14} /> Transactions
                                </button>
                                <button
                                    onClick={() => handleOrderClick(order)}
                                    className="px-3 py-1.5 text-xs rounded bg-gray-500/10 text-gray-300 flex items-center gap-1 ml-auto"
                                >
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="sm:block hidden overflow-x-auto">
                    <table className="w-full text-left text-gray-300">
                        <thead className="text-gray-400 border-b border-gray-700">
                            <tr>
                                <th className="text-nowrap pb-3 px-4">Invoice ID</th>
                                <th className="text-nowrap pb-3 px-4">Date</th>
                                <th className="text-nowrap pb-3 px-4">Total</th>
                                <th className="text-nowrap pb-3 px-4">Total Paid</th>
                                <th className="text-nowrap pb-3 px-4">Total Pending</th>
                                <th className="text-nowrap pb-3 px-4">Status</th>
                                <th className="text-nowrap pb-3 px-4">Products</th>
                                <th className="text-nowrap pb-3 px-4">Customer</th>
                                <th className="text-nowrap pb-3 px-4">Transcations</th>
                                <th className="text-nowrap pb-3 px-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {filteredOrders.map((order) => (
                                <tr key={order.InvoiceId} className="hover:bg-gray-700 cursor-pointer" >
                                    <td className="py-2 px-4">{order.InvoiceId}</td>
                                    <td className="py-2 px-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                                    <td className="py-2 px-4">{order.totalAmount.toFixed(2) || 0}</td>
                                    <td className="py-2 px-4">{order.PaidAmount.toFixed(2) || 0}</td>
                                    <td className="py-2 px-4">{Number(order.totalAmount.toFixed(2)) - Number(order.PaidAmount.toFixed(2))}</td>
                                    <td className="py-2 px-4">

                                        <span className={`px-2 py-0.5 text-xs rounded ${order.status.toLowerCase() === 'delivered' ? 'bg-green-500/10 text-green-500' :
                                            order.status.toLowerCase() === 'confirmed' ? 'bg-yellow-500/20 text-yellow-500' :
                                                order.status.toLowerCase() === 'processing' ? 'bg-blue-500/10 text-blue-500' :
                                                    order.status.toLowerCase() === 'tailoring' ? 'bg-orange-500/10 text-orange-500' :
                                                        order.status.toLowerCase() === 'ready' ? 'bg-green-500/10 text-green-500' :
                                                            order.status.toLowerCase() === 'cancelled' ? 'bg-red-500/10 text-red-500' :
                                                                'bg-gray-500/10 text-gray-500'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="py-2 px-4" onClick={() => handleItemsModal(order)}>
                                        <span className='px-2 py-0.5 text-xs rounded  bg-pink-500/10 text-pink-500'>
                                            Products
                                        </span>
                                    </td>
                                    <td className="py-2 px-4" onClick={() => handleCustomerModal(order)}>
                                        <span className='px-2 py-0.5 text-xs rounded  bg-blue-500/10 text-blue-500'>
                                            Customer
                                        </span>
                                    </td>

                                    <td className="py-2 px-4" onClick={() => handleTransactionModal(order)}>
                                        <span className='px-2 py-0.5 text-xs rounded  bg-green-500/10 text-green-500'>
                                            transactions
                                        </span>
                                    </td>
                                    <td className="py-2 px-4" onClick={() => handleOrderClick(order)}>
                                        <button className="text-blue-400 hover:text-blue-300 flex items-center gap-2" >
                                            <Truck className='h-4 w-4' />
                                            track order
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>


            {CustomerModal && selectedOrder && (
                <Modal onClose={() => setCustomerModal(false)}>
                    <div className="max-w-xl min-w-[400px] w-full bg-gray-800 text-white rounded-2xl shadow-lg p-8 space-y-5">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-semibold">👤 {selectedOrder.Customer.name}</h2>
                            <span className="bg-green-500 text-xs px-4 py-1 rounded-full">
                                Total Orders: {selectedOrder.Customer.totalOrders}
                            </span>
                        </div>

                        <div className="space-y-3">
                            <p className='flex gap-1 items-center'><span className="font-semibold flex gap-1 items-center text-blue-500"><Phone className='h-4 w-4' /> Phone:</span> {selectedOrder.Customer.phone}</p>
                            <p className='flex gap-1 items-center'><span className="font-semibold flex gap-1 items-center text-purple-500"><Map className='h-4 w-4' /> Location:</span> {selectedOrder.Customer.location}</p>
                            <p className='flex gap-1 items-center'><span className="font-semibold flex gap-1 items-center text-green-500"><Banknote className='h-4 w-4' /> Total Spent:</span> AED {selectedOrder.Customer.totalSpent}</p>
                            <p className='flex gap-1 items-center'>
                                <span className="font-semibold flex gap-1 items-center text-yellow-500"><Clock className='h-4 w-4' /> Last Order:</span>{" "}
                                {selectedOrder.Customer.lastOrder ? selectedOrder.Customer.lastOrder : "No recent orders"}
                            </p>
                        </div>

                        <div className="text-sm text-gray-400">
                            <p>Created: {new Date(selectedOrder.Customer.createdAt).toLocaleDateString()}</p>
                            <p>Updated: {new Date(selectedOrder.Customer.updatedAt).toLocaleDateString()}</p>
                        </div>

                        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition">
                            View Orders
                        </button>
                    </div>
                </Modal>
            )}


            {itemsModal && selectedOrder && (
                <Modal onClose={() => setitemsModal(false)}>
                    <div className="p-4 sm:p-8 bg-gray-800 rounded-lg max-w-[85vw] mx-auto sm:min-w-[600px]">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold text-white mb-2">Products for #{selectedOrder.InvoiceId}</h2>
                        </div>
                        <DataTable className='shadow-none border border-gray-600' data={selectedOrder.items} exportFilename={`products#${selectedOrder.InvoiceId}`} />
                    </div>
                </Modal>
            )}

            {transactionsModal && selectedOrder && (
                <Modal onClose={() => setTransactionsModel(false)}>
                    <div className="p-8 bg-gray-800 rounded-lg sm:min-w-[600px] min-w-[85vw]">
                        <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold text-white mb-2">Transactions for #{selectedOrder.InvoiceId}</h2>
                            <span className="text-red-600 font-medium rounded-md  border border-red-500 py-1 px-4">Payment due Date: {selectedOrder.PaymentdueDate ? new Date(selectedOrder.PaymentdueDate).toLocaleDateString() : 'N/A'}</span>
                        </div>
                        <DataTable className='shadow-none border border-gray-600' data={selectedOrder.Transactions} exportFilename={`transactions#${selectedOrder.InvoiceId}`} />
                    </div>
                </Modal>
            )}

            {isModalOpen && selectedOrder && (
                <Modal onClose={() => setIsModalOpen(false)}>
                    <div ref={componentRef} className="bg-gray-800 p-8 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-2">Order Details</h2>
                                <p className="text-gray-400">Invoice Date: {selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleDateString() : 'N/A'}</p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => printInvoice(selectedOrder.InvoiceId)}
                                    disabled={isPrinting}
                                    className="bg-purple-600 disabled:opacity-60 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2"
                                >
                                    {isPrinting ?
                                        <>
                                            <Loader2 className='h-4 w-4 animate-spin' />
                                            Generating invoice
                                        </>
                                        :
                                        <>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
                                            Print
                                        </>
                                    }
                                </button>
                                <button
                                    onClick={() => downloadInvoice(selectedOrder.InvoiceId)}
                                    disabled={isDownloading}
                                    className="bg-green-600 disabled:opacity-60 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2"
                                >
                                    {isDownloading ?
                                        <>
                                            <Loader2 className='h-4 w-4 animate-spin' />
                                            Generating invoice
                                        </>
                                        :
                                        <>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                                            Download PDF
                                        </>
                                    }

                                </button>
                                {/* <PDFDownloadLink
                    document={<OrderPDF order={selectedOrder} /> }
                    fileName={`invoice-${selectedOrder.InvoiceId}.pdf`}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    Download PDF
                  </PDFDownloadLink> */}
                            </div>
                        </div>

                        <div className="mb-8">
                            {selectedOrder.status.toLocaleLowerCase() !== 'cancelled' ? (
                                <div className="relative">
                                    <div className="absolute top-5 left-0 right-0 h-0.5">
                                        <div className="h-full bg-gray-600 w-full" />

                                        <div
                                            className="h-full bg-emerald-500 absolute top-0 left-0 transition-all duration-500"
                                            style={{ width: `${(getOrderStage(selectedOrder.status) / 5) * 100}%` }}
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
                                            <span className={`text-sm mt-2 ${getOrderStage(selectedOrder.status) === 2 ? 'font-bold text-white' : 'text-gray-300'}`}>Processing</span>
                                        </div>
                                        <div className="flex flex-col items-center flex-1">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 ${getOrderStage(selectedOrder.status) >= 3
                                                ? 'bg-emerald-500 ring-2 ring-emerald-300'
                                                : getOrderStage(selectedOrder.status) === 2
                                                    ? 'bg-yellow-500 ring-2 ring-yellow-300'
                                                    : 'bg-gray-600'
                                                }`}>
                                                <Scissors className={`w-5 h-5 ${getOrderStage(selectedOrder.status) >= 3 ? 'text-white' : 'text-gray-300'}`} />
                                            </div>
                                            <span className={`text-sm mt-2 ${getOrderStage(selectedOrder.status) === 3 ? 'font-bold text-white' : 'text-gray-300'}`}>Tailoring</span>
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
                                            <span className={`text-sm mt-2 ${getOrderStage(selectedOrder.status) === 4 ? 'font-bold text-white' : 'text-gray-300'}`}>Ready</span>
                                        </div>
                                        <div className="flex flex-col items-center flex-1">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 ${getOrderStage(selectedOrder.status) >= 4
                                                ? 'bg-emerald-500 ring-2 ring-emerald-300'
                                                : getOrderStage(selectedOrder.status) === 4
                                                    ? 'bg-yellow-500 ring-2 ring-yellow-300'
                                                    : 'bg-gray-600'
                                                }`}>
                                                <TruckIcon className={`w-5 h-5 ${getOrderStage(selectedOrder.status) >= 5 ? 'text-white' : 'text-gray-300'}`} />
                                            </div>
                                            <span className={`text-sm mt-2 ${getOrderStage(selectedOrder.status) === 5 ? 'font-bold text-white' : 'text-gray-300'}`}>Delivered</span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-red-600/10 text-red-600 border-[0.1px] border-red-500 px-4 py-2.5 rounded-lg flex items-center gap-2">
                                    <XCircle className="w-5 h-5" />Order is cancelled
                                </div>
                            )}
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
                                            selectedOrder.status === 'Delivered' ? 'bg-green-500/10 text-green-500' :
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

                        <div className="bg-gray-700/30 rounded-lg border border-gray-700 overflow-hidden mb-6">
                            <table className="w-full text-gray-300">
                                <thead className="bg-gray-700 border-b border-gray-600">
                                    <tr>
                                        <th className="text-nowrap text-left py-3 px-4">Section</th>
                                        <th className="text-nowrap text-right py-3 px-4">Product</th>
                                        <th className="text-nowrap text-right py-3 px-4">Quantity</th>
                                        <th className="text-nowrap text-right py-3 px-4">Unit Price</th>
                                        <th className="text-nowrap text-right py-3 px-4">Total Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedOrder.items.map((item: Item, index: number) => (
                                        <tr key={index}>

                                            <td className="py-4 px-4 text-center">{item.sectionName}</td>
                                            <td className="py-4 px-4 text-center">{item.productName}</td>
                                            <td className="py-4 px-4 text-center">{Number(item.quantity) || 0}</td>
                                            <td className="py-4 px-4 text-center">AED {item.productPrice.toFixed(2) || 0}</td>
                                            <td className="py-4 px-4 text-center">AED {Number(item.productPrice.toFixed(2)) * Number(item.quantity) || 0}</td>
                                        </tr>
                                    ))}
                                </tbody>

                                <tfoot className="border-t border-gray-600">
                                    <tr>
                                        <td colSpan={3} className="py-4 px-4 text-right font-semibold">Total Amount:</td>
                                        <td className="py-4 px-4 text-right font-bold text-white">AED {selectedOrder.totalAmount.toFixed(2) || 0}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>

                        {selectedOrder.status !== 'Delivered' ? (
                            <div className="flex items-center gap-3 w-full">



                                {selectedOrder.status !== 'cancelled' ? (
                                    <button onClick={() => cancelOrder()} className="bg-red-600 w-full hover:bg-red-700 text-center text-white px-4 py-3 rounded-lg text-sm flex justify-center items-center gap-2"> {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <>
                                        <XCircle className="w-5 h-5" />Cancel Order</>}</button>
                                ) : (
                                    <button onClick={() => handleDeleteOrder()} className="bg-red-600 w-full hover:bg-red-700 text-center text-white px-4 py-3 rounded-lg text-sm flex justify-center items-center gap-2">{isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Trash className="w-5 h-5" />Delete order</>}</button>
                                )}


                                {selectedOrder.status !== 'cancelled' && (
                                    <button onClick={() => updateOrderStatus()} className="bg-green-600 w-full  hover:bg-green-700 text-white px-4 py-3 rounded-lg flex justify-center gap-2 items-center"><CheckCircle2 className="w-5 h-5" />{isUpdating ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Mark {getNextStage(selectedOrder.status)}</>}</button>
                                )}

                            </div>
                        ) : (
                            <div className="flex items-center gap-3 w-full">
                                <div className="bg-green-600 w-full hover:bg-green-700 text-center text-white px-4 py-3 rounded-lg text-sm flex justify-center items-center gap-2"><Box className="w-5 h-5" />Order is successfully Delivered</div>
                            </div>

                        )}
                    </div>
                </Modal>
            )}

        </div>
    );
}


const getColorFromLetter = (letter: string) => {
    const colors = [
        "bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-500",
        "bg-teal-500", "bg-blue-500", "bg-indigo-500", "bg-purple-500", "bg-pink-500"
    ];
    return colors[letter.charCodeAt(0) % colors.length]; // Select color based on letter
};

const Avatar = ({ username }: { username: string }) => {
    const firstLetter = username[0].toUpperCase();
    const bgColor = getColorFromLetter(firstLetter);

    return (
        <div className={`w-12 h-12 ${bgColor} rounded-full flex items-center justify-center uppercase font-bold text-zinc-50`}>
            {firstLetter}
        </div>
    );
};
