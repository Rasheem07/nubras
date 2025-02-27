import { useState } from "react";
import Link from "next/link";
import { Search, FileSpreadsheet } from "lucide-react";
import * as XLSX from 'xlsx';

interface Transaction {
    id: string;
    customerName: string;
    amount: number;
    status: string;
    paymentType: string;
    transactionId: string;
    paymentMethod: string;
    paymentDate: string;
}

interface TransactionTableProps {
    transactions: Transaction[];
}

const TransactionTable: React.FC<TransactionTableProps> = ({ transactions }) => {
    const [searchTerm, setSearchTerm] = useState<string>("");

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredTransactions.map(transaction => ({
            'ID': transaction.id,
            'Customer Name': transaction.customerName,
            'Amount': `${transaction.amount.toFixed(2)}`,
            'Status': transaction.status,
            'Payment Type': transaction.paymentType,
            'Transaction ID': transaction.id,
            'Payment Method': transaction.paymentMethod,
            'Payment Date': new Date(transaction.paymentDate).toLocaleDateString(),
        })));

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions');
        XLSX.writeFile(workbook, 'transactions.xlsx');
    };

    const filteredTransactions = transactions?.length > 0 ? transactions.filter(transaction => {
        const search = searchTerm.toLowerCase().trim();
        if (!search) return true;
        return (
            transaction.customerName.toLowerCase().includes(search) ||
            transaction.transactionId.toLowerCase().includes(search)
        );
    }) : [];

    return (
        <div className="bg-gray-800 rounded-xl p-6 mb-6 shadow-lg">
            {/* Search and Export */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
                <div className="flex gap-4 flex-1">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search transactions..."
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

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left text-gray-300">
                    <thead className="text-gray-400 border-b border-gray-700">
                        <tr>
                            <th className="pb-3 px-4 text-nowrap">Customer Name</th>
                            <th className="pb-3 px-4 text-nowrap">Amount</th>
                            <th className="pb-3 px-4 text-nowrap">Status</th>
                            <th className="pb-3 px-4 text-nowrap">Payment Type</th>
                            <th className="pb-3 px-4 text-nowrap">Transaction ID</th>
                            <th className="pb-3 px-4 text-nowrap">Payment Method</th>
                            <th className="pb-3 px-4 text-nowrap">Payment Date</th>
                            <th className="pb-3 px-4 text-nowrap">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {filteredTransactions.map((transaction) => (
                            <tr key={transaction.id} className="hover:bg-gray-700/50 transition-colors">
                                <td className="py-2 px-4 text-nowrap">{transaction.customerName}</td>
                                <td className="py-2 px-4 text-nowrap">AED {transaction.amount.toFixed(2)}</td>
                                <td className="py-2 px-4 text-nowrap">{transaction.status}</td>
                                <td className="py-2 px-4 text-nowrap">{transaction.paymentType}</td>
                                <td className="py-2 px-4 text-nowrap">{transaction.id}</td>
                                <td className="py-2 px-4 text-nowrap">{transaction.paymentMethod}</td>
                                <td className="py-2 px-4 text-nowrap">{new Date(transaction.paymentDate).toLocaleDateString()}</td>
                                <td className="py-2 px-4 text-nowrap">
                                    <Link
                                        href={`/transactions/${transaction.id}`}
                                        className="text-blue-500 hover:text-blue-600 hover:underline underline-offset-2"
                                    >
                                        View Details
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TransactionTable;
