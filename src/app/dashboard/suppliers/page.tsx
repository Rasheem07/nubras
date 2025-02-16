'use client'
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react"
import DataTable from "../_components/DataTable.";


export default function SupplierPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const {data: suppliers, isLoading} = useQuery({
        queryKey: ['suppliers'],
        queryFn: async () => {
            const response = await fetch('http://localhost:3000/inventory/suppliers', {
                credentials: 'include'
            })
            const json = await response.json()
            return json
        }
    })


    return (
        <div className="p-8 space-y-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white">Suppliers</h1>
                    <p className="text-gray-400 mt-1">Manage your suppliers</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add new supplier</span>
                </button>
            </div>

            <DataTable data={suppliers} exportFilename="suppliers" />
        </div>
    )
}