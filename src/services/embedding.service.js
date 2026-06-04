import axios from "axios";

const AI_BASE = process.env.AI_SERVICE_URL || "http://127.0.0.1:8000";

export const addTaskToVectorDB = async (data) => {
    try {
        await axios.post(`${AI_BASE}/add`, data);
    } catch (err) {
        console.error("Vector DB Add Error:", err.message);
    }
};

export const queryVectorDB = async (query, userId) => {
    try {
        const res = await axios.post(`${AI_BASE}/query`, { query, userId }, { timeout: 3000 });
        return res.data.results || [];
    } catch (err) {
        console.error("Vector DB Query Error:", err.message);
        return [];
    }
};

export const deleteTaskFromVectorDB = async (text, userId) => {
    try {
        await axios.delete(`${AI_BASE}/delete`, { data: { text, userId } });
    } catch (err) {
        console.error("Vector DB Delete Error:", err.message);
    }
};