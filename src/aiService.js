const AI_BASE = "http://localhost:8001";

// generic query function
async function queryAI(query, userId) {
  const res = await fetch(`${AI_BASE}/query`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, userId }),
  });

  if (!res.ok) throw new Error("AI request failed");

  return res.json();
}

// 🔹 categorize based on similar tasks
export async function categorizeTask(task, userId) {
  try {
    const data = await queryAI(task, userId);

    if (!data.results || data.results.length === 0) {
      return "General";
    }

    const similarText = data.results[0].text.toLowerCase();

    if (similarText.includes("study")) return "Study";
    if (similarText.includes("project")) return "Work";
    if (similarText.includes("buy")) return "Personal";

    return "General";
  } catch (err) {
    console.error(err);
    return "General";
  }
}

// 🔹 suggest tasks based on past tasks
export async function suggestTasks(userTasks, userId) {
  try {
    if (!userTasks.length) return [];

    const lastTask = userTasks[userTasks.length - 1];

    const data = await queryAI(lastTask.text, userId);

    const suggestions = data.results.map(r => r.text);

    return suggestions.slice(0, 3);
  } catch (err) {
    console.error(err);
    return [
      "Plan your day",
      "Take a break",
      "Review tasks"
    ];
  }
}