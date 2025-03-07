'use client'
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import DataTable from "../../_components/DataTable.";

export default function InventoryPage() {
    const { product } = useParams();

    const getProductMovement = async () => {
        const response = await fetch(`http://alnubras.hopto.org:8888/inventory/products`, {
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
                <h1 className="text-2xl font-bold">Products Inventory</h1>
            </div>

          
            <DataTable data={productMovement} exportFilename={`${product}-movements`} rowLink={(row: any) => `/dashboard/inventory/products/${row.id}`} view="more" className="w-full max-w-full overflow-x-auto" />
        </div>
    );
}
