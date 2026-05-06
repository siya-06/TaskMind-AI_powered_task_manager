import axios from "axios";

export const addTaskToVectorDB = async (task) => {
    await axios.post("http://localhost:8001/add", task);
};

export const queryVectorDB = async (query, userId) => {
    const res = await axios.post("http://localhost:8001/query", {
        query,
        userId
    });
    return res.data.results;
};