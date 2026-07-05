import HeroSection from "@/components/home/hero-section";
import FeaturesSection from "@/components/home/features-section";
import SupplyChainSection from "@/components/home/supply-chain-section";
import BotInferenceSection from "@/components/home/bot-inference-section";
import AgentDeductionSection from "@/components/home/agent-deduction-section";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <HeroSection />
      <BotInferenceSection />
      <SupplyChainSection />
      <FeaturesSection />
      <AgentDeductionSection />
      <Footer />
    </main>
  );
}