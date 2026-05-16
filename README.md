<div align="center">
  <h1 align="center">ZeroNode</h1>
  <p align="center">
    <strong>An AI-Powered Semantic Knowledge Graph & Learning Canvas</strong>
  </p>
  <p align="center">
    <a href="#features">Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#installation">Installation</a> •
    <a href="#usage">Usage</a>
  </p>
</div>

---

## 🌌 Overview

**ZeroNode** is a next-generation visual learning workspace that blends the spatial flexibility of an infinite canvas with the deep reasoning capabilities of LLMs. 

Map out complex architectures, learn new programming concepts, and seamlessly bridge the gap between ideas. ZeroNode uses highly optimized semantic vector search and ultra-fast LLM streaming to automatically generate, expand, and wire together knowledge nodes in real time.

---

## ✨ Features

- ⚡ **Lightning Fast AI Generation:** Enter a prompt and instantly watch your canvas populate with interconnected nodes. Powered by Groq's Llama 3 via seamless Server-Sent Events (SSE) streaming.
- 🧠 **Semantic Autowiring:** Every node you create is mathematically mapped using Google Gemini Embeddings. Click "Find Related" to instantly draw glowing, percentage-matched edges between contextually similar concepts.
- 💬 **Graph-Native AI Chat:** Ask questions about your notes! The embedded AI tutor strictly reads only the data mapped on your canvas, eliminating out-of-scope hallucinations.
- 🪄 **Deep Node Expansion:** Don't know enough about a concept? Click "Expand with AI" to generate a highly-educational, concise breakdown right inside the node.
- 🔗 **Zero-Backend Multiplayer Sharing:** Hit "Share" to instantly compress your entire canvas state into a deeply-encoded URL hash. Paste it to a friend, and Next.js will auto-rehydrate their board instantly.
- 📸 **High-Res Studio Export:** Instantly export pristine, UI-free 1080p PNG snapshots of your workspace for Twitter, blogs, or documentation.
- 🎯 **Double-Click Smart Zoom:** Double-click any node to instantly sweep the camera and perfectly frame the node and its semantic cluster.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Canvas Engine:** [React Flow (@xyflow/react)](https://reactflow.dev/)
- **AI / LLMs:** [Groq (Llama 3 8B)](https://groq.com/) & [Google Gemini (Text Embeddings)](https://ai.google.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Components:** Custom dark-glassmorphism UI with staggered micro-animations

---

## 🚀 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/StreetCoder02/ZeroNode.git
   cd ZeroNode
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root directory and add your API keys:
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open the app:**
   Navigate to [http://localhost:3000/app](http://localhost:3000/app) to access the canvas.

---

<div align="center">
  Built with ❤️ by Aniruddha Pratap Singh
</div>
