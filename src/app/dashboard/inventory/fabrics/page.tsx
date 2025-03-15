'use client'
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import DataTable from "../../_components/DataTable.";
import Link from "next/link";
import { useState } from "react";
import { Plus } from "lucide-react";
import Modal from "../../_components/Modal";
import FabricInventoryForm from "./_components/createFabricForm";

export default function InventoryPage() {
    const { product } = useParams();

    const [addModal, setAddModal] = useState(false);

    const getProductMovement = async () => {
        const response = await fetch(`http://alnubrasstudio.ddns.net:8888/inventory/fabrics`, {
            headers: {
                "Content-Type": "application/json"
            },
            credentials: 'include'
        });
        return response.json();
    }

    const { data: productMovement, isLoading } = useQuery({
        queryKey: ['fabrics'],
        queryFn: () => getProductMovement()
    });


    return (
        <div className="p-8">

            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Fabrics Inventory</h1>
                <div className="flex items-center gap-6">

                    <Link href={'/dashboard/inventory/fabrics/reserved'} className="text-zinc-200 font-sans underline underline-offset-2 text-lg">View reserved fabrics</Link>
                    <button

                        onClick={() => setAddModal(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        Add new fabric
                    </button>
                </div>
            </div>

            {addModal && (
                <Modal onClose={() => setAddModal(false)}>
                    <FabricInventoryForm setIsModalOpen={setAddModal} />
                </Modal>
            )}


            <DataTable data={productMovement} exportFilename={`${product}-movements`} rowLink={(row: any) => `/dashboard/inventory/fabrics/${row.id}`} view="more" className="w-full max-w-full overflow-x-auto" />
        </div>
    );
}
