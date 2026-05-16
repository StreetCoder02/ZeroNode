<div align="center">

<svg width="80" height="80" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M14 2L25.5 8.5V19.5L14 26L2.5 19.5V8.5L14 2Z" stroke="#3B82F6" stroke-width="1.5" fill="none"/>
  <path d="M14 8L19.5 11V17L14 20L8.5 17V11L14 8Z" fill="#3B82F6" fill-opacity="0.3" stroke="#06B6D4" stroke-width="1"/>
  <circle cx="14" cy="14" r="2" fill="#3B82F6"/>
</svg>

# ZeroNode

### AI-Powered Knowledge Graph

**Turn scattered ideas into a living, explorable constellation of knowledge.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-zero--node--jade.vercel.app-3B82F6?style=for-the-badge&logo=vercel&logoColor=white)](https://zero-node-jade.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![License](https://img.shields.io/badge/License-MIT-8B5CF6?style=for-the-badge)](LICENSE)
[![Made by Ani](https://img.shields.io/badge/Built%20by-StreetCoder02-06B6D4?style=for-the-badge&logo=github&logoColor=white)](https://github.com/StreetCoder02)

<br/>

> *"What if your notes could think?"*

<br/>

</div>

---

## What is ZeroNode?

ZeroNode is an **infinite canvas knowledge graph** powered by AI. Type any topic, and it instantly generates a web of interconnected concepts — visualized as nodes on a canvas you can explore, expand, and chat with.

It's not a note-taking app. It's not a mind map tool. It's a **thinking environment** that uses AI to build the structure you didn't know you needed.

```
You type:  "Teach me system design"
AI builds: 7 connected nodes → auto-linked by meaning → ready to explore
```

---

## Features

<table>
<tr>
<td width="50%">

### ⚡ Streaming AI Generation
Type any topic. Watch nodes appear on the canvas in real time — streamed token by token via Server-Sent Events. No waiting. No black box.

</td>
<td width="50%">

### 🧠 Semantic Auto-Linking
Every node is vectorized by Google Gemini. Nodes with >75% cosine similarity are automatically wired together with glowing edges and match percentages.

</td>
</tr>
<tr>
<td width="50%">

### 💬 Graph-Native AI Chat
Ask your graph anything. The AI answers strictly from your own nodes — no hallucinations, no out-of-scope answers. A tutor built from your own knowledge.

</td>
<td width="50%">

### 🔍 Semantic Search (Cmd+K)
Command palette powered by vector similarity. Search your nodes by meaning, not just keywords. Find what you meant, not what you typed.

</td>
</tr>
<tr>
<td width="50%">

### 🔗 Deep Link Sharing
Hit Share — your entire graph is Base64-encoded into a URL. Anyone who opens it gets your exact graph, hydrated client-side. Zero backend required.

</td>
<td width="50%">

### 📸 1080p PNG Export
Export a pristine, UI-free 1920×1080 screenshot of your canvas. Clean enough to post on Twitter. Built with `html-to-image`.

</td>
</tr>
<tr>
<td width="50%">

### 🛠️ Interactive Toolbar
5 canvas tools — Select, Pan, Add, Connect, Delete. Each changes cursor behavior, interaction mode, and canvas response in real time.

</td>
<td width="50%">

### 💾 Auto-Save Persistence
Your graph auto-saves to localStorage with a 1.5s debounce. Refresh the page — everything is still there. No account needed.

</td>
</tr>
</table>

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | Next.js 16 (App Router) | Full-stack, API routes, SSR |
| **Canvas** | React Flow (`@xyflow/react`) | Infinite canvas, nodes, edges |
| **AI / LLM** | Groq — LLaMA 3.1 8B Instant | Node generation, chat, expansion |
| **Embeddings** | Google Gemini `text-embedding-004` | Semantic linking, similarity search |
| **Styling** | Tailwind CSS v4 + shadcn/ui | UI components, glassmorphism |
| **Streaming** | Server-Sent Events (SSE) | Real-time token streaming |
| **Deployment** | Vercel | Zero-config deployment |

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Next.js App                       │
│                                                     │
│  ┌──────────────┐    ┌──────────────────────────┐   │
│  │  React Flow  │    │      API Routes           │   │
│  │   Canvas     │◄──►│  /api/generate-nodes      │   │
│  │              │    │  /api/embed-node          │   │
│  │  Nodes       │    │  /api/expand-node         │   │
│  │  Edges       │    │  /api/chat-graph          │   │
│  │  Toolbar     │    └──────────┬───────────────┘   │
│  └──────────────┘               │                   │
│                                 ▼                   │
│                    ┌────────────────────┐           │
│                    │   External APIs    │           │
│                    │  Groq  │  Gemini   │           │
│                    └────────────────────┘           │
│                                                     │
│  localStorage ──► Auto-save graph state             │
│  URL params   ──► Shared graph hydration            │
└─────────────────────────────────────────────────────┘
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- Free API keys from Groq and Google AI Studio

### 1. Clone the repo

```bash
git clone https://github.com/StreetCoder02/zeronode.git
cd zeronode
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxx
GEMINI_API_KEY=AIzaSyxxxxxxxxxxxxxxxxx
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Getting API Keys (both free)

| Service | Link | Starts With |
|---------|------|-------------|
| Groq | [console.groq.com](https://console.groq.com) | `gsk_` |
| Gemini | [aistudio.google.com](https://aistudio.google.com) | `AIzaSy` |

---

## How It Works

```
1. User types a topic
        │
        ▼
2. POST /api/generate-nodes
   └─► Groq LLaMA 3.1 streams 7 nodes as SSE
        │
        ▼
3. Nodes appear on canvas (staggered 150ms animation)
        │
        ▼
4. POST /api/embed-node (per node)
   └─► Gemini vectorizes title + description
        │
        ▼
5. Cosine similarity computed client-side
   └─► Nodes with >75% similarity auto-connected
        │
        ▼
6. Graph saved to localStorage (debounced 1.5s)
```

---

## Project Structure

```
zeronode/
├── app/
│   ├── api/
│   │   ├── generate-nodes/   # Groq SSE streaming
│   │   ├── embed-node/       # Gemini embeddings
│   │   ├── expand-node/      # AI node expansion
│   │   └── chat-graph/       # RAG chat
│   ├── app/                  # Canvas app (/app)
│   └── page.tsx              # Landing page (/)
├── components/
│   ├── zeronode/
│   │   ├── knowledge-graph.tsx   # Main canvas
│   │   ├── knowledge-node.tsx    # Node component
│   │   ├── graph-chat.tsx        # AI chat panel
│   │   ├── node-editor-panel.tsx # Node editor
│   │   ├── ai-generate-modal.tsx # Generation modal
│   │   ├── canvas-toolbar.tsx    # 5 tool buttons
│   │   ├── node-filter-bar.tsx   # Type filter
│   │   └── command-palette.tsx   # Cmd+K search
│   └── landing/              # Landing page components
├── lib/
│   ├── embeddings.ts         # Cosine similarity utils
│   └── share.ts              # Graph encode/decode
└── styles/
    └── globals.css
```

---

## Screenshots

> 📸 Screenshots coming soon — use the Export PNG button in the app to capture your own graph

---

## Roadmap

- [ ] Supabase persistent storage
- [ ] Auth with GitHub login
- [ ] Export to Markdown / PDF
- [ ] Mobile touch support
- [ ] Collaborative multi-user canvas
- [ ] Public graph gallery

---

## Contributing

Pull requests are welcome. For major changes, open an issue first.

```bash
git checkout -b feature/your-feature
git commit -m "feat: add your feature"
git push origin feature/your-feature
```

---

## License

MIT © 2026 [Aniruddha Pratap Singh](https://github.com/StreetCoder02)

---

<div align="center">

**Built with 🧠 by [StreetCoder02](https://github.com/StreetCoder02)**

[![GitHub](https://img.shields.io/badge/GitHub-StreetCoder02-181717?style=flat-square&logo=github)](https://github.com/StreetCoder02)
[![Live](https://img.shields.io/badge/Live-zero--node--jade.vercel.app-3B82F6?style=flat-square&logo=vercel)](https://zero-node-jade.vercel.app)

*If this project helped you, give it a ⭐ on GitHub*

</div>