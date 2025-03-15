"use client"

import { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter } from "next/navigation";
import { Bell, Settings, User, LogOut, AppWindow, Loader2 } from 'lucide-react';
import { usePermission } from '@/hooks/usePermission';
import Link from 'next/link';
import { useMutation } from '@tanstack/react-query';

export default function Header() {
    const pathname = usePathname();
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const router = useRouter();
    const admin = usePermission('ADMIN');

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent | any) => {
            if (menuRef.current && !menuRef.current?.contains(event.target)) {
                setIsProfileMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleProfileMenu = () => {
        setIsProfileMenuOpen(!isProfileMenuOpen);
    };

    // Hide header on specific routes
    if (pathname === '/login' || pathname === '/callback' || pathname.startsWith('/orders/tracking')) {
        return null;
    }

    const handleLogout = async () => {
        await fetch('http://alnubrasstudio.ddns.net:8888/auth/logout', {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: 'include'
        })
        router.push('/login')
    }

    const { mutate, isPending } = useMutation({
        mutationFn: handleLogout
    })

    return (
        <header className="bg-gray-800 text-white px-6 py-4 relative">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <h1 className="text-xl font-semibold">Sales Dashboard</h1>
                </div>

                <div className="flex items-center space-x-4">
                    <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors duration-200">
                        <Bell className="w-5 h-5" />
                    </button>

                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={toggleProfileMenu}
                            className="flex items-center space-x-2 focus:outline-none focus:ring-2 ring-gray-600 rounded-full"
                        >
                            <div className="w-8 h-8 rounded-full bg-blue-500 hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center cursor-pointer">
                                <span className="font-semibold text-lg">A</span>
                            </div>
                        </button>

                        {isProfileMenuOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-zinc-50 rounded-lg shadow-lg py-2 text-gray-800 z-50">
                                <button className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-100 w-full transition-colors duration-200">
                                    <User className="w-4 h-4" />
                                    <span>Account</span>
                                </button>
                                <button className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-100 w-full transition-colors duration-200">
                                    <Settings className="w-4 h-4" />
                                    <span>Settings</span>
                                </button>
                                <div className="border-t border-gray-200 my-1"></div>
                                {admin && <Link
                                    href='/system'
                                    className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-100 w-full text-gray-800 transition-colors duration-200"
                                >
                                    <AppWindow className="w-4 h-4" />
                                    <span>System</span>
                                </Link>}
                                <div className="border-t border-gray-200 my-1"></div>
                                <button
                                    onClick={() => mutate()}
                                    className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-100 w-full text-red-600 transition-colors duration-200"
                                >
                                    {isPending ? (
                                        <>
                                            <Loader2 className='h-4 w-4 animate-spin' />
                                            Logging out..
                                        </>
                                    ) : (
                                        <>
                                            <LogOut className="w-4 h-4" />
                                            <span>Logout</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}