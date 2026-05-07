# 🧠 TaskMind — AI-Powered Semantic Task Manager

Okay so TaskMind started off as a normal productivity app idea… and then slowly turned into me going down the AI/RAG/vector-db rabbit hole 😭

Instead of building just another CRUD todo app, I wanted to make something that could actually understand tasks semantically and respond contextually based on what the user has worked on before.

So TaskMind is basically an AI-enhanced task manager that combines:

- a modern Node.js backend
- a Python AI microservice
- FAISS vector search
- LLM-powered contextual responses

All stitched together using a microservice-style architecture.

---

# ✨ Features

- 🔐 JWT-based Authentication
- ✅ Create / Update / Delete Tasks
- 🧠 AI-powered task suggestions
- 🔎 Semantic search using FAISS Vector DB
- 💬 Chat-style AI querying
- 📅 Calendar-based task visualization
- 🌙 Modern Dark Mode UI
- ⚡ Lightweight frontend with Vanilla JS

---

# 📸 Preview

## Dashboard UI

> <img width="1917" height="898" alt="image" src="https://github.com/user-attachments/assets/d6b54fd8-9e0e-4939-b641-d2cc528a27c7" />

```txt
[ PLACEHOLDER — MAIN DASHBOARD SCREENSHOT ]
```

---

## AI Chat Interface

> <img width="474" height="878" alt="image" src="https://github.com/user-attachments/assets/d54d5bfb-a726-45df-8f72-22834c97ba1a" />

```txt
[ PLACEHOLDER — AI CHAT SCREENSHOT ]
```

---

## Semantic Task Suggestions

> <img width="1094" height="199" alt="image" src="https://github.com/user-attachments/assets/e1c7e041-47ff-4a4f-a508-34b77e4edf91" />

```txt
[ PLACEHOLDER — AI SUGGESTIONS SCREENSHOT ]
```

---

## Calendar 

> <img width="1543" height="879" alt="image" src="https://github.com/user-attachments/assets/03dd5d6c-21e5-4742-952e-205ec9dc2cd5" />

```txt
[ PLACEHOLDER — AI SUGGESTIONS SCREENSHOT ]
```

---

## Analytics

> <img width="1451" height="907" alt="image" src="https://github.com/user-attachments/assets/7ae94129-e328-4e38-b8e1-63c7269586f2" />

```txt
[ PLACEHOLDER — AI SUGGESTIONS SCREENSHOT ]
```

---


# 🛠️ Tech Stack

# 🎨 Frontend

## HTML5 + CSS3 + Vanilla JavaScript

I intentionally skipped React/Vue for this project because I wanted the frontend to stay lightweight and fast without unnecessary complexity.

The UI uses:

- custom CSS variables
- glassmorphism-inspired styling
- dark mode support
- responsive layouts

and honestly vanilla JS was more than enough here.

---

## 📅 FullCalendar.js

Used for rendering tasks dynamically on a calendar view whenever a task has a due date attached.

---

## 🎯 FontAwesome

Used for scalable icons throughout the dashboard and chat UI.

---

# ⚙️ Primary Backend — Node.js / Express

## 🚀 Node.js + Express.js

This acts as the main backend gateway handling:

- authentication
- REST APIs
- task CRUD operations
- frontend serving
- communication with the AI microservice

I chose Express because it’s simple, scalable, and works really well for handling async API-heavy applications.

---

## 🗄️ Prisma ORM

Used Prisma for:

- schema management
- database querying
- type-safe operations
- cleaner backend logic

Honestly Prisma made database management WAY less painful.

---

## 🧾 PostgreSQL / SQLite

The project supports relational DB storage for:

- users
- tasks
- task metadata

Initially designed around PostgreSQL, but SQLite was later used during development/testing for faster local setup.

---

## 🔐 JWT Authentication

Authentication is handled using JSON Web Tokens.

After login:

- a JWT token is generated
- stored client-side
- attached to protected API routes via Authorization headers

---

# 🤖 AI Microservice — Python / FastAPI

This is where the fun stuff starts.

Instead of forcing AI logic into Node.js itself, I separated it into a dedicated Python microservice because Python’s AI ecosystem is honestly unbeatable.

---

## ⚡ FastAPI

FastAPI exposes lightweight endpoints for:

