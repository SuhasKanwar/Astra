import NewsComponent from "@/components/dashboard/NewsComponent";
import NaturalEventsWidget from "@/components/dashboard/NaturalEventsWidget";
import GeopoliticalEventsCarousel from "@/components/dashboard/GeopoliticalEventsCarousel";

export default function DashboardPage() {
    return (
        <main className="flex w-full h-full overflow-hidden ">
            <div className="flex-1 p-6 md:p-8 overflow-y-auto mt-20 hide-scrollbar">
                <div className="w-full h-[600px]">
                    <NaturalEventsWidget />
                </div>
                <GeopoliticalEventsCarousel />
            </div>
            <div className="hidden lg:block w-87.5 xl:w-100 border-l border-(--border-color) bg-(--surface-color) p-6 overflow-hidden">
                <NewsComponent />
            </div>
        </main>
    );
}