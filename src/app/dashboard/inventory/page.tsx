'use client'
import { useQuery } from "@tanstack/react-query"
import DataTable from "../_components/DataTable."
import { Loader2 } from "lucide-react"

interface Inventory {
    id: string;
    productName: string;
    quantityAvailable: number;
    reorderPoint: number;
    createdAt: Date;
    updatedAt: Date;
}


export default function InventoryPage() {
    const getInventory = async () => {
        const response = await fetch('http://34.18.73.81/inventory', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        return response.json()
    }

    const { data: inventory, isLoading } = useQuery({
        queryKey: ['inventory'],
        queryFn: getInventory
    })

    if (isLoading) return (
        <div className="flex justify-center items-center h-screen">
            <Loader2 className="w-10 h-10 animate-spin" />
        </div>
    )

    return (
        <div className="p-8">
            <DataTable data={inventory.map((inv: Inventory) => ({...inv, createdAt: new Date(inv.createdAt).toLocaleDateString(), updatedAt: new Date(inv.updatedAt).toLocaleDateString()}))} exportFilename="inventory" rowLink={(row: Inventory) => `/inventory/${row.productName}`} view="more" />
        </div>
    )
}

