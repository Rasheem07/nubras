'use client'
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { useParams } from "next/navigation";
import RestockForm from "../_components/restockForm";
import Modal from "@/app/dashboard/_components/Modal";
import DataTable from "@/app/dashboard/_components/DataTable.";

export default function InventoryPage() {
    const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);
    const { product } = useParams();

    const getProductMovement = async () => {
        const response = await fetch(`https://34.18.99.10/inventory/products/${product}`, {
            headers: {
                "Content-Type": "application/json"
            },
            credentials: 'include'
        });
        return response.json();
    }

    const { data: productMovement, isLoading } = useQuery({
        queryKey: ['productMovement'],
        queryFn: () => getProductMovement()
    });


    return (
        <div className="p-8">

            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Product Movement for ID ({product})</h1>
                <div className="flex gap-2">
                    <button

                        onClick={() => setIsRestockModalOpen(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                    >
                        <RefreshCw className="w-5 h-5" />
                        Restock
                    </button>
                </div>
            </div>

            {isRestockModalOpen && (
                <Modal onClose={() => setIsRestockModalOpen(false)}>
                    <div className="bg-gray-800 p-8 rounded-xl max-w-4xl min-w-[600px] max-h-[90vh] overflow-y-auto w-full shadow-2xl">
                        <h2 className="text-2xl font-bold mb-6 text-blue-500">Restock Product</h2>
                        <RestockForm setIsRestockModalOpen={setIsRestockModalOpen} />
                    </div>
                </Modal>

            )}

            <DataTable data={productMovement} exportFilename={`${product}-movements`} className="w-full max-w-full overflow-x-auto" />
        </div>
    );
}
