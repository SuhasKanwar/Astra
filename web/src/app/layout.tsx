import type { Metadata } from "next";
import "./globals.css";
import Provider from "@/context/Provider";

export const metadata: Metadata = {
  title: "Astra",
  description: "Astra is an AI-powered energy supply chain resilience platform that monitors geopolitical events, shipping routes, and market signals to predict disruptions, simulate their impact, and recommend optimal procurement strategies and alternate supply routes, enabling proactive, data-driven energy security.",
  authors: [
    { name: "Astra", url: "https://github.com/SuhasKanwar/Astra" },
    { name: "Suhas Kanwar", url: "https://suhaskanwar.vercel.app" },
    { name: "Pratyaksh Saluja", url: "https://github.com/PratyakshSaluja" }
  ],
  keywords: ["Astra", "AI", "Energy Supply Chain", "Resilience Platform", "Geopolitical Events", "Shipping Routes", "Market Signals", "Disruption Prediction", "Procurement Strategies", "Supply Routes"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Provider>
          {children}
        </Provider>
      </body>
    </html>
  );
}