import express from "express";
import { askAI } from "../services/ai.service.js";

const router = express.Router();

router.post("/ask", async (req, res) => {
    const { query } = req.body;
    const userId = req.userid;

    const response = await askAI(query, userId);

    res.json({ response });
});

router.post("/query", async (req, res) => {
    const { query } = req.body;
    const userId = req.userid;

    const response = await askAI(query, userId);

    res.json({ response });
});


export default router;