# GeminiMind 🧠

> **AI-Powered Learning & Content Generation Suite**
>
> *Powered by Google Gemini 2.5 Flash*

GeminiMind is a modern, minimal web application designed to augment human intelligence. It features two powerful engines: a **Dynamic Learning Tool (DLT)** for deep document analysis and assessment, and a **Content Generator** with custom AI personas.

Built with a focus on **Minimal Design**, usability, and speed.

![GeminiMind UI](./public/screenshot-placeholder.png)

## ✨ Key Features

### 📚 Dynamic Learning Tool (DLT)
Turn any document into an interactive exam.
*   **Deep Analysis**: Extracts core concepts from PDF, Markdown, or Text files.
*   **Question Generation**: Creates 5 unique questions (Analytical, Inferential, Evaluative, etc.) based on your content.
*   **AI Assessment**: Grades your answers with precision, identifying gaps in knowledge and providing constructive feedback.

### ✍️ Persona-Based Content Gen
Generate tailored content with distinct voices.
*   **Custom Personas**: Define AI experts (e.g., "Tech Technical Writer", "Creative Marketing Guru").
*   **Contextual Generation**: Ensures output matches the requested format, tone, and length.
*   **History & Management**: (Coming Soon) seamless management of your prompt library.

## 🛠️ Tech Stack

*   **Frontend**: React (Vite) + TypeScript
*   **AI Model**: Google Gemini 2.5 Flash via `GoogleGenerativeAI` SDK
*   **Styling**: Vanilla CSS (Modern Minimal Design System) + Lucide React Icons
*   **State**: Local React State + LocalStorage Strategy

## 🚀 Getting Started

### Prerequisites
*   Node.js (v18+)
*   A [Google Gemini API Key](https://aistudio.google.com/)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/gemini-mind.git
    cd gemini-mind
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment**
    Create a `.env` file in the root directory:
    ```env
    VITE_GEMINI_API_KEY=your_actual_api_key_here
    ```

4.  **Run Development Server**
    ```bash
    npm run dev
    ```

## 🎨 Design System

**"Modern Minimal"**
*   **Palette**: Zinc & Slate (Dark Mode Native)
*   **Typography**: *Inter* (Body), *Outfit* (Headings)
*   **Philosophy**: Distraction-free, content-first interfaces with precision micro-interactions.

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a PR for any improvements.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
