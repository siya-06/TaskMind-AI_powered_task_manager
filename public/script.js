const API_URL = window.location.origin.includes('5500') ? 'http://127.0.0.1:5003' : '';

// ================= DOM ELEMENTS =================
const authOverlay = document.getElementById('auth-overlay');
const registerOverlay = document.getElementById('register-overlay');
const appContainer = document.getElementById('app-container');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const logoutBtn = document.getElementById('logout-btn');
const displayUsername = document.getElementById('display-username');

const tasksList = document.getElementById('tasks-list');
const addTaskForm = document.getElementById('add-task-form');
const newTaskInput = document.getElementById('new-task-input');
const tasksLoading = document.getElementById('tasks-loading');
const tasksEmpty = document.getElementById('tasks-empty');

const aiSuggestBtn = document.getElementById('ai-suggest-btn');
const suggestionsContainer = document.getElementById('suggestions-container');
const suggestionsList = document.getElementById('suggestions-list');

const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const chatMessages = document.getElementById('chat-messages');

// Navigation Tabs
const navItems = document.querySelectorAll('.nav-item');
const viewPanels = document.querySelectorAll('.view-panel');

navItems.forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    const targetView = item.getAttribute('data-view');
    
    // Update active nav
    navItems.forEach(n => n.classList.remove('active'));
    item.classList.add('active');
    
    // Update active view
    viewPanels.forEach(panel => {
      if (panel.id === targetView) {
        panel.classList.remove('hidden');
      } else {
        panel.classList.add('hidden');
      }
    });

    if (targetView === 'view-calendar') {
      setTimeout(renderCalendar, 50);
    }
  });
});

// ================= STATE =================
let token = localStorage.getItem('token');
let currentUser = localStorage.getItem('username');

// ================= INIT =================
function init() {
  console.log("Token on load =", token);

  if (token) {
    showApp();
    fetchTodos();
  } else {
    showLogin();
  }
}

// ================= API HELPER =================
async function apiCall(endpoint, method = 'GET', body = null) {
  const headers = {
    'Content-Type': 'application/json'
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  console.log("API CALL:", endpoint, "TOKEN:", token);

  const response = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null
  });

  if (response.status === 401 || response.status === 403) {
    console.log("Auth failed → clearing token");
    localStorage.removeItem('token');
    token = null;
    showLogin();
    throw new Error('Unauthorized');
  }

  let data = {};
  try {
    data = await response.json();
  } catch { }

  if (!response.ok) {
    console.error("API ERROR:", data);
    throw new Error(data.error || 'API failed');
  }

  return data;
}

// ================= AUTH =================
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  try {
    const res = await apiCall('/auth/login', 'POST', { username, password });

    token = res.token;
    currentUser = username;

    localStorage.setItem('token', token);
    localStorage.setItem('username', username);

    console.log("Logged in. Token =", token);

    showApp();
    fetchTodos();
  } catch (err) {
    alert(err.message);
  }
});

registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('reg-username').value;
  const password = document.getElementById('reg-password').value;

  try {
    await apiCall('/auth/register', 'POST', { username, password });
    alert('Registered! Now login.');
    showLogin();
  } catch (err) {
    alert(err.message);
  }
});

// UI Toggles
const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
  themeToggle.addEventListener('change', (e) => {
    if (e.target.checked) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  });
  
  if (localStorage.getItem('theme') === 'dark') {
    themeToggle.checked = true;
    document.body.classList.add('dark-mode');
  }
}

document.getElementById('show-register').addEventListener('click', (e) => {
  e.preventDefault();
  showRegister();
});

document.getElementById('show-login').addEventListener('click', (e) => {
  e.preventDefault();
  showLogin();
});

if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    localStorage.clear();
    token = null;
    currentUser = null;
    showLogin();
  });
}
// ================= TODOS =================
async function fetchTodos() {
  tasksLoading.classList.remove('hidden');
  try {
    const todos = await apiCall('/todos');
    window.currentTodos = todos;
    renderTodos(todos);
    updateAnalytics(todos);
  } catch (err) {
    console.error("Fetch todos error:", err);
  } finally {
    tasksLoading.classList.add('hidden');
  }
}

function renderTodos(todos) {
  tasksList.innerHTML = '';

  // Update Analytics
  const statTotal = document.getElementById('stat-total');
  const statCompleted = document.getElementById('stat-completed');
  const statPending = document.getElementById('stat-pending');
  if (statTotal) statTotal.textContent = todos.length;
  if (statCompleted) statCompleted.textContent = todos.filter(t => t.completed).length;
  if (statPending) statPending.textContent = todos.filter(t => !t.completed).length;

  // Update Settings Profile
  const settingsUser = document.getElementById('settings-username');
  if (settingsUser && currentUser) settingsUser.textContent = currentUser;

  if (!todos.length) {
    tasksEmpty.classList.remove('hidden');
    return;
  }

  tasksEmpty.classList.add('hidden');

  todos.forEach(todo => {
    const li = document.createElement('li');
    li.className = `task-item ${todo.completed ? 'completed' : ''}`;

    li.innerHTML = `
      <div class="task-content">
        <div class="task-checkbox" onclick="toggleTask(${todo.id}, ${!todo.completed})">
          ${todo.completed ? '<i class="fa-solid fa-check"></i>' : ''}
        </div>
        <span class="task-text">${escapeHtml(todo.task)}</span>
        <span class="task-tag hidden" id="tag-${todo.id}"></span>
      </div>

      <div class="task-actions">
        <button class="action-btn" onclick="addToCalendar('${escapeHtml(todo.task).replace(/'/g, "\\'")}')" title="Add to Google Calendar">
          <i class="fa-regular fa-calendar-plus"></i>
        </button>
        <button class="action-btn" onclick="categorizeTask(${todo.id}, '${escapeHtml(todo.task).replace(/'/g, "\\'")}')" title="Categorize Task">
          <i class="fa-solid fa-tag"></i>
        </button>
        <button class="action-btn delete-btn" onclick="deleteTask(${todo.id})" title="Delete Task">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
    `;

    tasksList.appendChild(li);
  });
  
  if (document.getElementById('view-calendar') && !document.getElementById('view-calendar').classList.contains('hidden')) {
    setTimeout(renderCalendar, 10);
  }
}

