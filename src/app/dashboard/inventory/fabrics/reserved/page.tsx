'use client'
import DataTable from "@/app/dashboard/_components/DataTable.";
import { useQuery } from "@tanstack/react-query";

export default function ReservedFabrics() {

    const {data: reservedFabrics, isLoading} = useQuery({
        queryKey: ['reservedFabrics'],
        queryFn: async () => {
            const response = await fetch('http://alnubrasstudio.ddns.net/inventory/reserved-fabrics', {
                credentials: 'include'
            })
            const json = await response.json()
            return json;
        }
    })
    return (
        <div className="p-8 space-y-8">
             <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Reserved Fabrics for orders</h1>
            </div>
 
            
            <DataTable data={reservedFabrics} exportFilename="reserved-fabrics"/>
        </div>
    )
}