'use client'
import { useQuery } from "@tanstack/react-query";
import { ClipboardCheck, Loader2, Package, PackageCheck, Truck } from "lucide-react";
import { useParams } from "next/navigation";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { PDFDownloadLink } from "@react-pdf/renderer";
import OrderPDF from "@/app/dashboard/_components/orderInvoiceForSingle";
import { OrderData } from "@/types";
import OrderDetailsPage from "../../_components/orderDetailsPage";


export default function TrackingPage() {
  const { trackingToken } = useParams();

  const getOrder = async () => {
    const response = await fetch(`http://34.18.99.10/order/${trackingToken}`, { credentials: 'include' })
    return response.json()
  }

  const { data: order, isLoading } = useQuery<OrderData>({
    queryKey: ['order'],
    queryFn: () => getOrder()
  });

 

  return (
    <div className="bg-gray-50">
      {isLoading && (
        <div className="w-full flex flex-col gap-2 items-center justify-center min-h-screen">
          <p className="font-sans text-gray-800">Taking you in...</p>
          <Loader2 className="text-gray-800 animate-spin"/>
        </div>
      )}
      {order && (
        <OrderDetailsPage orderData={order!} />
      )}
    </div>

  )


}