let calendar = null;
function renderCalendar() {
  const calendarEl = document.getElementById('calendar');
  if (!calendarEl) return;

  const events = (window.currentTodos || [])
    .filter(t => t.dueDate)
    .map(t => ({
      id: t.id.toString(),
      title: t.task,
      start: t.dueDate.split('T')[0],
      allDay: true,
      color: t.completed ? '#10b981' : 'var(--accent)'
    }));

  if (!calendar) {
    calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'dayGridMonth',
      events: events,
      headerToolbar: { left: 'prev,next', center: 'title', right: 'today' },
      height: 'auto',
      eventClick: function(info) {
        if(confirm("Mark this task as completed?")) {
           toggleTask(parseInt(info.event.id), true);
        }
      }
    });
    calendar.render();
  } else {
    calendar.removeAllEvents();
    calendar.addEventSource(events);
  }
}

addTaskForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const task = newTaskInput.value.trim();
  const dateInput = document.getElementById('new-task-date');
  const dueDate = dateInput && dateInput.value ? new Date(dateInput.value).toISOString() : null;

  if (!task) return;

  try {
    await apiCall('/todos', 'POST', { task, dueDate });
    newTaskInput.value = '';
    if (dateInput) dateInput.value = '';
    fetchTodos();
  } catch (err) {
    alert(err.message);
  }
});

async function toggleTask(id, completed) {
  try {
    await apiCall(`/todos/${id}`, 'PUT', { completed });
    fetchTodos();
  } catch (err) {
    alert(err.message);
  }
}

async function deleteTask(id) {
  if (!confirm("Delete this task?")) return;

  try {
    await apiCall(`/todos/${id}`, 'DELETE');
    fetchTodos();
  } catch (err) {
    alert(err.message);
  }
}

window.addToCalendar = function(taskName) {
  const text = encodeURIComponent(taskName);
  const details = encodeURIComponent("Added from TaskMind AI");
  const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&details=${details}`;
  window.open(url, '_blank');
};

// ================= AI =================

// Categorize
async function categorizeTask(id, taskText) {
  const tagEl = document.getElementById(`tag-${id}`);

  if (tagEl) {
    tagEl.classList.remove('hidden');
    tagEl.textContent = '...';
  }

  try {
    const res = await apiCall('/api/ai/categorize', 'POST', {
      task: taskText
    });

    if (tagEl) {
      tagEl.textContent = res.tag;
    }
  } catch {
    if (tagEl) tagEl.classList.add('hidden');
  }
}

// Suggestions
aiSuggestBtn.addEventListener('click', async () => {
  try {
    const res = await apiCall('/api/ai/suggest');
    renderSuggestions(res.suggestions || []);
  } catch {
    alert("AI failed");
  }
});

function renderSuggestions(suggestions) {
  suggestionsContainer.classList.remove('hidden');
  suggestionsList.innerHTML = '';

  suggestions.forEach(s => {
    const btn = document.createElement('button');
    btn.textContent = '+ ' + s;

    btn.onclick = () => {
      newTaskInput.value = s;
    };

    suggestionsList.appendChild(btn);
  });
}

// ================= CHAT =================
chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const query = chatInput.value.trim();
  if (!query) return;

  appendMessage('user', query);
  chatInput.value = '';

  try {
    const res = await apiCall('/api/ai/query', 'POST', { query });

    appendMessage('ai', res.response || "No response");
  } catch {
    appendMessage('ai', "AI error");
  }
});

function appendMessage(sender, text) {
  const div = document.createElement('div');
  div.className = `message ${sender}-message`;
  div.innerHTML = `<div class="message-bubble">${text}</div>`;

  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// ================= UTILS =================
function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// ================= UI =================
function showLogin() {
  authOverlay.classList.remove('hidden');
  registerOverlay.classList.add('hidden');
  appContainer.classList.add('hidden');
}

function showRegister() {
  authOverlay.classList.add('hidden');
  registerOverlay.classList.remove('hidden');
  appContainer.classList.add('hidden');
}

function showApp() {
  authOverlay.classList.add('hidden');
  registerOverlay.classList.add('hidden');
  appContainer.classList.remove('hidden');

  if (currentUser) {
    displayUsername.textContent = currentUser;
  }
}

// ================= START =================
init();