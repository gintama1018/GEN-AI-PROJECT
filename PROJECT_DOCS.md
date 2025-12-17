# GeminiMind - Technical Documentation

## 1. Executive Summary
GeminiMind is an advanced client-side AI application designed to demonstrate the capabilities of **Google Gemini 2.5 Flash**. It serves two primary use cases:
1.  **Education:** Transforming static documents into interactive assessments (Dynamic Learning Tool).
2.  **Creation:** Generating specialized content using distinct AI personas.

The application is built with a "Modern Minimal" design philosophy, prioritizing content visibility, speed, and cognitive load reduction.

---

## 2. Architecture & Tech Stack

### 2.1 Core Technologies
-   **Framework:** React 18 (Vite)
-   **Language:** TypeScript
-   **AI Interface:** `@google/generative-ai` SDK
-   **Styling:** Native CSS Variables (Zinc/Slate Palette)
-   **Icons:** Lucide React

### 2.2 Directory Structure
```
src/
├── components/
│   ├── common/       # Shared UI (Sidebar, Modals)
│   ├── DLT/          # Dynamic Learning Tool components (Upload, Questions, Feedback)
│   └── ContentGen/   # Content Generation components (Persona, Output)
├── services/
│   ├── gemini.ts     # Centralized API logic and Prompt Engineering
│   └── storage.ts    # LocalStorage wrapper for persistence
├── utils/            # Helpers (PDF parsing, etc.)
└── types/            # TypeScript interfaces (Question, Persona, etc.)
```

---

## 3. AI Implementation Details

### 3.1 Model Configuration
The application exclusively uses the **Gemini 2.5 Flash** model for its balance of high speed and reasoning capabilities.
-   **Model Name:** `gemini-2.5-flash`
-   **Safety Settings:** Standard default configuration.

### 3.2 Dynamic Learning Tool (DLT) Workflow
1.  **Ingestion:** Text is extracted from PDF/MD files using browser-side parsing.
2.  **Question Generation:**
    *   **Prompt Strategy:** Using "Expert Educator" persona. 
    *   **Constraint:** Enforces strictly formatted JSON output using precise system instructions (`Return ONLY a valid JSON array...`).
    *   **Logic:** Requests 5 distinct question types (Analytical, Inferential, Evaluative, Application, Synthesis).
3.  **Evaluation:**
    *   **Prompt Strategy:** Contextual comparison. The model receives the *Original Document* + *Question* + *User Answer*.
    *   **Output:** Generates a structured JSON scorecard with specific feedback and improvement areas.

### 3.3 Persona System
The Content Generator allows injecting "System Instructions" dynamically.
-   **Mechanism:** `genAI.getGenerativeModel({ systemInstruction: ... })`
-   **Storage:** Personas are stored in `localStorage` to allow users to build their own library of experts.

---

## 4. Design System: "Modern Minimal"

The UI was overhauled from a "Space/Aurora" theme to a professional, high-contrast schematic design.

### 4.1 Color Palette (Zinc/Slate)
-   **Background:** `var(--bg-base)` -> `#09090b` (Zinc 950)
-   **Surface:** `var(--bg-surface)` -> `#18181b` (Zinc 900)
-   **Border:** `var(--border-subtle)` -> `#27272a` (Zinc 800)
-   **Text Primary:** `var(--text-primary)` -> `#fafafa` (Zinc 50)

### 4.2 Interaction Patterns
-   **Sidebar:** Implements an "Overlay Expansion" model.
    -   *Collapsed:* Fixed 72px width.
    -   *Expanded:* Absolute positioning allows it to float *over* content, preventing layout shift (CLS).
-   **Feedback:** Minimal hover states (border contrast increase) rather than glow effects.

---

## 5. Security & Deployment

### 5.1 API Key Management
-   **Development:** `.env` file (`VITE_GEMINI_API_KEY`).
-   **Production:** Users can input their key via the UI (stored strictly in `localStorage`).
-   **Safety:** Keys are never sent to any backend server (Client-side only).

### 5.2 Future Roadmap
-   [ ] **Server-Side Proxy:** To hide API keys for a fully public hosted version.
-   [ ] **History Sync:** Integrate with Firebase/Supabase for cross-device history.
-   [ ] **Vision Capabilities:** Use Gemini 2.5 Flash to analyze images strictly for Content Gen.
