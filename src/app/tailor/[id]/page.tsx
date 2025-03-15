'use client'
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import DataTable from "@/app/dashboard/_components/DataTable.";

export default function TailorOrder() {

    const { id } = useParams();

    const getOrderDetails = async () => {
        const response = await fetch(`http://alnubrasstudio.ddns.net:8888/tailor/order/${id}`, {
            credentials: 'include'
        })
        return response.json()
    }

    const { data: order, isLoading } = useQuery({
        queryKey: ['order', id],
        queryFn: getOrderDetails
    })

    return (
        <div className="p-8 min-h-screen flex w-full justify-center min-w-[100vw]">
            <div className="grid grid-cols-2 w-full gap-8 place-items-center">
                <div className="space-y-8">

                    <div className="flex flex-col gap-4">
                        <h1 className="text-2xl font-bold">Order Details</h1>
                        <div className="flex flex-col gap-2">

                            <p className="text-sm text-gray-500">Order ID: {order?.InvoiceId}</p>
                            <p className="text-sm text-gray-500">Date: {order?.date}</p>
                            <p className="text-sm text-gray-500">Branch: {order?.branch}</p>
                            <p className="text-sm text-gray-500">Status: {order?.status}</p>
                            <p className="text-sm text-gray-500">Product Name: {order?.productName}</p>
                            <p className="text-sm text-gray-500">Due Date: {order?.dueDate}</p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4">
                        <h1 className="text-2xl font-bold">Customer Details</h1>
                        <div className="flex flex-col gap-2">
                            <p className="text-sm text-gray-500">Name: {order?.Customer?.name}</p>
                            <p className="text-sm text-gray-500">Phone: {order?.Customer?.phone}</p>
                        </div>
                    </div>
                </div>
                <div className="space-y-8">
                    <div className="flex flex-col gap-4">
                        <h1 className="text-2xl font-bold">Fabric Details</h1>
                        <DataTable data={order?.Fabric} exportFilename="fabric" />
                    </div>
                </div>
            </div>

        </div>

    )
}
