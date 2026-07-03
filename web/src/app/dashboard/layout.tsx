import Sidebar from "@/components/sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <Sidebar />
            {children}
        </div>
    );
}