'use client'
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
    const router = useRouter();

    useEffect(() => {
        setTimeout(() => {
            router.push('/dashboard');
        }, 300);
    }, []);
    return (
        <div className="flex flex-col items-center justify-center h-screen gap-2">
            <Loader2 className="animate-spin" />

            <h1 className="text-lg">Redirecting to dashboard...</h1>
        </div>

    )
}