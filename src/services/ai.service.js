import { queryVectorDB } from "./embedding.service.js";
import Groq from "groq-sdk";

// Initialize Groq client
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const askAI = async (userQuery, userId) => {
    try {
        const tasks = await queryVectorDB(userQuery, userId);
        let contextText = "No specific tasks found related to this query.";

        if (tasks && tasks.length > 0) {
            contextText = tasks.map((t, i) => `${i + 1}. ${t.text}`).join("\n");
        }

        const prompt = `You are TaskMind AI, an intelligent task manager assistant.
The user is asking: "${userQuery}"

Here are their most relevant tasks pulled from their database based on their question:
${contextText}

Provide a helpful, conversational, and direct response. If they ask about their tasks, weave the tasks into your answer naturally. Keep it concise.`;

        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'llama-3.1-8b-instant',
        });

        return chatCompletion.choices[0]?.message?.content || "No response generated.";
    } catch (err) {
        console.error("Groq askAI error:", err);
        return "I'm having trouble connecting to my AI brain right now.";
    }
};

export async function categorizeTask(taskText, userId) {
    try {
        const prompt = `You are an AI that categorizes tasks. Categorize the following task into exactly one of these categories: Work, Study, Personal, Health, Finance, General.
Respond with ONLY the category name. Do not add any punctuation or extra text.
Task: "${taskText}"`;

        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'llama-3.1-8b-instant',
            temperature: 0.1,
        });

        let category = chatCompletion.choices[0]?.message?.content?.trim() || "General";
        
        const validCategories = ["Work", "Study", "Personal", "Health", "Finance", "General"];
        if (!validCategories.includes(category)) {
            category = validCategories.find(c => category.includes(c)) || "General";
        }

        return category;
    } catch (err) {
        console.error("categorizeTask error:", err);
        return "General";
    }
}

export async function suggestTasks(userTasks, userId) {
    try {
        const fallbacks = ["Plan your day", "Take a break", "Review tasks", "Check emails"];

        if (!userTasks || !userTasks.length) return fallbacks.slice(0, 3);

        const lastTask = userTasks[userTasks.length - 1];
        const lastTaskText = lastTask.task || lastTask.text;
        
        const tasks = await queryVectorDB(lastTaskText, userId);

        let suggestions = tasks && tasks.length ? [...new Set(tasks.map(r => r.text))] : [];
        
        // Remove the exact task they just entered to avoid suggesting exactly the same thing
        suggestions = suggestions.filter(s => s.toLowerCase() !== lastTaskText.toLowerCase());

        // Pad with fallbacks if we have fewer than 3 suggestions
        for (const fb of fallbacks) {
            if (suggestions.length >= 3) break;
            if (!suggestions.includes(fb)) suggestions.push(fb);
        }

        return suggestions.slice(0, 3);
    } catch (err) {
        console.error("suggestTasks error:", err);
        return ["Plan your day", "Take a break", "Review tasks"];
    }
}