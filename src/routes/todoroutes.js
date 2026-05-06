import express from 'express';
import { addTaskToVectorDB } from "../services/embedding.service.js";
import { categorizeTask, suggestTasks } from "../services/ai.service.js";
import prisma from '../prismaClient.js';

const router = express.Router();

// 🔹 GET all todos
router.get('/', async (req, res) => {
  try {
    const todos = await prisma.todo.findMany({
      where: { userid: req.userid },
      orderBy: { id: "desc" } // optional improvement
    });

    res.json(todos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch todos" });
  }
});

// 🔹 CREATE todo
router.post('/', async (req, res) => {
  try {
    const { task, dueDate } = req.body;

    const todo = await prisma.todo.create({
      data: {
        task,
        dueDate: dueDate ? new Date(dueDate) : null,
        userid: req.userid
      }
    });

    // add to FAISS
    await addTaskToVectorDB({
      text: task,
      userId: req.userid
    });

    res.json(todo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create todo" });
  }
});

// 🔹 UPDATE todo
router.put('/:id', async (req, res) => {
  try {
    const { completed } = req.body;
    const { id } = req.params;

    const updatedTodo = await prisma.todo.updateMany({
      where: {
        id: parseInt(id),
        userid: req.userid
      },
      data: {
        completed: !!completed
      }
    });

    res.json(updatedTodo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update todo" });
  }
});

// 🔹 DELETE todo
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.todo.deleteMany({
      where: {
        id: parseInt(id),
        userid: req.userid
      }
    });

    res.json({ message: "Todo deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete todo" });
  }
});

// ================= AI ROUTES =================

// 🔹 Categorize task
router.post("/ai/categorize", async (req, res) => {
  try {
    const { task } = req.body;

    const tag = await categorizeTask(task, req.userid);

    res.json({ tag });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI categorization failed" });
  }
});

// 🔹 Suggest tasks (based on user history)
router.get("/ai/suggest", async (req, res) => {
  try {
    const userTasks = await prisma.todo.findMany({
      where: { userid: req.userid },
      orderBy: { id: "asc" }
    });

    const suggestions = await suggestTasks(userTasks, req.userid);

    res.json({ suggestions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI suggestions failed" });
  }
});

export default router;