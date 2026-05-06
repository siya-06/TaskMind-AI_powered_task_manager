# 🧠 TaskMind – AI Powered Task Manager

An intelligent task manager that uses **FAISS-based vector search + Retrieval-Augmented Generation (RAG)** to provide smart task insights and suggestions.

---

## ✨ Features

- ✅ User authentication (JWT-based)
- ✅ Create, update, delete tasks
- 🧠 AI-powered task understanding
- 🔍 Semantic search using FAISS
- 🤖 Smart task suggestions based on context

---

## 🏗️ Architecture

Frontend → Node.js Backend → Python AI Service → FAISS Vector DB

- Node.js handles API, auth, and task management
- Python (FastAPI) handles embeddings + retrieval
- FAISS stores vector embeddings of tasks
- AI layer retrieves relevant tasks for queries

---

## ⚙️ Tech Stack

- Backend: Node.js, Express
- Database: Prisma ORM (SQLite)
- AI Service: FastAPI (Python)
- Vector DB: FAISS
- Embeddings: HuggingFace / OpenAI (configurable)

---

## 🧠 How AI Works (RAG)

1. Tasks are converted into embeddings
2. Stored in FAISS index
3. User query → converted to embedding
4. FAISS retrieves similar tasks
5. Response generated using retrieved context

---
npm install
npm start
<img width="1919" height="965" alt="image" src="https://github.com/user-attachments/assets/f33c8b53-1b8e-4b78-83f8-3df06757ac20" />
<img width="1919" height="892" alt="image" src="https://github.com/user-attachments/assets/4eaba77e-776d-42bf-b5be-3dc31c656fdd" />
<img width="1917" height="904" alt="image" src="https://github.com/user-attachments/assets/0fce6ca3-8c7e-4588-9a55-f77951a163d5" />


