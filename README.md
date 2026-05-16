# ZeroNode — AI-Powered Knowledge Graph

> ⚠️ Screenshots/GIF coming soon — see live demo below.

**[Live Demo](https://zero-node-jade.vercel.app)** | Built by Aniruddha Pratap Singh

---

## What is ZeroNode?
ZeroNode is an intelligent learning canvas that turns scattered notes into a living knowledge graph. It uses advanced language models and semantic vector search to automatically connect your ideas, uncover knowledge gaps, and help you think deeper.

## Features
- **Lightning Fast AI Generation:** Enter a prompt and instantly watch your canvas populate with interconnected nodes via streaming.
- **Semantic Autowiring:** Every node is mathematically mapped. Double click to instantly draw glowing, percentage-matched edges between contextually similar concepts.
- **Graph-Native AI Chat:** Ask questions about your notes! The embedded AI tutor strictly reads only the data mapped on your canvas.
- **Deep Node Expansion:** Click "Expand with AI" to generate a highly-educational, concise breakdown right inside the node.
- **Zero-Backend Multiplayer Sharing:** Hit "Share" to instantly compress your entire canvas state into a deeply-encoded URL hash.
- **High-Res Studio Export:** Instantly export pristine, UI-free 1080p PNG snapshots of your workspace.

## Tech Stack
| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Canvas | React Flow (@xyflow/react) |
| AI / LLM | Groq – Llama 3 8B (SSE streaming) |
| Embeddings | Google Gemini Text Embeddings |
| Styling | Tailwind CSS + shadcn/ui |

## Getting Started

1. **Configure Environment Variables:**
   Create a `.env.local` file in the root directory and add your API keys:
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

## Environment Variables
| Variable | Required | Description |
|----------|----------|-------------|
| GROQ_API_KEY | Yes | From console.groq.com |
| GEMINI_API_KEY | Yes | From aistudio.google.com |

## How It Works
1. **Input a Topic:** You enter a seed prompt or idea into the AI generation modal.
2. **AI Generates Nodes:** The Groq Llama 3 model processes the request and streams back exactly 7 distinct concepts, mapping them spatially onto the canvas.
3. **Semantic Links Drawn:** Google Gemini automatically vectorizes each node. Click "Find Related" to calculate cosine similarities and dynamically draw relationships.

## Roadmap
- [ ] Persistent graph storage (Supabase / local file)
- [ ] Export to Markdown / Notion
- [ ] Mobile touch support
- [ ] Collaborative multi-user canvas

## License
MIT © 2025 Aniruddha Pratap Singh
