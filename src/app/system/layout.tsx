'use client'
import VerificationStates from "@/components/verificationUi";
import { usePermission } from "@/hooks/usePermission"
import { ArrowLeft, Shield } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// app/settings/layout.tsx
export default function SettingsLayout({
    children
  }: {
    children: React.ReactNode
  }) {

    const pathname = usePathname()

    const isAdmin = usePermission('ADMIN');
    
    return (
      <div className="min-h-screen  bg-gray-900">
        {isAdmin ?
        
        <div className="flex">
          {/* Sidebar */}
          <aside className="w-56 min-h-screen border-r border-gray-800">
            <nav className="p-4 space-y-2">
              <Link href="/dashboard" className={`flex items-center px-3 py-2 text-sm rounded-lg  ${pathname == '/dashboard'?'bg-blue-600 text-white' :'text-gray-300 hover:bg-gray-800'}`}>
                <ArrowLeft />
                Back to dashboard
              </Link>
              <div className="px-3 py-2 text-sm font-medium text-gray-400 uppercase">
                Admin Settings
              </div>
              <Link href="/system/users" className={`flex items-center px-3 py-2 text-sm rounded-lg  ${pathname == '/system/users'?'bg-blue-600 text-white' :'text-gray-300 hover:bg-gray-800'}`}>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Users
              </Link>
              <Link href="/system/config" className={`flex items-center px-3 py-2 text-sm rounded-lg  ${pathname == '/system/config'?'bg-blue-600 text-white' :'text-gray-300 hover:bg-gray-800'}`}>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Configuration
              </Link>
              <Link href="/system/analytics" className={`flex items-center px-3 py-2 text-sm rounded-lg  ${pathname == '/system/analytics'?'bg-blue-600 text-white' :'text-gray-300 hover:bg-gray-800'}`}>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Analytics
              </Link>
              <Link href="/system/logs" className={`flex items-center px-3 py-2 text-sm rounded-lg  ${pathname == '/system/logs'?'bg-blue-600 text-white' :'text-gray-300 hover:bg-gray-800'}`}>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Logs
              </Link>
            </nav>
          </aside>
  
          {/* Main content */}
          <main className="flex-1 p-8 overflow-y-auto max-h-screen">
            <header>

            </header>
            {children}
          </main>
        </div>
        : (
            <VerificationStates state={isAdmin ? 'success' : 'verifying'}/>
        )
        }
      </div>
    )
  }