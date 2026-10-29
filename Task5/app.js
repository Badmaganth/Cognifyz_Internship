// Task 5 - front end that uses the REST API with fetch()
'use strict';

const API = '/api/tasks';
const $ = id => document.getElementById(id);

const form = $('taskForm');
const list = $('taskList');
const statusLine = $('status');

/* ---------- API helper: one place for fetch + error handling ---------- */
async function api(url = API, options = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  if (res.status === 204) return null;                 // DELETE returns no body

  let body = null;
  try { body = await res.json(); } catch (e) { /* no JSON body */ }

  if (!res.ok) {
    const details = body && body.details ? ': ' + body.details.join(', ') : '';
    throw new Error((body && body.error ? body.error : 'Request failed (' + res.status + ')') + details);
  }
  return body;
}

function setStatus(text, bad = false) {
  statusLine.textContent = text;
  statusLine.classList.toggle('bad', bad);
}

/* ---------- READ: fetch and display ---------- */
let searchTimer;

async function loadTasks() {
  const params = new URLSearchParams();
  if ($('search').value.trim()) params.set('q', $('search').value.trim());
  if ($('statusFilter').value) params.set('status', $('statusFilter').value);

  setStatus('Loading...');
  try {
    const tasks = await api(API + (params.toString() ? '?' + params : ''));
    renderTasks(tasks);
    setStatus(tasks.length ? '' : 'No tasks match. Add one above.');
  } catch (err) {
    list.replaceChildren();
    setStatus('Could not load tasks: ' + err.message, true);
  }
}

function renderTasks(tasks) {
  $('count').textContent = '(' + tasks.length + ')';
  list.replaceChildren(...tasks.map(taskItem));
}

function taskItem(task) {
  const li = document.createElement('li');
  li.className = 'task ' + task.priority + (task.done ? ' done' : '');

  const check = document.createElement('input');
  check.type = 'checkbox';
  check.checked = task.done;
  check.setAttribute('aria-label', 'Mark "' + task.title + '" as done');
  check.addEventListener('change', () => toggleDone(task, check));

  const body = document.createElement('div');
  body.className = 'task-body';
  const title = document.createElement('strong');
  title.textContent = task.title;
  body.append(title);
  if (task.description) {
    const p = document.createElement('p');
    p.textContent = task.description;
    body.append(p);
  }
  const meta = document.createElement('div');
  meta.className = 'meta';
  meta.textContent = task.priority + ' priority - added ' + new Date(task.createdAt).toLocaleDateString();
  body.append(meta);

  const edit = document.createElement('button');
  edit.type = 'button'; edit.textContent = 'Edit';
  edit.addEventListener('click', () => startEdit(task));

  const del = document.createElement('button');
  del.type = 'button'; del.textContent = 'Delete'; del.className = 'del';
  del.addEventListener('click', () => removeTask(task));

  const actions = document.createElement('div');
  actions.className = 'actions';
  actions.append(edit, del);

  li.append(check, body, actions);
  return li;
}

/* ---------- CREATE and UPDATE ---------- */
form.addEventListener('submit', async event => {
  event.preventDefault();
  const id = $('taskId').value;
  const payload = {
    title: $('title').value.trim(),
    description: $('description').value.trim(),
    priority: $('priority').value
  };

  if (payload.title.length < 3) {
    $('formError').textContent = 'Give the task a title of at least 3 characters.';
    $('title').focus();
    return;
  }
  $('formError').textContent = '';
  $('saveBtn').disabled = true;

  try {
    if (id) await api(API + '/' + id, { method: 'PUT', body: JSON.stringify(payload) });
    else    await api(API, { method: 'POST', body: JSON.stringify(payload) });
    resetForm();
    await loadTasks();
  } catch (err) {
    $('formError').textContent = err.message;      // shows the server's validation message
  } finally {
    $('saveBtn').disabled = false;
  }
});

function startEdit(task) {
  $('taskId').value = task.id;
  $('title').value = task.title;
  $('description').value = task.description;
  $('priority').value = task.priority;
  $('formTitle').textContent = 'Edit task';
  $('saveBtn').textContent = 'Save changes';
  $('cancelBtn').classList.remove('hidden');
  $('formError').textContent = '';
  form.scrollIntoView({ behavior: 'smooth', block: 'center' });
  $('title').focus();
}

function resetForm() {
  form.reset();
  $('taskId').value = '';
  $('formTitle').textContent = 'Add a task';
  $('saveBtn').textContent = 'Add task';
  $('cancelBtn').classList.add('hidden');
  $('formError').textContent = '';
}
$('cancelBtn').addEventListener('click', resetForm);

/* ---------- PATCH: toggle done ---------- */
async function toggleDone(task, checkbox) {
  checkbox.disabled = true;
  try {
    await api(API + '/' + task.id, { method: 'PATCH', body: JSON.stringify({ done: checkbox.checked }) });
    await loadTasks();
  } catch (err) {
    checkbox.checked = !checkbox.checked;           // undo on failure
    setStatus('Could not update the task: ' + err.message, true);
  } finally {
    checkbox.disabled = false;
  }
}

/* ---------- DELETE ---------- */
async function removeTask(task) {
  if (!confirm('Delete "' + task.title + '"?')) return;
  try {
    await api(API + '/' + task.id, { method: 'DELETE' });
    if ($('taskId').value === String(task.id)) resetForm();
    await loadTasks();
  } catch (err) {
    setStatus('Could not delete the task: ' + err.message, true);
  }
}

/* ---------- filters ---------- */
$('search').addEventListener('input', () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(loadTasks, 250);          // wait until typing pauses
});
$('statusFilter').addEventListener('change', loadTasks);

loadTasks();
