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
<img width="1919" height="908" alt="Screenshot 2026-05-07 034604" src="https://github.com/user-attachments/assets/bc4aa118-2640-4a27-b63c-1db77cbc71d3" />
<img width="1607" height="906" alt="image" src="https://github.com/user-attachments/assets/82355334-e7cb-4a70-b548-105ae23c8b35" />
<img width="1919" height="876" alt="image" src="https://github.com/user-attachments/assets/e476b773-4870-444a-a72a-d8927da5055a" />
<img width="1606" height="888" alt="image" src="https://github.com/user-attachments/assets/3e07a183-6bd6-4771-9c8d-771026ff134a" />





