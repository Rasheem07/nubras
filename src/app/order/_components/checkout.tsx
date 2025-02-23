"use client";

import { useMutation } from "@tanstack/react-query";
import { CreditCard, Loader2 } from "lucide-react";

 // for Next.js App Router


export default function CheckoutButton() {
   
    const handlePayment = async () => {
        const response = await fetch("http://34.18.73.81/payment/checkout");
        const { url } = await response.json();
    
        if (url) {
            window.location.href = url; // Redirect to Stripe Checkout
        }
    };

    const {mutate: initiatePayment, isPending} = useMutation({
        mutationFn: handlePayment
    })


    return (
        
        <button onClick={handlePayment} className="px-6 py-2 bg-blue-600 border border-transparent flex items-center gap-2 rounded-lg text-sm font-medium text-white hover:bg-blue-700 transition-colors duration-200">
           {isPending? <> <Loader2 /> redirecting to payment page </> : <><CreditCard /> Pay now</>} 
        </button>
    )
}
