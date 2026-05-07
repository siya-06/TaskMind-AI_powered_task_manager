import express from 'express';
import { addTaskToVectorDB, deleteTaskFromVectorDB } from "../services/embedding.service.js";
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

    const taskToDelete = await prisma.todo.findFirst({
      where: {
        id: parseInt(id),
        userid: req.userid
      }
    });

    if (!taskToDelete) {
      return res.status(404).json({ error: "Todo not found" });
    }

    await prisma.todo.deleteMany({
      where: {
        id: parseInt(id),
        userid: req.userid
      }
    });

    // Delete from FAISS vector store
    await deleteTaskFromVectorDB(taskToDelete.task, req.userid);

    res.json({ message: "Todo deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete todo" });
  }
});

// ================= AI ROUTES MOVED =================
// AI routes have been moved to src/routes/airoutes.js

export default router;