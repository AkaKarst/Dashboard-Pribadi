// --- DATA JADWAL KULIAH & PRAKTIKUM (SEMESTER 3) ---
const scheduleData = [
  { day: 'Senin', time: '07.30 - 09.10', name: 'Matematika Keuangan', room: 'Aula Prof', type: 'Matkul' },
  { day: 'Senin', time: '09.20 - 11.00', name: 'Anavey 1', room: 'Aula Prof', type: 'Matkul' },
  { day: 'Senin', time: '14.50 - 16.30', name: 'Metode Statistika A', room: 'Laplace', type: 'Matkul' },

  { day: 'Selasa', time: '09.10 - 10.40', name: 'Praktikum Nonparametrik', room: 'Lab Ebis (Kel. 1A)', asdos: 'Nasdia · Alnab', type: 'Praktikum' },
  { day: 'Selasa', time: '11.00 - 13.30', name: 'Praktikum Pengantar Data Sains', room: 'Lab Matdas (Kel. 1A)', asdos: 'Nuga · Yazid', type: 'Praktikum' },
  { day: 'Selasa', time: '14.50 - 17.00', name: 'Komputasi Statistika', room: 'Aula Prof', type: 'Matkul' },

  { day: 'Rabu', time: '07.30 - 09.10', name: 'Statistika Nonparametrik A', room: 'Laplace', type: 'Matkul' },
  { day: 'Rabu', time: '09.20 - 11.00', name: 'Metode Numerik Untuk Statistik AB', room: 'Aula Prof', type: 'Matkul' },
  { day: 'Rabu', time: '11.10 - 12.40', name: 'Praktikum Metode Statistika', room: 'Lab Statkom (Kel. 1A)', asdos: 'Kak Azalea · Bg Jizen', type: 'Praktikum' },
  { day: 'Rabu', time: '13.00 - 14.30', name: 'Praktikum Komputasi Statistika', room: 'Lab Matdas (Kel. 1A)', asdos: 'Adhim · Kak Yunda', type: 'Praktikum' },

  { day: 'Kamis', time: '09.20 - 11.50', name: 'Pengantar Statistika Matematika I A', room: 'Laplace', type: 'Matkul' },
  { day: 'Kamis', time: '12.00 - 13.30', name: 'Praktikum Metode Numerik', room: 'Lab Matdas (Kel. 2A)', asdos: 'Angga · Dhilah', type: 'Praktikum' },

  { day: 'Jumat', time: '07.30 - 09.10', name: 'Pengantar Data Sains', room: 'Laplace', type: 'Matkul' },
  { day: 'Jumat', time: '15.10 - 16.40', name: 'Praktikum Anavey', room: 'Lab Matkom (Kel. 1A)', asdos: 'Kak Pia · Kak Salsa', type: 'Praktikum' }
];

// --- APP STATE & LOCALSTORAGE ---
let tasks = JSON.parse(localStorage.getItem('dashboard_tasks')) || [];
let transactions = JSON.parse(localStorage.getItem('dashboard_finances')) || [];
let projects = JSON.parse(localStorage.getItem('dashboard_projects')) || [
  { id: 1, title: 'DataUdara Samarinda', desc: 'Visualisasi ISPUnet & IQAir' }
];
let activeDay = 'Senin';

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
  startClock();
  renderSchedule();
  renderTasks();
  renderFinances();
  renderProjects();
});

// --- CLOCK ---
function startClock() {
  setInterval(() => {
    const now = new Date();
    document.getElementById('live-clock').innerText = now.toLocaleTimeString('id-ID') + ' WITA';
  }, 1000);
}

// --- NAVIGATION ---
function switchTab(tabName) {
  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
  
  event.currentTarget.classList.add('active');
  document.getElementById(`sec-${tabName}`).classList.add('active');
}

// --- SCHEDULE RENDER ---
function filterDay(day) {
  activeDay = day;
  document.querySelectorAll('.day-btn').forEach(btn => {
    btn.classList.toggle('active', btn.innerText === day);
  });
  renderSchedule();
}

