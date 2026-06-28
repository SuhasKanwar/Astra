# Astra

> **A proactive AI-powered fraud prevention platform that protects users from digital scams before they become victims.**

Astra is a real-time digital public safety platform designed to combat the rapidly growing landscape of cyber fraud. Instead of reacting after a scam has occurred, Astra continuously monitors digital interactions, detects suspicious activities, and proactively warns users about potential threats such as scam calls, phishing messages, fake websites, fraudulent UPI requests, and social engineering attacks.

The platform combines mobile intelligence, AI-driven fraud analysis, community-powered reporting, and contextual risk scoring to provide citizens with a personal digital security companion.

---

# Why Astra?

Current fraud detection systems are largely reactive—they investigate fraud after money has been lost.

Astra changes this paradigm by enabling:

* **Early Detection** – Identify fraudulent activity before user interaction.
* **Real-Time Alerts** – Warn users instantly during suspicious interactions.
* **AI-Powered Risk Analysis** – Understand scams beyond keyword matching.
* **Community Intelligence** – Learn from reports submitted by users.
* **Actionable Recommendations** – Explain why something is suspicious and what users should do next.

Our vision is simple:

> **Detect → Warn → Prevent**

---

# Key Features

## Smart Caller Protection

Astra analyzes incoming calls and evaluates the caller's reputation using community reports and AI-based fraud intelligence.

### Capabilities

* Incoming caller identification
* Community-based reputation scoring
* Fraud probability estimation
* Instant warning overlays
* Suspicious caller history

Example:

```
Potential Scam Caller

Risk Score: 94%

Known Digital Arrest Scam
Reported by 36 users
```

---

## SMS Fraud Detection

Incoming SMS messages are analyzed for fraudulent patterns.

The AI detects:

* Digital Arrest scams
* KYC scams
* Banking scams
* Lottery scams
* Fake delivery scams
* Investment scams
* Job scams

Users receive an alert before interacting with suspicious links or payment requests.

---

## WhatsApp Fraud Detection

Astra monitors WhatsApp notifications (with user permission) and detects scams such as:

* Digital Arrest messages
* Family impersonation
* Job scams
* Investment fraud
* Fake banking messages
* UPI payment requests

Instead of simply flagging the message, Astra explains:

* Why it is suspicious
* Risk score
* Recommended action

---

## Phishing URL Detection

Users can paste or scan any URL.

The AI analyzes:

* Domain age
* Brand impersonation
* Suspicious keywords
* SSL information
* Threat intelligence
* URL structure

Result:

```
Risk: High

Possible phishing website
```

---

## Screenshot Intelligence

Users can upload screenshots from:

* WhatsApp
* SMS
* Telegram
* Emails
* Banking apps

The system performs:

Screenshot → OCR → AI Analysis → Fraud Classification

---

## QR Code Scanner

Scans payment QR codes and verifies:

* Merchant authenticity
* Linked UPI IDs
* Community reports
* Fraud history

Users are warned before completing payments.

---

## AI Fraud Intelligence

Unlike traditional spam filters, Astra understands the context of conversations.

The AI identifies:

* Threat language
* Authority impersonation
* Psychological manipulation
* Urgency
* Payment requests
* Emotional exploitation

This allows Astra to detect scams that have never been explicitly seen before.

---

## Fraud Heatmap

An interactive dashboard visualizing fraud trends across regions.

Shows:

* Scam hotspots
* Most common fraud types
* Community reports
* Emerging scam clusters

Useful for:

* Citizens
* Law Enforcement
* Cyber Security Teams

---

## Community Intelligence

Users can report:

* Scam numbers
* Fraud websites
* UPI IDs
* Fraud messages
* QR codes

Community reports continuously improve Astra's fraud intelligence network.

---

## AI Fraud Assistant

Users can ask questions like:

* "Is this message genuine?"
* "What is a Digital Arrest scam?"
* "Should I trust this website?"
* "Why was this call flagged?"

The assistant explains its reasoning instead of providing simple classifications.

---

# System Architecture

```
                        React Native Mobile App
                                 │
        ┌────────────────────────┼────────────────────────┐
        │                        │                        │
        ▼                        ▼                        ▼
  Call Events              Messages & Notifications    User Uploads
        │                        │                        │
        └────────────────────────┼────────────────────────┘
                                 ▼
               Node.js / Bun Backend + PostgreSQL Database
                                 │
                Authentication • APIs • Rate Limiting
                                 │
                                 ▼
                         FastAPI AI Service
        ┌────────────────────────────────────────────────────┐
        │                                                    │
        │  • OCR Pipeline                                    │
        │  • Scam Classification                             │
        │  • URL Analysis                                    │
        │  • Risk Scoring Engine                             │
        │  • Voice Analysis                                  │
        │  • Fraud Recommendation Engine                     │
        └────────────────────────────────────────────────────┘
```

---

# Technology Stack

## Mobile

* React Native
* Expo (Prebuild Workflow)
* TypeScript
* Expo Router
* Zustand
* TanStack Query

---

## Backend

* Bun.js / Node.js
* Hono / Express
* JWT Authentication
* REST APIs

---

## AI Service

* FastAPI
* Python
* Transformers
* PaddleOCR
* Faster Whisper
* LLM-based Fraud Classification

---

## Database

* PostgreSQL

---

## Infrastructure

* Docker
* GitHub Actions (Future)
* Expo EAS Build

---

# AI Pipeline

```
Incoming Event
        │
        ▼
Content Extraction
        │
        ▼
AI Classification
        │
        ▼
Risk Scoring
        │
        ▼
Threat Explanation
        │
        ▼
Instant User Notification
```

---

# Risk Scoring

Every suspicious event receives a dynamic fraud score based on multiple signals.

Signals include:

* Scam keywords
* Community reports
* URL reputation
* Sender history
* Contextual analysis
* Threat patterns
* Behavioral indicators

Output:

```
Risk Score: 91%

Threat Type:
Digital Arrest Scam

Recommendation:
Do not share personal information.
Block the caller and report the incident.
```

---

# Project Goals

* Protect citizens from digital fraud in real time.
* Reduce financial losses caused by cyber scams.
* Increase awareness through contextual AI explanations.
* Build a community-driven fraud intelligence network.
* Assist law enforcement with actionable fraud insights.

---

# Future Scope

* Telecom provider integration
* Banking fraud APIs
* Real-time call transcription
* Voice deepfake detection
* Fraud network analysis
* Browser extension
* WearOS support
* Smartwatch alerts
* Cross-device synchronization
* Enterprise fraud intelligence dashboard

---

# Project Status

Currently under active development.

The MVP focuses on:

* Smart Caller Protection
* SMS Fraud Detection
* WhatsApp Fraud Detection
* Screenshot Intelligence
* QR Code Verification
* URL Risk Analysis
* AI Fraud Classification
* Community Reporting

Future releases will expand Astra into a comprehensive, AI-powered cyber safety ecosystem.

---

# Vision

**Astra envisions a future where every citizen has an intelligent digital guardian capable of identifying, understanding, and preventing cyber fraud before it causes harm. By combining real-time monitoring, explainable AI, and community intelligence, Astra transforms digital safety from a reactive process into a proactive defense system.**