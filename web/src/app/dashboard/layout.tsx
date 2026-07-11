"use client";

import { useState } from "react";
import Sidebar from "@/components/sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen w-full overflow-hidden bg-(--primary-bg-color)">
            <Sidebar
                onOpen={() => setIsSidebarOpen(true)}
                onClose={() => setIsSidebarOpen(false)}
            />
            <div
                className={`flex-1 flex w-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isSidebarOpen ? 'pl-[clamp(240px,25vw,320px)]' : 'pl-0 md:pl-20'
                    }`}
            >
                {children}
            </div>
        </div>
    );
}