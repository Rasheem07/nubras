'use client';

import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

function Callback() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const url = searchParams.get('url');

    useEffect(() => {
         // Ensure the user is logged in before processing URL redirection
         if (!document.cookie.includes('isLogined=true') && !document.cookie.includes('isTailoredLogin=true') && !document.cookie.includes('isSalesmanLogined=true')) {
            router.replace('/login');
            return;
        }

        const checkUserAndRedirect = async () => {
                const response = await fetch(`http://alnubrasstudio.ddns.net/role/user-type`, {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                });

                if (!response.ok) throw new Error("Failed to fetch");

                const { userType } = await response.json();

                // If no URL is provided, redirect to the respective dashboard
                if (!url) {
                    router.replace(userType === 'admin' ? '/dashboard' : userType === "tailor"?  '/tailor' : 'salesman');
                    return;
                }

                // Redirect based on role access restrictions
                if (userType === 'admin' && (url.startsWith('/tailor') || url.startsWith('/salesman'))) {
                    router.replace('/dashboard');
                } else if (userType === 'tailor' && (url.startsWith('/dashboard') || url.startsWith('salesman'))) {
                    router.replace('/tailor');
                } else if (userType === 'salesman' && (url.startsWith('/dashboard') || url.startsWith('/tailor'))) {
                    router.replace('/salesman');
                } else if (userType === 'admin' && url.startsWith('/system')) {
                    router.replace('/system');
                } else {
                    router.replace(url); // If URL is valid for the user, allow navigation
                }

        };

        checkUserAndRedirect();
    }, []); // Ensure useEffect runs when `url` or `router` changes

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <div className="text-center bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700">
                <div className="relative w-32 h-32 mx-auto mb-6">
                    <div className="absolute inset-0">
                        <svg className="animate-spin h-full w-full text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Verifying your access...</h2>
                <p className="text-gray-400 text-lg">Please wait while we redirect you</p>
                <div className="mt-8 space-y-2">
                    <div className="flex items-center justify-center space-x-2 text-blue-400">
                        <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                        </svg>
                        <span>Securing your session</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function Page() {
    return (
        <Suspense fallback={<Loader2 className="animate-spin"/>}>
            <Callback />
        </Suspense>
    )
}