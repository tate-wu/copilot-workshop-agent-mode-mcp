// 待辦清單以此名稱儲存在瀏覽器的 localStorage。
const STORAGE_KEY = 'my-todo-list';

const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');
const emptyState = document.getElementById('empty-state');
const remainingCount = document.getElementById('remaining-count');
const clearCompletedButton = document.getElementById('clear-completed');
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const themeLabel = document.getElementById('theme-label');
const themeColor = document.querySelector('meta[name="theme-color"]');
const filterButtons = document.querySelectorAll('.filter-button');
const THEME_STORAGE_KEY = 'my-todo-theme';
const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');

let todos = loadTodos();
let activeFilter = 'all';
let selectedTheme = loadTheme();

// 取得使用者選擇的主題；沒有選擇時使用作業系統設定。
function loadTheme() {
  try {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    return savedTheme === 'light' || savedTheme === 'dark'
      ? savedTheme
      : (systemTheme.matches ? 'dark' : 'light');
  } catch (error) {
    console.error('讀取主題設定失敗，將使用作業系統設定。', error);
    return systemTheme.matches ? 'dark' : 'light';
  }
}

// 更新主題外觀與切換按鈕的提示文字。
function applyTheme(theme) {
  selectedTheme = theme;
  document.documentElement.dataset.theme = theme;
  const isDark = theme === 'dark';
  themeIcon.textContent = isDark ? '☀️' : '🌙';
  themeLabel.textContent = isDark ? '淺色模式' : '深色模式';
  themeToggle.setAttribute('aria-label', isDark ? '切換淺色模式' : '切換深色模式');
  themeColor.content = getComputedStyle(document.documentElement).getPropertyValue('--color-page').trim();
}

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

// 依照目前篩選條件更新清單，未完成數量則固定統計全部待辦。
function render() {
  list.replaceChildren();

  const visibleTodos = todos.filter((todo) => {
    if (activeFilter === 'active') return !todo.completed;
    if (activeFilter === 'completed') return todo.completed;
    return true;
  });

  visibleTodos.forEach((todo) => {
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

  emptyState.hidden = visibleTodos.length > 0;
  if (activeFilter === 'active') {
    emptyState.textContent = '沒有未完成的待辦事項。';
  } else if (activeFilter === 'completed') {
    emptyState.textContent = '還沒有已完成的待辦事項。';
  } else {
    emptyState.textContent = '還沒有任何待辦事項,新增一個吧!';
  }
  remainingCount.textContent = `未完成:${todos.filter((todo) => !todo.completed).length} 項`;
  clearCompletedButton.disabled = !todos.some((todo) => todo.completed);
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

themeToggle.addEventListener('click', () => {
  const nextTheme = selectedTheme === 'dark' ? 'light' : 'dark';
  applyTheme(nextTheme);

  try {
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
  } catch (error) {
    console.error('儲存主題設定失敗。', error);
    window.alert('無法儲存主題設定，請確認瀏覽器允許使用本機儲存空間。');
  }
});

// 尚未手動選擇主題時，作業系統設定變更會同步更新外觀。
systemTheme.addEventListener('change', (event) => {
  try {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme !== 'light' && savedTheme !== 'dark') {
      applyTheme(event.matches ? 'dark' : 'light');
    }
  } catch (error) {
    console.error('檢查主題設定失敗，將同步作業系統設定。', error);
    applyTheme(event.matches ? 'dark' : 'light');
  }
});

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    activeFilter = button.dataset.filter;
    filterButtons.forEach((filterButton) => {
      filterButton.setAttribute('aria-pressed', String(filterButton === button));
    });
    render();
  });
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

clearCompletedButton.addEventListener('click', () => {
  if (!todos.some((todo) => todo.completed)) return;
  if (!window.confirm('確定要清除所有已完成的待辦事項嗎？此操作無法復原。')) return;

  todos = todos.filter((todo) => !todo.completed);
  saveTodos();
  render();
});

applyTheme(selectedTheme);
render();