- embedding generation
- vector insertion
- semantic querying

and communicates with the Node backend over HTTP.

---

## 🧠 Sentence Transformers

Used HuggingFace sentence-transformers for converting tasks into dense vector embeddings.

The embedding model allows the system to understand:

- semantic similarity
- contextual meaning
- related task intent

instead of just matching keywords.

---

## 🔍 FAISS Vector Database

FAISS (Facebook AI Similarity Search) is used as the local vector store.

Whenever a task is created:

1. the task gets embedded into vector space
2. stored inside FAISS
3. indexed for semantic retrieval later

This powers the AI suggestion system.

---

## 💬 Groq + Llama 3

Groq’s ultra-fast inference API is used for contextual AI responses.

The workflow is:

- retrieve relevant tasks from FAISS
- inject them into prompt context
- send contextualized prompt to Llama 3
- generate personalized response

This essentially creates a lightweight Retrieval-Augmented Generation (RAG) pipeline.

---

# 🏗️ System Architecture

## High-Level Flow

```text
Frontend UI
     ↓
Node.js / Express Backend
     ↓
Python FastAPI AI Service
     ↓
FAISS Vector Database
     ↓
LLM Response Generation
```

---

## 📌 Architecture Diagram

> *(Insert Diagram Here)*

```txt
[ PLACEHOLDER — SYSTEM ARCHITECTURE DIAGRAM ]
```

---

# 🧠 How the AI Pipeline Works

## Step 1 — User Query

The user sends a prompt through the chat interface.

Example:

```text
“What should I focus on today?”
```

---

## Step 2 — Backend Processing

The Node.js backend:

- validates JWT
- extracts user context
- forwards query to the Python AI service

---

## Step 3 — Semantic Retrieval (RAG)

The Python service:

- converts the query into embeddings
- searches FAISS for similar tasks
- retrieves the most contextually relevant tasks

This is the Retrieval step in RAG.

---

## Step 4 — LLM Generation

The retrieved tasks are injected into the LLM prompt as context.

Groq + Llama 3 then generates a response based on:

- user query
- previous tasks
- semantic relevance

---

## Step 5 — Response Delivery

The generated response is returned back through:

- Python → Node.js → Frontend

and displayed inside the chat UI.

---

# 🚀 Engineering Highlights

Some parts of this project I’m genuinely proud of:

- Built a Node.js ↔ Python microservice architecture
- Implemented semantic task retrieval using FAISS
- Created a lightweight RAG pipeline
- Integrated vector embeddings + contextual retrieval
- Designed JWT-protected APIs
- Combined traditional backend engineering with AI workflows

---

# 📂 Project Structure

```bash
taskmind/
│
├── src/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   └── server.js
│
├── prisma/
│
├── ai-service/
│   ├── app.py
│   ├── embedding.py
│   ├── vector_store.py
│   └── faiss_index/
│
├── public/
│
└── README.md
```

---

# ⚙️ Running Locally

## 1️⃣ Clone Repo

```bash
git clone <your-repo-link>
cd taskmind
```

---

## 2️⃣ Install Backend Dependencies

```bash
npm install
```

---

## 3️⃣ Setup AI Service

```bash
cd ai-service
pip install -r requirements.txt
python -m uvicorn app:app --reload --port 8001
```

---

## 4️⃣ Start Backend

```bash
npm start
```

---

# 🚧 Future Improvements

Some things I still want to add:

- smarter task prioritization
- fully conversational AI assistant
- real-time notifications
- drag-and-drop task organization
- deployment + production scaling
- memory-based personalization

---

# 👤 Author

Built by Siya ✨

If you made it this far into the README, thank you genuinely 😭
<img width="1919" height="908" alt="Screenshot 2026-05-07 034604" src="https://github.com/user-attachments/assets/bc4aa118-2640-4a27-b63c-1db77cbc71d3" />
<img width="1607" height="906" alt="image" src="https://github.com/user-attachments/assets/82355334-e7cb-4a70-b548-105ae23c8b35" />
<img width="1919" height="876" alt="image" src="https://github.com/user-attachments/assets/e476b773-4870-444a-a72a-d8927da5055a" />
<img width="1606" height="888" alt="image" src="https://github.com/user-attachments/assets/3e07a183-6bd6-4771-9c8d-771026ff134a" />





