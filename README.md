# 🌿 Antiquity — Carbon Footprint Awareness Platform

> **Engineered & Designed by [Shivam Kamal](https://www.linkedin.com/in/shivam-kamal-/)**
> 
> *GitHub:* [@shivamkamal3379](https://github.com/shivamkamal3379)  
> *LinkedIn:* [shivam-kamal-](https://www.linkedin.com/in/shivam-kamal-/)

---

### 💡 Catchy Value Proposition
Antiquity is an end-to-end, high-fidelity carbon footprint tracker designed to empower individuals to analyze, gamify, and reduce their ecological impact. By blending real-time carbon math calculations with an interactive Gemini-powered AI Advisor and gamified XP milestones, Antiquity turns climate action into a rewarding daily habit.

---

## 🛠️ Core Tech Stack
*   **Frontend Library:** React.js (Vite Core Compiler)
*   **Styling Engine:** Tailwind CSS v4 (Pure CSS-driven variables, animations, and custom fluid utilities)
*   **AI Agentic Layer:** Client-side Google Gemini 2.5 API integration (with modular fallback mock-advisor logic)
*   **State Management:** React hooks (lifting state up for zero-latency cross-component reactivity)
*   **Persistence Layer:** Browser LocalStorage API (persisting gamified XP progress, challenge histories, and unlocked badges)
*   **Icons:** Lucide React

---

## 🏗️ Key Features Architecture

### 1. The React-Vite Interactive Dashboard
*   **Multi-step Calculator (`CarbonCalculator.jsx`):** A fluid tab-based wizard collecting household energy (electricity/gas), commuting distances (petrol, hybrid, diesel, electric), flight hours, and food choices.
*   **Live Color-Changing Gauge (`CircularProgress.jsx`):** A custom SVG donut progress gauge that shifts colors dynamically from **Eco-Green** (< 3t) to **Amber** (3-8t) to **Alert-Red** (> 8t) depending on emissions output. Includes a clean horizontal bar chart for category breakdowns.

### 2. Double-Engine Gemini AI Advisor (`AIAdvisor.jsx`)
*   **Gemini 2.5 API Integration:** A client-side chatbot sending structured system prompts containing current input variables directly to Google's generative models.
*   **Eco-Simulation Fallback Engine:** Executes real-time mathematics on user inputs when no API key is specified (e.g. calculates custom emission drops if commuters switch vehicles or substitute flight hours) to ensure an offline-first experience.

### 3. Gamified Eco-Action Tracker (`EcoTracker.jsx`)
*   **Daily Challenges:** XP-based checkboxes (e.g. *Meat-Free Day*, *Vampire Energy Hunt*) that increment user levels.
*   **Badges Vault:** Dynamically unlocks themed badge icons (🌱 *Green Sprout*, ⚡ *Volt Guard*, 🚲 *Eco Commuter*, 🥗 *Plant Pioneer*, 🏆 *Carbon Buster*) as milestone thresholds are crossed.

---

## 📊 System & Data Flow Diagram

```
                      [ User Input Habits ]
                                │
                                ▼
         ┌──────────────────────────────────────────────┐
         │            CarbonCalculator State            │
         └──────────────┬──────────────┬──────────────┬─┘
                        │              │              │
                        ▼              ▼              ▼
     ┌──────────────────────┐  ┌──────────────┐  ┌───────────────────────┐
     │  getEmissionStatus   │  │ LocalStorage │  │   Gemini 2.5 API or   │
     │   (Math Utilities)   │  │   XP/Level   │  │  Sustainability Agent │
     └──────────┬───────────┘  └──────┬───────┘  └──────────┬────────────┘
                │                     │                     │
                ▼                     ▼                     ▼
     ┌──────────────────────┐  ┌──────────────┐  ┌───────────────────────┐
     │  CircularProgress    │  │  EcoTracker  │  │       AIAdvisor       │
     │ (Live Color Gauge)   │  │ (Badge Grid) │  │  (Personalized Tips)  │
     └──────────────────────┘  └──────────────┘  └───────────────────────┘
```

---

## ⚙️ Local Installation & Deployment

Follow these commands to get Antiquity running on your local machine:

### 1. Clone the repository
```bash
git clone https://github.com/shivamkamal3379/promptwars-antiquity-platform.git
cd promptwars-antiquity-platform
```

### 2. Install dependencies
```bash
npm install
```

### 3. Add your Gemini API Key (Optional)
Create a `.env` file in the root directory:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```
*(Alternatively, you can click "Set Gemini Key" inside the chatbot UI during runtime to enter it dynamically).*

### 4. Run Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### 5. Compile Production Bundle
```bash
npm run build
```

---

## 🤝 Open-Source Contributions & Licensing
Contributions are welcome! Please feel free to open a Pull Request or report bugs via the GitHub Issues tab. Distributed under the MIT License. Developed for Google Developers PromptWars Virtual Main Challenge 3.
