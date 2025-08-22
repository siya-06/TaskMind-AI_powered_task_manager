


// src/aiService.js
export async function categorizeTask(task) {
  // Later: call OpenAI
  // For now, return dummy categories
  if (task.toLowerCase().includes("study")) return "Study";
  if (task.toLowerCase().includes("project")) return "Work";
  if (task.toLowerCase().includes("buy")) return "Personal";
  return "General";
}

export async function suggestTasks() {
  // Later: AI-generated suggestions
  return [
    "Review today's lecture notes",
    "Drink 2 liters of water",
    "Plan tasks for tomorrow"
  ];
}



