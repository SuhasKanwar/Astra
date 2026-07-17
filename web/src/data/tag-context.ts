export interface TagContext {
  id: string;
  trigger: string;
  label: string;
  description: string;
}

export const TAG_CONTEXTS: TagContext[] = [
  {
    id: "supply-chain",
    trigger: "@supply-chain",
    label: "Supply Chain Expert",
    description: "Deep logistics and routing knowledge"
  },
  {
    id: "geopolitics",
    trigger: "@geopolitics",
    label: "Geopolitical Analyst",
    description: "Global risk and policy analysis"
  },
  {
    id: "macro-econ",
    trigger: "@macro-econ",
    label: "Macroeconomist",
    description: "Market trends and trade tariffs"
  },
  {
    id: "semicon",
    trigger: "@semicon",
    label: "Semiconductor Specialist",
    description: "Tech hardware supply mapping"
  },
  {
    id: "usa",
    trigger: "@USA",
    label: "United States",
    description: "US policies, trade, and regulations"
  },
  {
    id: "china",
    trigger: "@China",
    label: "China",
    description: "Chinese economy, supply chains, and policies"
  },
  {
    id: "india",
    trigger: "@India",
    label: "India",
    description: "Indian markets and geopolitical stance"
  },
  {
    id: "israel",
    trigger: "@Israel",
    label: "Israel",
    description: "Middle East geopolitics and technology"
  },
  {
    id: "pakistan",
    trigger: "@Pakistan",
    label: "Pakistan",
    description: "South Asian geopolitical dynamics"
  },
  {
    id: "france",
    trigger: "@France",
    label: "France",
    description: "European Union policies and economy"
  },
  {
    id: "donald-trump",
    trigger: "@Donald-Trump",
    label: "Donald Trump",
    description: "Former US President's policies and impact"
  },
  {
    id: "narendra-modi",
    trigger: "@Narendra-Modi",
    label: "Narendra Modi",
    description: "Prime Minister of India's policies"
  },
  {
    id: "russia",
    trigger: "@Russia",
    label: "Russia",
    description: "Energy markets and geopolitical conflicts"
  },
  {
    id: "ukraine",
    trigger: "@Ukraine",
    label: "Ukraine",
    description: "Agricultural exports and regional stability"
  },
  {
    id: "taiwan",
    trigger: "@Taiwan",
    label: "Taiwan",
    description: "Global semiconductor manufacturing hub"
  },
  {
    id: "japan",
    trigger: "@Japan",
    label: "Japan",
    description: "Advanced manufacturing and tech exports"
  },
  {
    id: "south-korea",
    trigger: "@South-Korea",
    label: "South Korea",
    description: "Electronics and automotive supply chains"
  },
  {
    id: "germany",
    trigger: "@Germany",
    label: "Germany",
    description: "European industrial and automotive sector"
  },
  {
    id: "eu",
    trigger: "@EU",
    label: "European Union",
    description: "European trade policies and regulations"
  },
  {
    id: "uk",
    trigger: "@UK",
    label: "United Kingdom",
    description: "British financial markets and trade"
  },
  {
    id: "xi-jinping",
    trigger: "@Xi-Jinping",
    label: "Xi Jinping",
    description: "President of China's geopolitical strategy"
  },
  {
    id: "vladimir-putin",
    trigger: "@Vladimir-Putin",
    label: "Vladimir Putin",
    description: "President of Russia's policies"
  },
  {
    id: "tsmc",
    trigger: "@TSMC",
    label: "TSMC",
    description: "Taiwan Semiconductor Manufacturing Co."
  },
  {
    id: "asml",
    trigger: "@ASML",
    label: "ASML",
    description: "Lithography systems for semiconductors"
  },
  {
    id: "nvidia",
    trigger: "@Nvidia",
    label: "Nvidia",
    description: "AI chips and GPU supply chain"
  },
  {
    id: "nato",
    trigger: "@NATO",
    label: "NATO",
    description: "North Atlantic Treaty Organization"
  },
  {
    id: "opec",
    trigger: "@OPEC",
    label: "OPEC+",
    description: "Global oil production and energy costs"
  }
];