// 待辦清單以此名稱儲存在瀏覽器的 localStorage。
const STORAGE_KEY = 'my-todo-list';

const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');
const emptyState = document.getElementById('empty-state');
const remainingCount = document.getElementById('remaining-count');

let todos = loadTodos();

// 讀取並檢查已儲存的資料，避免損壞的內容影響清單。
function loadTodos() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : [];

    if (!Array.isArray(parsed)) {
      throw new TypeError('待辦清單資料格式不正確。');
    }

    return parsed.filter((todo) =>
      todo &&
      typeof todo.id === 'string' &&
      typeof todo.text === 'string' &&
      typeof todo.completed === 'boolean'
    );
  } catch (error) {
    console.error('讀取待辦清單失敗，已改用空清單。', error);
    return [];
  }
}

// 將目前清單存回 localStorage，並在無法儲存時告知使用者。
function saveTodos() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch (error) {
    console.error('儲存待辦清單失敗。', error);
    window.alert('無法儲存待辦清單，請確認瀏覽器允許使用本機儲存空間。');
  }
}

// 依照目前資料更新待辦項目、空清單提示與未完成數量。
function render() {
  list.replaceChildren();

  todos.forEach((todo) => {
    const item = document.createElement('li');
    item.className = todo.completed ? 'todo-item completed' : 'todo-item';
    item.dataset.id = todo.id;

    const checkbox = document.createElement('input');
    checkbox.className = 'todo-checkbox';
    checkbox.type = 'checkbox';
    checkbox.checked = todo.completed;
    checkbox.setAttribute('aria-label', `標記「${todo.text}」為完成`);

    const text = document.createElement('span');
    text.className = 'todo-text';
    text.textContent = todo.text;

    const deleteButton = document.createElement('button');
    deleteButton.className = 'btn-delete';
    deleteButton.type = 'button';
    deleteButton.textContent = '×';
    deleteButton.setAttribute('aria-label', `刪除「${todo.text}」`);

    item.append(checkbox, text, deleteButton);
    list.append(item);
  });

  emptyState.hidden = todos.length > 0;
  remainingCount.textContent = `未完成:${todos.filter((todo) => !todo.completed).length} 項`;
}

// 新增一筆待辦，使用時間與隨機字串組成識別碼。
function addTodo(text) {
  todos.push({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    text,
    completed: false,
  });
  saveTodos();
  render();
}

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const text = input.value.trim();
  if (!text) return;

  addTodo(text);
  form.reset();
  input.focus();
});

list.addEventListener('change', (event) => {
  if (!event.target.matches('.todo-checkbox')) return;

  const item = event.target.closest('.todo-item');
  const todo = todos.find((entry) => entry.id === item.dataset.id);
  if (!todo) return;

  todo.completed = event.target.checked;
  saveTodos();
  render();
});

list.addEventListener('click', (event) => {
  if (!event.target.matches('.btn-delete')) return;

  const item = event.target.closest('.todo-item');
  todos = todos.filter((todo) => todo.id !== item.dataset.id);
  saveTodos();
  render();
});

render();
