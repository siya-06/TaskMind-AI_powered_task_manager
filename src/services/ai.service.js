import { queryVectorDB } from "./embedding.service.js";

export const askAI = async (userQuery, userId) => {
    const tasks = await queryVectorDB(userQuery, userId);

    if (!tasks.length) {
        return "You don't have any relevant tasks yet.";
    }

    const context = tasks.map((t, i) => `${i + 1}. ${t.text}`).join("\n");

    // smarter reasoning
    return `
Here are your most relevant tasks:

${context}

Suggestion:
Focus on the top 1–2 tasks first. Prioritize anything that is urgent or unfinished.
`;
};