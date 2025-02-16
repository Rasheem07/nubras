import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, FileSpreadsheet } from "lucide-react";
import * as XLSX from 'xlsx';
import { useQuery } from "@tanstack/react-query";

interface Measurement {
    id: string;
    customerId: string;
    productName: string;
    chest: number;
    waist: number;
    hips: number;
    sleeve: number;
    inseam: number;
    shoulder: number;
    notes: string;
    createdAt: string;
}


const MeasurementTable: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState<string>("");

    // Fetch measurements data from the API
    const fetchMeasurements = async () => {
        try {
            const response = await fetch('http://localhost:3000/measurement');
            const data = await response.json();
           
            return data;
        } catch (error) {
            console.error('Error fetching measurements:', error);
        }
    };

    const {data: measurementsData} = useQuery<Measurement[]>({
        queryKey: ['measurements'],
        queryFn: fetchMeasurements
    })

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredMeasurements!.map(measurement => ({
            'ID': measurement.id,
            'Customer ID': measurement.customerId,
            'Product Name': measurement.productName,
            'Chest': measurement.chest.toFixed(2),
            'Waist': measurement.waist.toFixed(2),
            'Hips': measurement.hips.toFixed(2),

            'Sleeve': measurement.sleeve.toFixed(2),
            'Inseam': measurement.inseam.toFixed(2),
            'Shoulder': measurement.shoulder.toFixed(2),
            'Notes': measurement.notes,
            'Created At': new Date(measurement.createdAt).toLocaleDateString(),
        })));

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Measurements');
        XLSX.writeFile(workbook, 'measurements.xlsx');
    };

    const filteredMeasurements = measurementsData!?.length > 0 ? measurementsData?.filter(measurement => {        
        const search = searchTerm.toLowerCase().trim();
        if (!search) return true;
        return (

            measurement.customerId.toLowerCase().includes(search) ||
            measurement.productName.toLowerCase().includes(search)
        );
    }) : [];


    return (
        <div className="bg-gray-800 rounded-xl p-6 mb-6 shadow-lg overflow-x-auto ">


            {/* Search and Export */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
                <div className="flex gap-4 flex-1">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search measurements..."
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
            <div className="overflow-x-auto max-w-[85vw]">
                <table className="w-full text-left text-gray-300">
                    <thead className="text-gray-400 border-b border-gray-700">
                        <tr>
                            <th className="pb-3 px-4">Customer ID</th>
                            <th className="pb-3 px-4  truncate">Product Name</th>
                            <th className="pb-3 px-4">Chest</th>
                            <th className="pb-3 px-4">Waist</th>
                            <th className="pb-3 px-4">Hips</th>
                            <th className="pb-3 px-4">Sleeve</th>
                            <th className="pb-3 px-4">Inseam</th>
                            <th className="pb-3 px-4">Shoulder</th>
                            <th className="pb-3 px-4">Notes</th>
                            <th className="pb-3 px-4 text-nowrap">Created At</th>
                            <th className="pb-3 px-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {filteredMeasurements!.map((measurement) => (
                            <tr key={measurement.id} className="hover:bg-gray-700/50 transition-colors">
                                <td className="py-2 px-4">{measurement.customerId}</td>

                                <td className="py-2 px-4">{measurement.productName}</td>
                                <td className="py-2 px-4">{measurement.chest.toFixed(2)}</td>
                                <td className="py-2 px-4">{measurement.waist.toFixed(2)}</td>
                                <td className="py-2 px-4">{measurement.hips.toFixed(2)}</td>
                                <td className="py-2 px-4">{measurement.sleeve.toFixed(2)}</td>
                                <td className="py-2 px-4">{measurement.inseam.toFixed(2)}</td>
                                <td className="py-2 px-4">{measurement.shoulder.toFixed(2)}</td>
                                <td className="py-2 px-4 text-nowrap">{measurement.notes}</td>
                                <td className="py-2 px-4">{new Date(measurement.createdAt).toLocaleDateString()}</td>
                                <td className="py-2 px-4">
                                    <Link
                                        href={`/measurements/${measurement.id}`}
                                        className="text-blue-500 text-nowrap hover:text-blue-600 hover:underline underline-offset-2"
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

export default MeasurementTable;
                    
