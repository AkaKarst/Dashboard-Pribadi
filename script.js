// ========================================================
// 1. KONFIGURASI FIREBASE PROYEK
// ========================================================
const firebaseConfig = {
  apiKey: "AIzaSyAf1ZHM80qKCzQ9bu4PpNldRuN_33koybo",
  authDomain: "dashboard-pribadi-162e1.firebaseapp.com",
  projectId: "dashboard-pribadi-162e1",
  storageBucket: "dashboard-pribadi-162e1.firebasestorage.app",
  messagingSenderId: "613130090634",
  appId: "1:613130090634:web:3f94dd9808f632ce72d573",
  measurementId: "G-TG82YKNQ2Q"
};

// Inisialisasi Firebase Compat
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Reference Path di Realtime Database
const tasksRef = db.ref("tasks");
const financeRef = db.ref("finance");
const projectsRef = db.ref("projects");

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

// State penampung data dari Firebase
let currentTasks = {};
let currentFinance = {};
let currentProjects = {};
let activeDay = 'Senin';

// ========================================================
// 2. LISTENERS REALTIME FIREBASE
// ========================================================
tasksRef.on('value', (snapshot) => {
  currentTasks = snapshot.val() || {};
  renderTasks();
});

financeRef.on('value', (snapshot) => {
  currentFinance = snapshot.val() || {};
  renderFinances();
});

projectsRef.on('value', (snapshot) => {
  currentProjects = snapshot.val() || {};
  renderProjects();
});

// ========================================================
// 3. NAVIGASI, JAM REAL-TIME WITA, & FILTER JADWAL
// ========================================================
window.switchTab = function(tabName) {
  const buttons = document.querySelectorAll('.nav-btn');
  buttons.forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
  
  const btnIndex = tabName === 'jadwal' ? 0 : tabName === 'keuangan' ? 1 : 2;
  if (buttons[btnIndex]) buttons[btnIndex].classList.add('active');

  const targetSec = document.getElementById(`sec-${tabName}`);
  if (targetSec) targetSec.classList.add('active');
};

function startClock() {
  const clockEl = document.getElementById('live-clock') || document.getElementById('clock');
  
  function updateTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    if (clockEl) {
      clockEl.innerText = `${hours}:${minutes}:${seconds} WITA`;
    }
  }

  // Jalankan langsung agar tidak ada jeda awal 00:00:00
  updateTime();
  setInterval(updateTime, 1000);
}

window.filterDay = function(dayName) {
  activeDay = dayName;
  
  // Sinkronisasi class active pada tombol hari
  document.querySelectorAll('.day-btn').forEach(btn => {
    const btnText = btn.innerText.trim().toLowerCase();
    const targetText = dayName.toLowerCase();
    btn.classList.toggle('active', btnText === targetText);
  });

  renderSchedule();
};

function renderSchedule() {
  const container = document.getElementById('schedule-container');
  if (!container) return;

  const filtered = scheduleData.filter(item => item.day.toLowerCase() === activeDay.toLowerCase());

  if (filtered.length === 0) {
    container.innerHTML = `<p style="color:var(--p3-yellow-accent); font-weight:800; font-style:italic;">TIDAK ADA JADWAL HARI INI.</p>`;
    return;
  }

  container.innerHTML = filtered.map(item => `
    <div class="sched-item ${item.type.toLowerCase() === 'praktikum' ? 'praktikum' : ''}">
      <div class="sched-time"><i class="fa-regular fa-clock"></i> ${item.time}</div>
      <div class="sched-title">${item.name}</div>
      <div class="sched-meta">
        <span><i class="fa-solid fa-location-dot"></i> ${item.room}</span>
        ${item.asdos ? `<span><i class="fa-solid fa-user-tie"></i> Asdos: ${item.asdos}</span>` : ''}
      </div>
    </div>
  `).join('');
}

// ========================================================
// 4. MANAJEMEN TUGAS
// ========================================================
window.handleAddTask = function(e) {
  e.preventDefault();
  const title = document.getElementById('task-title').value;
  const category = document.getElementById('task-category').value;
  const deadline = document.getElementById('task-deadline').value;

  tasksRef.push({
    title,
    category,
    deadline
  }).then(() => {
    e.target.reset();
  });
};

window.deleteTask = function(key) {
  db.ref(`tasks/${key}`).remove();
};

function renderTasks() {
  const container = document.getElementById('task-list-container');
  if (!container) return;

  const keys = Object.keys(currentTasks);
  if (keys.length === 0) {
    container.innerHTML = `<p style="color:var(--p3-white); font-weight:800;">Belum ada tugas tersimpan.</p>`;
    return;
  }

  container.innerHTML = keys.map(key => {
    const t = currentTasks[key];
    let badgeClass = 'badge-matkul';
    if (t.category === 'Praktikum / UAP') badgeClass = 'badge-prak';
    if (t.category === 'UTS / UAS') badgeClass = 'badge-ujian';

    return `
      <li class="task-item">
        <div>
          <span class="badge ${badgeClass}">${t.category}</span>
          <strong style="font-style: italic; font-size: 1rem;">${t.title}</strong>
          <div style="font-size: 0.8rem; color: var(--p3-yellow-accent); margin-top: 4px;">
            <i class="fa-regular fa-calendar-xmark"></i> Deadline: ${t.deadline}
          </div>
        </div>
        <button onclick="window.deleteTask('${key}')" style="background: transparent; border: none; color: var(--p3-red-accent); cursor: pointer; font-size: 1.1rem;">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </li>
    `;
  }).join('');
}

