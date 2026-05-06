const API_URL = 'http://localhost:5003';

// DOM Elements
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

// State
let token = localStorage.getItem('token');
let currentUser = localStorage.getItem('username');

// Initialize
function init() {
  if (token) {
    showApp();
    fetchTodos();
  } else {
    showLogin();
  }
}

// UI State Management
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

document.getElementById('show-register').addEventListener('click', (e) => {
  e.preventDefault();
  showRegister();
});

document.getElementById('show-login').addEventListener('click', (e) => {
  e.preventDefault();
  showLogin();
});

logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  token = null;
  currentUser = null;
  showLogin();
});

// Fetch Helpers
async function apiCall(endpoint, method = 'GET', body = null) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const options = { method, headers };
  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_URL}${endpoint}`, options);
  
  if (response.status === 401 || response.status === 403) {
    localStorage.removeItem('token');
    token = null;
    showLogin();
    throw new Error('Unauthorized');
  }
  
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || 'API call failed');
  }

  return response.json();
}

// Auth Actions
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
    loginForm.reset();
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
    alert('Registration successful! Please log in.');
    showLogin();
  } catch (err) {
    alert(err.message);
  }
});

// Tasks Actions
async function fetchTodos() {
  tasksLoading.classList.remove('hidden');
  tasksList.innerHTML = '';
  tasksEmpty.classList.add('hidden');

  try {
    const todos = await apiCall('/todos');
    renderTodos(todos);
  } catch (err) {
    console.error(err);
  } finally {
    tasksLoading.classList.add('hidden');
  }
}

function renderTodos(todos) {
  tasksList.innerHTML = '';
  
  if (todos.length === 0) {
    tasksEmpty.classList.remove('hidden');
    return;
  }
  
  tasksEmpty.classList.add('hidden');

  todos.forEach(todo => {
    const li = document.createElement('li');
    li.className = `task-item ${todo.completed ? 'completed' : ''}`;
    li.dataset.id = todo.id;

    // Use a placeholder tag if none exists (since DB schema doesn't have tag, we store it in UI dynamically or just leave blank)
    const tagHtml = todo.tag ? `<span class="task-tag">${todo.tag}</span>` : `<span class="task-tag hidden" id="tag-${todo.id}"></span>`;

    li.innerHTML = `
      <div class="task-content">
        <div class="task-checkbox" onclick="toggleTask(${todo.id}, ${!todo.completed})">
          ${todo.completed ? '<i class="fa-solid fa-check"></i>' : ''}
        </div>
        <span class="task-text">${escapeHtml(todo.task)}</span>
        ${tagHtml}
      </div>
      <div class="task-actions">
        <button class="action-btn" onclick="categorizeTask(${todo.id}, '${escapeHtml(todo.task).replace(/'/g, "\\'")}')" title="Categorize with AI">
          <i class="fa-solid fa-tags"></i>
        </button>
        <button class="action-btn delete-btn" onclick="deleteTask(${todo.id})" title="Delete">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
    `;
    tasksList.appendChild(li);
  });
}

addTaskForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const taskText = newTaskInput.value.trim();
  if (!taskText) return;

  newTaskInput.disabled = true;
  try {
    await apiCall('/todos', 'POST', { task: taskText });
    newTaskInput.value = '';
    fetchTodos();
  } catch (err) {
    alert(err.message);
  } finally {
    newTaskInput.disabled = false;
    newTaskInput.focus();
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
  if (!confirm('Are you sure you want to delete this task?')) return;
  try {
    await apiCall(`/todos/${id}`, 'DELETE');
    fetchTodos();
  } catch (err) {
    alert(err.message);
  }
}

// AI Tasks Features
async function categorizeTask(id, taskText) {
  const tagEl = document.getElementById(`tag-${id}`);
  if (tagEl) {
    tagEl.classList.remove('hidden');
    tagEl.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i>';
  }
  
  try {
    const res = await apiCall('/todos/ai/categorize', 'POST', { task: taskText });
    if (tagEl && res.tag) {
      tagEl.textContent = res.tag;
    }
  } catch (err) {
    console.error(err);
    if (tagEl) tagEl.classList.add('hidden');
  }
}

aiSuggestBtn.addEventListener('click', async () => {
  aiSuggestBtn.disabled = true;
  aiSuggestBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Thinking...';
  
  try {
    const res = await apiCall('/todos/ai/suggest');
    renderSuggestions(res.suggestions || res.tasks || []);
  } catch (err) {
    console.error(err);
    alert('Failed to get suggestions');
  } finally {
    aiSuggestBtn.disabled = false;
    aiSuggestBtn.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles"></i> AI Suggest Tasks';
  }
});

function renderSuggestions(suggestions) {
  if (!suggestions || suggestions.length === 0) return;
  
  suggestionsContainer.classList.remove('hidden');
  suggestionsList.innerHTML = '';
  
  suggestions.forEach(suggestion => {
    const btn = document.createElement('button');
    btn.className = 'suggestion-chip';
    btn.textContent = '+ ' + suggestion;
    btn.onclick = () => {
      newTaskInput.value = suggestion;
      newTaskInput.focus();
    };
    suggestionsList.appendChild(btn);
  });
}

// AI Chat Feature
chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const query = chatInput.value.trim();
  if (!query) return;

  // Add user message
  appendMessage('user', query);
  chatInput.value = '';
  chatInput.disabled = true;

  // Add loading placeholder
  const loadingId = 'loading-' + Date.now();
  appendMessage('ai', '<i class="fa-solid fa-ellipsis fa-fade"></i>', loadingId);

  try {
    const res = await apiCall('/api/ai/query', 'POST', { query });
    
    // Remove loading and add response
    document.getElementById(loadingId)?.remove();
    appendMessage('ai', res.response || 'Sorry, I could not process that.');
  } catch (err) {
    document.getElementById(loadingId)?.remove();
    appendMessage('ai', 'Error connecting to AI service.');
  } finally {
    chatInput.disabled = false;
    chatInput.focus();
  }
});

function appendMessage(sender, text, id = null) {
  const msgDiv = document.createElement('div');
  msgDiv.className = `message ${sender}-message`;
  if (id) msgDiv.id = id;
  
  msgDiv.innerHTML = `
    <div class="message-bubble">
      ${sender === 'user' ? escapeHtml(text) : text}
    </div>
  `;
  
  chatMessages.appendChild(msgDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Utils
function escapeHtml(unsafe) {
  return unsafe
       .replace(/&/g, "&amp;")
       .replace(/</g, "&lt;")
       .replace(/>/g, "&gt;")
       .replace(/"/g, "&quot;")
       .replace(/'/g, "&#039;");
}

// Start app
init();
