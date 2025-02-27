"use client"

import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PDFDownloadLink } from '@react-pdf/renderer';
import * as XLSX from 'xlsx';
import Modal from '../_components/Modal';
import { Mail, UserPlus, Download, FileSpreadsheet, Search, Filter, MoreVertical, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface Customer {
    id: string;
    name: string;
    phone: string;
    location: string;
    totalOrders: number;
    lastOrder: Date | null;
    totalSpent: number;
    createdAt: Date;
    updatedAt: Date;
}

const fetchCustomers = async (): Promise<Customer[]> => {
    const response = await fetch('http://34.18.73.81:3000/customers', {
        credentials: 'include'
    });
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
};

const createCustomer = async (customerData: { name: string; phone: string; location: string }): Promise<Customer> => {
    const response = await fetch('http://34.18.73.81:3000/customers/create', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(customerData)
    });

    if (!response.ok) {
        throw new Error('Failed to create customer');
    }

    return response.json();
};

export default function CustomersPage() {
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    const [emailSubject, setEmailSubject] = useState('');
    const [emailBody, setEmailBody] = useState('');

    const { data: customers = [], isLoading, error } = useQuery({
        queryKey: ['customers'],
        queryFn: fetchCustomers,
        staleTime: 5 * 60 * 1000,
        gcTime: 30 * 60 * 1000
    });

    const createCustomerMutation = useMutation({
        mutationFn: createCustomer,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['customers'] });
            setIsCreateModalOpen(false);
        }
    });

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredCustomers.map(customer => ({
            'ID': customer.id,
            'Name': customer.name,
            'Phone': customer.phone || 'N/A',
            'Location': customer.location || 'N/A',
            'Total Orders': customer.totalOrders || 0,
            'Total Spent': `$${(customer.totalSpent || 0).toFixed(2)}`,
            'Last Order': customer.lastOrder ? new Date(customer.lastOrder).toLocaleDateString() : 'N/A',
            'Created': new Date(customer.createdAt).toLocaleDateString(),
            'Updated': new Date(customer.updatedAt).toLocaleDateString()
        })));

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Customers');
        XLSX.writeFile(workbook, 'customers.xlsx');
    };

    const filteredCustomers = customers.filter((customer: Customer) => {
        const search = searchTerm.toLowerCase().trim();

        if (!search) return true;

        return (
            customer.name.toLowerCase().includes(search) ||
            (customer.location?.toLowerCase().includes(search) || false) ||
            (customer.phone?.includes(search) || false)
        );
    });

    const handleSendEmail = async () => {
        // Implementation for sending bulk email
        console.log('Sending email to all customers:', { emailSubject, emailBody });
        setIsEmailModalOpen(false);
    };

    const handleCreateCustomer = async (formData: FormData) => {
        const name = formData.get('name') as string;
        const phone = formData.get('phone') as string;
        const location = formData.get('location') as string;

        if (!name) {
            throw new Error('Name is required');
        }

        createCustomerMutation.mutate({ name, phone, location });
    };

    if (isLoading) return (
        <div className="p-6 mt-12 bg-gray-900 text-white flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-2" />
            <p className="text-gray-400">Loading customers...</p>
        </div>
    );

    if (error) return <div className="text-red-500 p-8">Error loading customers</div>;

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-white">Customers</h1>
                <div className="flex gap-3">
                    <button
                        onClick={() => setIsEmailModalOpen(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                    >
                        <Mail className="w-5 h-5" />
                        Message All
                    </button>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                    >
                        <UserPlus className="w-5 h-5" />
                        Add Customer
                    </button>
                </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 mb-6 shadow-lg">
                <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
                    <div className="flex gap-4 flex-1">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search customers..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 w-full bg-gray-700 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={exportToExcel}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                        >
                            <FileSpreadsheet className="w-5 h-5" />
                            Export Excel
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-gray-300">
                        <thead className="text-gray-400 border-b border-gray-700">
                            <tr>
                                <th className="pb-3 px-4">Name</th>
                                <th className="pb-3 px-4">Phone</th>
                                <th className="pb-3 px-4">Location</th>
                                <th className="pb-3 px-4">Orders</th>
                                <th className="pb-3 px-4">Total Spent</th>
                                <th className="pb-3 px-4">Last Order</th>
                                <th className="pb-3 px-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {filteredCustomers.map((customer) => (
                                <tr key={customer.id} className="hover:bg-gray-700/50 transition-colors">
                                    <td className="py-2 px-4">{customer.name}</td>
                                    <td className="py-2 px-4">{customer.phone || 'N/A'}</td>
                                    <td className="py-2 px-4">{customer.location || 'N/A'}</td>
                                    <td className="py-2 px-4">{customer.totalOrders || 0}</td>
                                    <td className="py-2 px-4">AED {(customer.totalSpent || 0).toFixed(2)}</td>
                                    <td className="py-2 px-4">
                                        {customer.lastOrder 
                                            ? new Date(customer.lastOrder).toLocaleDateString() 
                                            : 'Never'
                                        }
                                    </td>
                                    <td className="py-2 px-4">
                                        <button
                                            onClick={() => setSelectedCustomer(customer)}
                                            className="text-gray-400 hover:text-white transition-colors"
                                        >
                                            <Link href={`/dashboard/customers/${customer.id}`} className='text-blue-500 hover:text-blue-600 hover:underline underline-offset-2'>View invoices</Link>
                                        </button>
                                    </td>
                                </tr>

                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Email Modal */}
            {isEmailModalOpen && (
                <Modal onClose={() => setIsEmailModalOpen(false)}>
                    <div className="bg-gray-800 p-8 rounded-xl max-w-6xl w-full shadow-2xl">
                        <h2 className="text-2xl font-bold mb-6 text-white">Email All Customers</h2>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Subject</label>
                                <input
                                    type="text"
                                    placeholder="Enter email subject..."
                                    value={emailSubject}
                                    onChange={(e) => setEmailSubject(e.target.value)}
                                    className="w-full p-3 min-w-96 bg-gray-700 rounded-lg border border-gray-600 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Message</label>
                                <textarea
                                    placeholder="Type your message here..."
                                    value={emailBody}
                                    onChange={(e) => setEmailBody(e.target.value)}
                                    rows={8}
                                    className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all resize-none"
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    onClick={() => setIsEmailModalOpen(false)}
                                    className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-300 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSendEmail}
                                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors"
                                >
                                    Send Email
                                </button>
                            </div>
                        </div>
                    </div>
                </Modal>
            )}

            {/* Create Customer Modal */}
            {isCreateModalOpen && (
                <Modal onClose={() => setIsCreateModalOpen(false)}>
                    <div className="bg-gray-800 p-8 rounded-xl max-w-4xl min-w-[400px] w-full shadow-2xl">
                        <h2 className="text-2xl font-bold mb-6 text-green-400">Create New Customer</h2>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            handleCreateCustomer(new FormData(e.currentTarget));
                        }}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Name</label>
                                    <input
                                        name="name"
                                        type="text"
                                        placeholder="Enter customer name..."
                                        className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Phone</label>
                                    <input
                                        name="phone"
                                        type="tel"
                                        placeholder="Enter phone number..."
                                        className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Location</label>
                                    <input
                                        name="location"
                                        type="text"
                                        placeholder="Enter customer location..."
                                        className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                        required
                                    />
                                </div>
                                
                                <div className="flex justify-end gap-3 pt-6">
                                    <button
                                        type="button"
                                        onClick={() => setIsCreateModalOpen(false)}
                                        className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-300 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={createCustomerMutation.isPending}
                                        className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {createCustomerMutation.isPending ? (
                                            <div className="flex items-center gap-2">
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Creating...
                                            </div>
                                        ) : (
                                            'Create Customer'
                                        )}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </Modal>
            )}
        </div>
    );
}
