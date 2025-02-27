"use client";
import { Box, Scale3DIcon, Shirt, Package, Layers, ChevronRight, ChevronDown, LayoutDashboard, PackageCheck, Users, BadgePercent, UserCog, Banknote, Ruler, ScissorsLineDashed, Archive, UserRoundCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Sidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(true);
    const [inventoryOpen, setInventoryOpen] = useState(false);

    return (
        <div className={`${isOpen ? 'min-w-64 p-6 ' : 'p-3'} hidden md:block scrollbar-thin overflow-y-auto transition-all border-r border-gray-700 duration-300 bg-gray-800 text-white space-y-6 ${pathname === '/login' || pathname === '/callback' || pathname.startsWith('/orders/tracking') ? 'hidden' : ''}`}>
            <div className="flex items-end">
                <button className="p-2 hover:bg-gray-700 rounded-lg mt-2 " onClick={() => setIsOpen(!isOpen)}>
                    <div className="flex flex-col gap-1.5">
                        <div className={`h-0.5 bg-white rounded-full transition-all duration-300 ease-in-out ${!isOpen ? 'w-4' : 'w-6'}`}></div>
                        <div className={`h-0.5 bg-white rounded-full transition-all duration-300 ease-in-out ${!isOpen ? 'w-5' : 'w-5'}`}></div>
                        <div className={`h-0.5 bg-white rounded-full transition-all duration-300 ease-in-out ${!isOpen ? 'w-6' : 'w-4'}`}></div>
                    </div>
                </button>
            </div>

            <div className="flex items-center">
                {isOpen && (
                    <>
                        <Image src="/logo.jpeg" alt="Al Nubras Logo" width={40} height={40} className="rounded-lg mix-blend-difference" />
                        <span className="text-xl font-bold ml-3">Al Nubras</span>
                    </>
                )}
            </div>

            <nav className={`${isOpen ? 'space-y-1' : 'space-y-4 max-w-max px-1'}`}>
                {navItems.map((item) => (
                    <Link
                        key={item.name}
                        href={item.href}
                        className={`flex items-center ${isOpen ? 'space-x-3 py-2.5 px-4' : 'justify-center py-1 px-2 max-w-max'}  rounded-lg ${pathname === item.href ? "bg-blue-600" : "text-gray-300 hover:bg-gray-700"}`}
                    >
                        <span className="w-6 h-6 flex items-center justify-center">{item.icon}</span>
                        {isOpen && <span>{item.name}</span>}
                    </Link>
                ))}
                
                {/* Expandable Inventory Section */}
                <div className={`text-gray-300 hover:bg-gray-700 rounded-lg cursor-pointer ${isOpen? 'px-4':'px-2'} py-2 flex items-center justify-between`} onClick={() => setInventoryOpen(!inventoryOpen)}>
                    <div className="flex items-center space-x-3">
                        <Archive className="w-6 h-6" />
                        {isOpen && <span>Inventory</span>}
                    </div>
                    {isOpen && (inventoryOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />)}
                </div>
                {inventoryOpen && (
                    <div className="pl-4 ">
                        <Link href="/dashboard/inventory/products" className="flex items-center text-gray-300 hover:bg-gray-700 px-4 py-2 rounded-lg">
                            <Package className="w-5 h-5 mr-3" />
                            {isOpen && "Products"}
                        </Link>
                        <Link href="/dashboard/inventory/fabrics" className="flex items-center text-gray-300 hover:bg-gray-700 px-4 py-2 rounded-lg">
                            <Layers className="w-5 h-5 mr-3" />
                            {isOpen && "Fabrics"}
                        </Link>
                    </div>
                )}
            </nav>
        </div>
    );
}

const navItems = [
    { name: "Orders", href: "/dashboard/orders", icon: <PackageCheck /> },
    { name: "Analytics", href: "/dashboard", icon: <LayoutDashboard /> },
    { name: "Customers", href: "/dashboard/customers", icon: <Users /> },
    { name: "Services", href: "/dashboard/products", icon: <BadgePercent /> },
    { name: "Sales Persons", href: "/dashboard/sales-persons", icon: <UserCog /> },
    { name: "Transactions", href: "/dashboard/transactions", icon: <Banknote /> },
    // { name: "Measurements", href: "/dashboard/measurements", icon: <Ruler /> },
    { name: "Tailor", href: "/dashboard/tailor", icon: <ScissorsLineDashed /> },
    { name: "Suppliers", href: "/dashboard/suppliers", icon: <UserRoundCheck /> }, 
];
