import HeroSection from "@/components/hero-section";
import FeaturesSection from "@/components/features-section";
import SupplyChainSection from "@/components/supply-chain-section";
import BotInferenceSection from "@/components/bot-inference-section";
import AgentDeductionSection from "@/components/agent-deduction-section";
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