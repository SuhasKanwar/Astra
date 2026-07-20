# Astra
### AI-Powered Energy Supply Chain Resilience Platform

> Predicting disruptions. Optimizing procurement. Securing energy supply.

## Overview

Astra is an AI-powered decision intelligence platform designed to improve the resilience of energy supply chains in import-dependent economies. It continuously monitors geopolitical events, logistics networks, shipping routes, commodity prices, and supplier risks to detect potential disruptions before they impact operations.

Using AI, predictive analytics, and geospatial intelligence, Astra enables organizations to proactively plan procurement, optimize supply routes, and respond effectively to global supply chain uncertainties.

---

## Problem Statement

India imports nearly **88% of its crude oil**, with a significant portion transported through geopolitically sensitive regions such as the **Strait of Hormuz**. Disruptions caused by conflicts, sanctions, shipping delays, or market volatility can severely impact fuel availability, procurement costs, and national energy security.

Existing supply chain systems are largely reactive and lack the capability to:
- Continuously monitor geopolitical risks
- Predict supply chain disruptions
- Simulate crisis scenarios
- Recommend alternative procurement strategies
- Optimize strategic reserve utilization

Astra addresses these challenges by providing a unified AI-powered platform that transforms reactive decision-making into proactive energy supply chain management.

---

## Objectives

- Monitor global geopolitical and logistics risks in real time.
- Predict potential supply chain disruptions.
- Simulate disruption scenarios and assess their impact.
- Recommend optimized procurement routes and suppliers.
- Improve operational resilience through AI-driven insights.

---

## Key Features & Architecture Implemented

The Astra platform features a highly resilient foundation optimized for complex decision intelligence, leveraging sophisticated AI orchestration, seamless user experience, and enterprise-grade architecture.

### 1. Advanced LLM Orchestration & Tool Execution
At the core of Astra's predictive capabilities is a sophisticated, multi-model AI routing engine designed to handle complex supply chain queries dynamically:
- **Intelligent Model Routing:** Employs a primary Router Model that dynamically evaluates the complexity and domain of incoming queries, intelligently routing them to specialized models (such as **Nemotron** for deep reasoning/NLP tasks and **Llama** for rapid, structured data extraction).
- **Recursive Tool Calling Mechanism:** The orchestration layer is equipped to handle autonomous, multi-step research. When a query requires sequential data synthesis (e.g., fetching real-time energy prices, analyzing shipping routes, and generating a geopolitical report), the AI can recursively trigger necessary tools, evaluating intermediate outputs before formulating a final, verified response.
- **Context-Aware Reasoning:** Incorporates live data feeds (e.g., semiconductor export controls, global shipping constraints) directly into the model's system prompt. This ensures the AI isn't just relying on static training data, but is acutely aware of real-time macroeconomic and geopolitical shifts during its reasoning process.

### 2. Comprehensive Session Management
Astra supports persistent, highly contextual investigative workflows tailored for analysts:
- **Stateful Conversational Memory:** Each chat session maintains strict historical context, allowing supply chain analysts to engage in continuous, multi-turn deep dives into specific disruption scenarios without the AI losing track of the investigation.
- **Dynamic Routing & Deep Linking:** Utilizes Next.js App Router for dynamic URL-based session states (`/dashboard/bot/[conversationId]`). This allows teams to safely bookmark, share, and return to specific analytical sessions with zero loss of context.
- **Robust Workspace Organization:** Analysts can seamlessly manage their investigative workspace through intuitive UI controls to rename, delete, and organize historical sessions via globally accessible, animated modal interfaces.

### 3. State-of-the-Art User Experience (UI/UX)
Designed for high-pressure scenarios, Astra employs a modern, premium design system that reduces cognitive load:
- **Optimistic UI Rendering:** Built with advanced asynchronous state handling, ensuring user inputs and interactions render instantaneously on-screen without waiting for network round-trips. This delivers a completely fluid analytical flow.
- **Glassmorphic Aesthetics:** Features sleek, translucent floating headers and unobtrusive UI elements that ensure critical data and analytical text remain the primary focal point.
- **Interactive Micro-Animations:** Elegant hover states, seamlessly animated modals, and real-time floating toast notifications provide immediate, polished feedback to the user.

### 4. Resilient Frontend Engineering
The platform's underlying architecture is designed for scale, speed, and safety:
- **Race-Condition Safeguards:** Incorporates advanced React state management techniques (such as cleanup closures and abort controllers) to handle strict-mode invocations and rapid asynchronous AI responses without data overwrites or layout shifts.
- **Modular Component Design:** Built with decoupled, reusable components (like isolated history modals, global toast providers, and generic confirmation variants), making the codebase highly maintainable and easily extensible for future predictive modules.