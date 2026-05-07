import express from "express";
import { askAI, categorizeTask, suggestTasks } from "../services/ai.service.js";
import prisma from '../prismaClient.js';

const router = express.Router();

router.post("/ask", async (req, res) => {
    const { query } = req.body;
    const userId = req.userid;

    if (!query || typeof query !== 'string') {
        return res.status(400).json({ error: "query is required and must be a string" });
    }

    const response = await askAI(query, userId);

    res.json({ response });
});

// 🔹 Categorize task
router.post("/categorize", async (req, res) => {
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
router.get("/suggest", async (req, res) => {
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