// ========================================================
// 5. MANAJEMEN KEUANGAN
// ========================================================
window.handleAddTransaction = function(e) {
  e.preventDefault();
  const desc = document.getElementById('fin-desc').value;
  const amount = parseFloat(document.getElementById('fin-amount').value);
  const type = document.getElementById('fin-type').value;

  financeRef.push({
    desc,
    amount,
    type,
    date: new Date().toLocaleDateString('id-ID')
  }).then(() => {
    e.target.reset();
  });
};

window.deleteFinance = function(key) {
  db.ref(`finance/${key}`).remove();
};

function renderFinances() {
  const container = document.getElementById('finance-list-container');
  let income = 0;
  let expense = 0;

  const keys = Object.keys(currentFinance);

  keys.forEach(key => {
    const t = currentFinance[key];
    if (t.type === 'pemasukan') income += t.amount;
    else expense += t.amount;
  });

  const totalBalance = income - expense;

  const elBalance = document.getElementById('total-balance');
  const elIncome = document.getElementById('total-income');
  const elExpense = document.getElementById('total-expense');

  if (elBalance) elBalance.innerText = `Rp ${totalBalance.toLocaleString('id-ID')}`;
  if (elIncome) elIncome.innerText = `Rp ${income.toLocaleString('id-ID')}`;
  if (elExpense) elExpense.innerText = `Rp ${expense.toLocaleString('id-ID')}`;

  if (!container) return;

  if (keys.length === 0) {
    container.innerHTML = `<li style="color: var(--p3-white); font-weight:800;">Belum ada riwayat transaksi.</li>`;
    return;
  }

  container.innerHTML = keys.map(key => {
    const t = currentFinance[key];
    const isInc = t.type === 'pemasukan';
    return `
      <li class="fin-item">
        <div>
          <strong style="font-style: italic;">${t.desc}</strong>
          <div style="font-size: 0.75rem; color: #ccc;">${t.date || ''}</div>
        </div>
        <div style="display: flex; align-items: center; gap: 12px;">
          <span style="font-weight: 900; font-style: italic; color: ${isInc ? '#00ff88' : 'var(--p3-red-accent)'};">
            ${isInc ? '+' : '-'} Rp ${t.amount.toLocaleString('id-ID')}
          </span>
          <button onclick="window.deleteFinance('${key}')" style="background: transparent; border: none; color: var(--p3-red-accent); cursor: pointer;">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      </li>
    `;
  }).join('');
}

// ========================================================
// 6. MANAJEMEN PROJECT HUB
// ========================================================
window.handleAddProject = function(e) {
  e.preventDefault();
  const title = document.getElementById('proj-title').value;
  const desc = document.getElementById('proj-desc').value;

  projectsRef.push({
    title,
    desc
  }).then(() => {
    e.target.reset();
  });
};

window.deleteProject = function(key) {
  db.ref(`projects/${key}`).remove();
};

function renderProjects() {
  const container = document.getElementById('project-container');
  if (!container) return;

  const keys = Object.keys(currentProjects);

  if (keys.length === 0) {
    container.innerHTML = `<p style="color: var(--p3-white); font-weight:800;">Belum ada project aktif.</p>`;
    return;
  }

  container.innerHTML = keys.map(key => {
    const p = currentProjects[key];
    return `
      <div class="project-card">
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <h4><i class="fa-solid fa-folder"></i> ${p.title}</h4>
          <button onclick="window.deleteProject('${key}')" style="background: transparent; border: none; color: var(--p3-red-accent); cursor: pointer;">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
        <p style="font-size:0.85rem; color:#ddd; margin-top:8px;">${p.desc}</p>
      </div>
    `;
  }).join('');
}

// ========================================================
// 7. INISIALISASI SAAT HALAMAN DIMUAT (DOM READY)
// ========================================================
document.addEventListener('DOMContentLoaded', () => {
  // 1. Jalankan Jam Real-time
  startClock();

  // 2. Pasang Event Listener pada Tombol Hari
  const dayButtons = document.querySelectorAll('.day-btn');
  dayButtons.forEach(button => {
    button.addEventListener('click', () => {
      const selectedDay = button.getAttribute('data-day') || button.innerText.trim();
      window.filterDay(selectedDay);
    });
  });

  // 3. Set Tampilan Awal ke Hari 'Senin'
  window.filterDay('Senin');
});
