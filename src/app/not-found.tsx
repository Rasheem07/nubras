import Link from "next/link";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center h-screen gap-2">
            <h1 className="text-lg font-bold">Page Not Found</h1>
            <p className="text-sm">The page you are looking for does not exist.</p>
            <Link href="/dashboard" className="text-blue-500 hover:text-blue-700">Go to dashboard</Link>
        </div>
    )
}
