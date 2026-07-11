import NewsComponent from "@/components/dashboard/NewsComponent";

export default function DashboardPage() {
    return (
        <main className="flex w-full h-full overflow-hidden">
            <div className="flex-1 p-6 md:p-8 overflow-y-auto mt-20">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-(--primary-text-color) tracking-tight">Dashboard Overview</h1>
                    <p className="text-(--secondary-text-color) mt-2 text-sm">Welcome to your Astra dashboard.</p>
                </div>
            </div>
            <div className="hidden lg:block w-87.5 xl:w-100 border-l border-(--border-color) bg-(--surface-color) p-6 overflow-hidden">
                <NewsComponent />
            </div>
        </main>
    );
}