import { $ } from './dom.js';
import { data, save } from './store.js';

// ---- tasks ----
export function renderTasks() {
  const list = $('list');
  list.innerHTML = '';
  if (!data.tasks.length) list.innerHTML = '<div class="empty">No tasks yet. Add one and click it to focus on it.</div>';
  for (const t of data.tasks) {
    const li = document.createElement('li');
    li.className = (t.done ? 'done ' : '') + (t.id === data.activeId ? 'active' : '');
    li.innerHTML = `<input type="checkbox" ${t.done ? 'checked' : ''}><span class="label"></span>
      <span class="count">${t.pomos ? '🍅×' + t.pomos : ''}</span><button class="del" title="Delete">×</button>`;
    li.querySelector('.label').textContent = t.text;
    li.onclick = e => {
      if (e.target.matches('input')) { t.done = e.target.checked; }
      else if (e.target.matches('.del')) {
        data.tasks = data.tasks.filter(x => x !== t);
        if (data.activeId === t.id) data.activeId = null;
      } else { data.activeId = data.activeId === t.id ? null : t.id; }
      save(); renderTasks();
    };
    list.appendChild(li);
  }
  const active = data.tasks.find(t => t.id === data.activeId);
  $('current').textContent = active ? active.text : 'Pick a task below';
}

$('form').onsubmit = e => {
  e.preventDefault();
  const text = $('newTask').value.trim();
  if (!text) return;
  const id = Date.now().toString(36);
  data.tasks.push({ id, text, done: false, pomos: 0 });
  if (!data.activeId) data.activeId = id;
  $('newTask').value = '';
  save(); renderTasks();
};
