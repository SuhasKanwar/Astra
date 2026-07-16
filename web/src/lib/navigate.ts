import { CardNavItem } from "@/components/ui/card-nav";

export const SIDEBAR_ITEMS = [
    { label: 'Home', ariaLabel: 'Go to dashboard page', link: '/dashboard' },
    { label: 'Bot', ariaLabel: 'Chat with our AI Assistant', link: '/dashboard/bot' },
    { label: 'Historical Events', ariaLabel: 'View historical disruptions', link: '/dashboard/events' },
    { label: 'Fleet Management', ariaLabel: 'Manage your fleet', link: '/dashboard/fleet' },
];

export const SIDEBAR_SOCIAL_ITEMS = [
    { label: 'GitHub', link: 'https://github.com/SuhasKanwar/Astra' },
];

export const NAV_ITEMS: CardNavItem[] = [
    {
        label: "Disruptions",
        bgColor: "var(--primary-color)",
        textColor: "var(--surface-color)",
        links: [
            { label: "Geopolitical Events", ariaLabel: "View geopolitical disruptions", href: "/dashboard?tab=events" },
            { label: "Shipping Routes", ariaLabel: "View shipping route blockages", href: "/dashboard?tab=routes" },
            { label: "Market Signals", ariaLabel: "View market and price signals", href: "/dashboard?tab=signals" }
        ]
    },
    {
        label: "Analytics",
        bgColor: "var(--secondary-color)",
        textColor: "var(--surface-color)",
        links: [
            { label: "Disruption Predictions", ariaLabel: "View disruptions prediction models", href: "/dashboard?tab=predictions" },
            { label: "Risk Simulations", ariaLabel: "Run disruption scenarios", href: "/dashboard?tab=simulations" }
        ]
    },
    {
        label: "Contact",
        bgColor: "var(--surface-strong-color)",
        textColor: "var(--primary-text-color)",
        links: [
            { label: "Suhas Kanwar", ariaLabel: "Suhas Kanwar", href: "https://github.com/SuhasKanwar" },
            { label: "Pratyaksh Saluja", ariaLabel: "Pratyaksh Saluja", href: "https://github.com/PratyakshSaluja" }
        ]
    }
];