function renderSchedule() {
  const container = document.getElementById('schedule-container');
  const filtered = scheduleData.filter(item => item.day === activeDay);

  container.innerHTML = filtered.map(item => `
    <div class="sched-item ${item.type.toLowerCase()}">
      <div class="sched-time"><i class="fa-regular fa-clock"></i> ${item.time}</div>
      <div class="sched-title">${item.name}</div>
      <div class="sched-meta">
        <span><i class="fa-solid fa-location-dot"></i> ${item.room}</span>
        ${item.asdos ? `<span><i class="fa-solid fa-user-tie"></i> Asdos: ${item.asdos}</span>` : ''}
      </div>
    </div>
  `).join('');
}

// --- TASK MANAGEMENT ---
function handleAddTask(e) {
  e.preventDefault();
  const title = document.getElementById('task-title').value;
  const category = document.getElementById('task-category').value;
  const deadline = document.getElementById('task-deadline').value;

  tasks.push({ id: Date.now(), title, category, deadline });
  localStorage.setItem('dashboard_tasks', JSON.stringify(tasks));
  
  e.target.reset();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  localStorage.setItem('dashboard_tasks', JSON.stringify(tasks));
  renderTasks();
}

function renderTasks() {
  const container = document.getElementById('task-list-container');
  if(tasks.length === 0) {
    container.innerHTML = `<p style="color:var(--text-muted); font-size:0.9rem;">Belum ada tugas.</p>`;
    return;
  }

  container.innerHTML = tasks.map(t => {
    let badgeClass = 'badge-matkul';
    if(t.category === 'Praktikum / UAP') badgeClass = 'badge-prak';
    if(t.category === 'UTS / UAS') badgeClass = 'badge-ujian';

    return `
      <li class="task-item">
        <div>
          <span class="badge ${badgeClass}">${t.category}</span>
          <strong>${t.title}</strong>
          <div style="font-size:0.8rem; color:var(--text-muted); margin-top:4px;">
            Deadline: ${t.deadline}
          </div>
        </div>
        <button onclick="deleteTask(${t.id})" style="background:none; border:none; color:var(--danger); cursor:pointer;">
          <i class="fa-solid fa-trash"></i>
        </button>
      </li>
    `;
  }).join('');
}

// --- FINANCE MANAGEMENT ---
function handleAddTransaction(e) {
  e.preventDefault();
  const desc = document.getElementById('fin-desc').value;
  const amount = parseFloat(document.getElementById('fin-amount').value);
  const type = document.getElementById('fin-type').value;

  transactions.push({ id: Date.now(), desc, amount, type });
  localStorage.setItem('dashboard_finances', JSON.stringify(transactions));

  e.target.reset();
  renderFinances();
}

function renderFinances() {
  const container = document.getElementById('finance-list-container');
  let income = 0, expense = 0;

  transactions.forEach(t => {
    if(t.type === 'pemasukan') income += t.amount;
    else expense += t.amount;
  });

  document.getElementById('total-balance').innerText = `Rp ${(income - expense).toLocaleString('id-ID')}`;
  document.getElementById('total-income').innerText = `Rp ${income.toLocaleString('id-ID')}`;
  document.getElementById('total-expense').innerText = `Rp ${expense.toLocaleString('id-ID')}`;

  container.innerHTML = transactions.map(t => `
    <li class="fin-item">
      <span>${t.desc}</span>
      <strong style="color: ${t.type === 'pemasukan' ? 'var(--success)' : 'var(--danger)'}">
        ${t.type === 'pemasukan' ? '+' : '-'} Rp ${t.amount.toLocaleString('id-ID')}
      </strong>
    </li>
  `).join('');
}

// --- PROJECT MANAGEMENT ---
function handleAddProject(e) {
  e.preventDefault();
  const title = document.getElementById('proj-title').value;
  const desc = document.getElementById('proj-desc').value;

  projects.push({ id: Date.now(), title, desc });
  localStorage.setItem('dashboard_projects', JSON.stringify(projects));

  e.target.reset();
  renderProjects();
}

function renderProjects() {
  const container = document.getElementById('project-container');
  container.innerHTML = projects.map(p => `
    <div class="project-card">
      <h4><i class="fa-solid fa-folder"></i> ${p.title}</h4>
      <p style="font-size:0.85rem; color:var(--text-muted); margin-top:8px;">${p.desc}</p>
    </div>
  `).join('');
}