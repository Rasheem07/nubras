import { useState } from "react";
import Link from "next/link";
import { Search, FileSpreadsheet } from "lucide-react";
import * as XLSX from 'xlsx';
interface Salesperson {
    id: string;
    name: string;
    totalOrders: number;
    totalSalesAmount: number;
    createdAt: string;
    updatedAt: string;
}

interface SalespersonTableProps {
    salespersons: Salesperson[];
}

const SalespersonTable: React.FC<SalespersonTableProps> = ({ salespersons }) => {
    const [searchTerm, setSearchTerm] = useState<string>("");


    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredSalespersons.map(salesperson => ({
            'ID': salesperson.id,
            'Name': salesperson.name,
            'Total Orders': salesperson.totalOrders || 0,

            'Total Sales': `${(salesperson.totalSalesAmount || 0).toFixed(2)}`,
            'Created': new Date(salesperson.createdAt).toLocaleDateString(),
            'Updated': new Date(salesperson.updatedAt).toLocaleDateString()

        })));

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Salespersons');
        XLSX.writeFile(workbook, 'salespersons.xlsx');
    };


    const filteredSalespersons = salespersons?.length > 0 ? salespersons.filter((salesperson: Salesperson) => {
        const search = searchTerm.toLowerCase().trim();



        if (!search) return true;

        return (
            salesperson.name.toLowerCase().includes(search)
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
                            placeholder="Search salespersons..."
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
                            <th className="pb-3 px-4">Name</th>
                            <th className="pb-3 px-4">Total Orders</th>
                            <th className="pb-3 px-4">Total Sales</th>
                            <th className="pb-3 px-4">Created At</th>
                            <th className="pb-3 px-4">Updated At</th>
                            <th className="pb-3 px-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {filteredSalespersons.map((sp) => (
                            <tr key={sp.id} className="hover:bg-gray-700/50 transition-colors">
                                <td className="py-2 px-4">{sp.name}</td>
                                <td className="py-2 px-4">{sp.totalOrders}</td>
                                <td className="py-2 px-4">AED {sp.totalSalesAmount.toFixed(2)}</td>
                                <td className="py-2 px-4">
                                    {new Date(sp.createdAt).toLocaleDateString()}
                                </td>
                                <td className="py-2 px-4">
                                    {new Date(sp.updatedAt).toLocaleDateString()}
                                </td>
                                <td className="py-2 px-4">
                                    <Link
                                        href={`/sales-persons/${sp.id}`}
                                        className="text-blue-500 hover:text-blue-600 hover:underline underline-offset-2"
                                    >
                                        View Invoices
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

export default SalespersonTable;
