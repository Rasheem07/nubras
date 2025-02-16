import Header from "./_components/Header";
import Sidebar from "./_components/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen bg-gray-900 overflow-hidden">
            <Sidebar />
            <div className="flex-1 w-full overflow-hidden">
                <Header />
                <div className="w-full overflow-x-hidden">{children}</div>
            </div>
        </div>
    );
}
