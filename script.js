(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  // ===== AUTH CHECK =====
  const token = localStorage.getItem('sp_token');
  const user = JSON.parse(localStorage.getItem('sp_user') || 'null');

  if (!token || !user) {
    window.location.href = 'login.html';
    return;
  }

  const userNameEl = $('#userName');
  if (userNameEl) userNameEl.textContent = user.name;

  if (user.is_admin) {
    const adminLink = $('#adminLink');
    if (adminLink) adminLink.style.display = '';
  }

  window.logout = function() {
    localStorage.removeItem('sp_token');
    localStorage.removeItem('sp_user');
    window.location.href = 'login.html';
  };

  // ===== STATE =====
  const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:8000'
    : 'https://dev-organizado.onrender.com';
  let selectedStacks = JSON.parse(localStorage.getItem('sp_stacks') || '[]');
  let tasks = [];

  // ===== THEME =====
  const savedTheme = localStorage.getItem('sp_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);

  window.toggleTheme = function() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('sp_theme', next);
  };

  // ===== MOBILE MENU =====
  window.toggleMobileMenu = function() {
    const btn = $('#mobileMenuBtn');
    const menu = $('#mobileMenu');
    btn.classList.toggle('active');
    menu.classList.toggle('open');
  };

  window.closeMobileMenu = function() {
    $('#mobileMenuBtn').classList.remove('active');
    $('#mobileMenu').classList.remove('open');
  };

  // ===== SCROLL REVEAL =====
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  $$('.reveal').forEach(el => revealObserver.observe(el));

  // ===== STACK TABS =====
  $$('.filter').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('.filter').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const tab = btn.dataset.tab;
      $$('.scard').forEach(c => {
        c.classList.toggle('hide', c.dataset.category !== tab);
      });
    });
  });

  // ===== STACK SELECTION =====
  function renderPicked() {
    const list = $('#pickedList');
    const empty = $('.picked-empty');
    if (selectedStacks.length === 0) {
      list.innerHTML = '';
      if (empty) empty.style.display = '';
      return;
    }
    if (empty) empty.style.display = 'none';
    list.innerHTML = selectedStacks.map(s =>
      `<span class="pill">${s}<span class="x" data-stack="${s}">&times;</span></span>`
    ).join('');
    list.querySelectorAll('.x').forEach(x => {
      x.addEventListener('click', () => {
        toggleStack(x.dataset.stack);
      });
    });
    updateStackDropdown();
  }

  function toggleStack(name) {
    const idx = selectedStacks.indexOf(name);
    if (idx > -1) selectedStacks.splice(idx, 1);
    else selectedStacks.push(name);
    localStorage.setItem('sp_stacks', JSON.stringify(selectedStacks));
    syncCards();
    renderPicked();
    renderStats();
    renderProgress();
  }

  function syncCards() {
    $$('.scard').forEach(c => {
      c.classList.toggle('selected', selectedStacks.includes(c.dataset.stack));
    });
  }

  $$('.scard').forEach(c => {
    c.addEventListener('click', () => toggleStack(c.dataset.stack));
  });

  syncCards();
  renderPicked();

  // ===== STACK DROPDOWN =====
  function updateStackDropdown() {
    const sel = $('#taskStack');
    const val = sel.value;
    sel.innerHTML = '<option value="">Stack</option>';
    selectedStacks.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s;
      opt.textContent = s;
      sel.appendChild(opt);
    });
    sel.value = val;
  }
  updateStackDropdown();

  // ===== TASKS API =====
  const authHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  async function loadTasks() {
    try {
      const res = await fetch(`${API_URL}/api/tasks`, { headers: authHeaders });
      if (res.ok) {
        tasks = await res.json();
        renderBoard();
        renderStats();
        renderProgress();
      }
    } catch (e) {
      console.error('Erro ao carregar tarefas:', e);
    }
  }

  async function apiCreateTask(data) {
    try {
      const res = await fetch(`${API_URL}/api/tasks`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify(data)
      });
      if (res.ok) {
        const task = await res.json();
        tasks.push(task);
        renderBoard();
        renderStats();
        renderProgress();
      }
    } catch (e) {
      console.error('Erro ao criar tarefa:', e);
    }
  }

  async function apiDeleteTask(taskId) {
    try {
      await fetch(`${API_URL}/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: authHeaders
      });
    } catch (e) {
      console.error('Erro ao excluir tarefa:', e);
    }
  }

  async function apiUpdateTask(taskId, data) {
    try {
      await fetch(`${API_URL}/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: authHeaders,
        body: JSON.stringify(data)
      });
    } catch (e) {
      console.error('Erro ao atualizar tarefa:', e);
    }
  }

  function createCardEl(task) {
    const card = document.createElement('div');
    card.className = 'task-card';
    card.draggable = true;
    card.dataset.id = task.id;

    const pClass = task.priority === 'high' ? 'p-high' : task.priority === 'medium' ? 'p-medium' : 'p-low';
    const pLabel = task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Média' : 'Baixa';

    card.innerHTML = `
      <div class="tc-head">
        <span class="tc-title">${esc(task.title)}</span>
        <button class="tc-del" title="Excluir">&times;</button>
      </div>
      ${task.desc ? `<div class="tc-desc">${esc(task.desc)}</div>` : ''}
      <div class="tc-foot">
        <span class="tc-priority ${pClass}">${pLabel}</span>
        ${task.stack ? `<span class="tc-stack">${esc(task.stack)}</span>` : ''}
      </div>
    `;

    card.querySelector('.tc-del').addEventListener('click', () => {
      apiDeleteTask(task.id);
      tasks = tasks.filter(t => t.id !== task.id);
      renderBoard();
      renderStats();
      renderProgress();
    });

    card.addEventListener('dragstart', e => {
      card.classList.add('dragging');
      e.dataTransfer.setData('text/plain', task.id);
    });
    card.addEventListener('dragend', () => card.classList.remove('dragging'));

    return card;
  }

  function renderBoard() {
    ['todo', 'doing', 'done'].forEach(status => {
      const container = $(`#${status}`);
      container.innerHTML = '';
      const filtered = tasks.filter(t => t.status === status);
      filtered.forEach(t => container.appendChild(createCardEl(t)));
    });
    updateCounts();
  }

  function updateCounts() {
    $('#cTodo').textContent = tasks.filter(t => t.status === 'todo').length;
    $('#cDoing').textContent = tasks.filter(t => t.status === 'doing').length;
    $('#cDone').textContent = tasks.filter(t => t.status === 'done').length;
  }

  // ===== STATS =====
  function renderStats() {
    const total = tasks.length;
    const studying = tasks.filter(t => t.status === 'doing').length;
    const done = tasks.filter(t => t.status === 'done').length;
    const percent = total > 0 ? Math.round((done / total) * 100) : 0;

    animateNumber($('#statTotal'), total);
    animateNumber($('#statStudying'), studying);
    animateNumber($('#statDone'), done);
    $('#statPercent').textContent = percent + '%';
  }

  function animateNumber(el, target) {
    const current = parseInt(el.textContent) || 0;
    if (current === target) return;
    const diff = target - current;
    const steps = 12;
    let step = 0;
    const interval = setInterval(() => {
      step++;
      el.textContent = Math.round(current + (diff * step / steps));
      if (step >= steps) clearInterval(interval);
    }, 30);
  }

  // ===== PROGRESS PER STACK =====
  function renderProgress() {
    const container = $('#progressList');
    const stacksWithTasks = selectedStacks.filter(s => tasks.some(t => t.stack === s));

    if (stacksWithTasks.length === 0) {
      container.innerHTML = '<p class="progress-empty">Selecione stacks e crie tarefas para ver o progresso</p>';
      return;
    }

    container.innerHTML = stacksWithTasks.map(stack => {
      const stackTasks = tasks.filter(t => t.stack === stack);
      const done = stackTasks.filter(t => t.status === 'done').length;
      const total = stackTasks.length;
      const pct = total > 0 ? Math.round((done / total) * 100) : 0;
      const barClass = pct === 100 ? 'progress-bar complete' : 'progress-bar';

      return `
        <div class="progress-item">
          <span class="progress-item-name">${esc(stack)}</span>
          <div class="progress-bar-wrap">
            <div class="${barClass}" style="width:${pct}%"></div>
          </div>
          <span class="progress-item-count">${done}/${total}</span>
        </div>
      `;
    }).join('');
  }

  // ===== DRAG & DROP =====
  $$('.col-cards').forEach(zone => {
    zone.addEventListener('dragover', e => {
      e.preventDefault();
      zone.classList.add('drag-over');
    });
    zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
    zone.addEventListener('drop', e => {
      e.preventDefault();
      zone.classList.remove('drag-over');
      const id = parseInt(e.dataTransfer.getData('text/plain'));
      const newStatus = zone.id;
      const task = tasks.find(t => t.id === id);
      if (task) {
        task.status = newStatus;
        apiUpdateTask(task.id, { status: newStatus });
        renderBoard();
        renderStats();
        renderProgress();
      }
    });
  });

  // ===== MODAL =====
  const overlay = $('#overlay');
  const form = $('#taskForm');

  $$('.btn-new-card').forEach(btn => {
    btn.addEventListener('click', () => {
      $('#taskStatus').value = btn.dataset.status;
      updateStackDropdown();
      overlay.classList.add('open');
      setTimeout(() => $('#taskTitle').focus(), 100);
    });
  });

  $('#closeModal').addEventListener('click', () => overlay.classList.remove('open'));
  overlay.addEventListener('click', e => {
    if (e.target === overlay) overlay.classList.remove('open');
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const data = {
      title: $('#taskTitle').value.trim(),
      desc: $('#taskDesc').value.trim(),
      priority: $('#taskPriority').value,
      stack: $('#taskStack').value,
      status: $('#taskStatus').value
    };
    apiCreateTask(data);
    form.reset();
    overlay.classList.remove('open');
  });

  // ===== POMODORO =====
  let pomoInterval = null;
  let pomoTimeLeft = 25 * 60;
  let pomoTotalTime = 25 * 60;
  let pomoRunning = false;
  let pomoSessions = parseInt(localStorage.getItem('sp_pomo_sessions') || '0');
  const CIRCUMFERENCE = 2 * Math.PI * 90;

  $('#pomoSessions').textContent = pomoSessions;
  updatePomoDisplay();

  $$('.pomo-mode').forEach(btn => {
    btn.addEventListener('click', () => {
      if (pomoRunning) return;
      $$('.pomo-mode').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const mins = parseInt(btn.dataset.minutes);
      pomoTotalTime = mins * 60;
      pomoTimeLeft = pomoTotalTime;
      $('#pomoLabel').textContent = btn.dataset.label;
      updatePomoDisplay();
      updatePomoRing();
    });
  });

  window.togglePomodoro = function() {
    if (pomoRunning) {
      clearInterval(pomoInterval);
      pomoRunning = false;
      $('#pomoStart').classList.remove('running');
      $('#pomoBtnText').textContent = 'Continuar';
    } else {
      pomoRunning = true;
      $('#pomoStart').classList.add('running');
      $('#pomoBtnText').textContent = 'Pausar';
      pomoInterval = setInterval(() => {
        pomoTimeLeft--;
        updatePomoDisplay();
        updatePomoRing();
        if (pomoTimeLeft <= 0) {
          clearInterval(pomoInterval);
          pomoRunning = false;
          $('#pomoStart').classList.remove('running');
          $('#pomoBtnText').textContent = 'Iniciar';

          const activeMode = $('.pomo-mode.active');
          if (activeMode && activeMode.dataset.label === 'Foco') {
            pomoSessions++;
            localStorage.setItem('sp_pomo_sessions', pomoSessions);
            $('#pomoSessions').textContent = pomoSessions;
          }

          if (Notification.permission === 'granted') {
            new Notification('Pomodoro finalizado!', { body: 'Hora de fazer uma pausa.' });
          }

          pomoTimeLeft = pomoTotalTime;
          updatePomoDisplay();
          updatePomoRing();
        }
      }, 1000);
    }
  };

  window.resetPomodoro = function() {
    clearInterval(pomoInterval);
    pomoRunning = false;
    pomoTimeLeft = pomoTotalTime;
    $('#pomoStart').classList.remove('running');
    $('#pomoBtnText').textContent = 'Iniciar';
    updatePomoDisplay();
    updatePomoRing();
  };

  function updatePomoDisplay() {
    const m = Math.floor(pomoTimeLeft / 60);
    const s = pomoTimeLeft % 60;
    $('#pomoTime').textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  function updatePomoRing() {
    const progress = 1 - (pomoTimeLeft / pomoTotalTime);
    const offset = CIRCUMFERENCE * (1 - progress);
    $('#pomoProgress').style.strokeDasharray = CIRCUMFERENCE;
    $('#pomoProgress').style.strokeDashoffset = offset;
  }

  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }

  // ===== HELPERS =====
  function esc(str) {
    const d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
  }

  // ===== CHAT IA DEV =====
  const chatPanel = $('#chatPanel');
  const chatFab = $('#chatFab');
  const chatForm = $('#chatForm');
  const chatInput = $('#chatInput');
  const chatMessages = $('#chatMessages');
  let chatHistory = [];
  let iaPaid = user.ia_paid || false;
  let paymentCheckInterval = null;

  function showPaywall() {
    chatMessages.innerHTML = `
      <div class="paywall">
        <div class="paywall-icon">🤖</div>
        <h3>Desbloqueie a IA DEV</h3>
        <p>Tenha acesso ilimitado ao assistente de programação por apenas</p>
        <div class="paywall-price">R$ 5,00</div>
        <p class="paywall-sub">Pagamento único via PIX</p>
        <button class="paywall-btn" id="btnPay">Pagar com PIX</button>
        <div id="pixArea" style="display:none">
          <div id="pixLoading" class="paywall-loading">Gerando PIX...</div>
          <div id="pixQr" style="display:none">
            <img id="pixQrImg" class="paywall-qr" alt="QR Code PIX" />
            <p class="paywall-copy-label">Ou copie o código:</p>
            <div class="paywall-copy-row">
              <input id="pixCode" class="paywall-code" readonly />
              <button id="btnCopyPix" class="paywall-copy-btn">Copiar</button>
            </div>
            <p class="paywall-waiting">Aguardando pagamento...</p>
          </div>
        </div>
      </div>
    `;
    if (chatForm) chatForm.style.display = 'none';

    $('#btnPay').addEventListener('click', startPayment);
  }

  async function startPayment() {
    const pixArea = $('#pixArea');
    const pixLoading = $('#pixLoading');
    pixArea.style.display = '';
    pixLoading.style.display = '';
    $('#btnPay').disabled = true;
    $('#btnPay').textContent = 'Processando...';

    try {
      const res = await fetch(`${API_URL}/api/payment/create`, {
        method: 'POST',
        headers: authHeaders
      });
      const data = await res.json();

      if (!res.ok) {
        pixLoading.textContent = data.detail || 'Erro ao gerar pagamento';
        return;
      }

      pixLoading.style.display = 'none';
      const pixQr = $('#pixQr');
      pixQr.style.display = '';
      $('#pixQrImg').src = `data:image/png;base64,${data.pix_qr_code_base64}`;
      $('#pixCode').value = data.pix_qr_code;

      $('#btnCopyPix').addEventListener('click', () => {
        navigator.clipboard.writeText(data.pix_qr_code);
        $('#btnCopyPix').textContent = 'Copiado!';
        setTimeout(() => $('#btnCopyPix').textContent = 'Copiar', 2000);
      });

      paymentCheckInterval = setInterval(checkPayment, 5000);
    } catch (e) {
      pixLoading.textContent = 'Erro de conexão. Tente novamente.';
    }
  }

  async function checkPayment() {
    try {
      const res = await fetch(`${API_URL}/api/payment/check`, { headers: authHeaders });
      const data = await res.json();
      if (data.ia_paid) {
        clearInterval(paymentCheckInterval);
        iaPaid = true;
        user.ia_paid = true;
        localStorage.setItem('sp_user', JSON.stringify(user));
        chatMessages.innerHTML = '';
        if (chatForm) chatForm.style.display = '';
        addMessage('assistant', '🎉 <strong>IA DEV desbloqueada!</strong> Pode perguntar o que quiser sobre programação.');
      }
    } catch (e) {}
  }

  window.toggleChat = function() {
    chatPanel.classList.toggle('open');
    chatFab.classList.toggle('active');
    if (chatPanel.classList.contains('open')) {
      if (!iaPaid) {
        showPaywall();
      } else {
        setTimeout(() => chatInput.focus(), 200);
      }
    }
  };

  function addMessage(role, content) {
    const div = document.createElement('div');
    div.className = `msg msg-${role === 'user' ? 'user' : 'ai'}`;
    div.innerHTML = `<div class="msg-bubble">${content}</div>`;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function addTyping() {
    const div = document.createElement('div');
    div.className = 'msg msg-ai msg-typing';
    div.id = 'typingIndicator';
    div.innerHTML = `
      <div class="msg-bubble">
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
      </div>
    `;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function removeTyping() {
    const el = $('#typingIndicator');
    if (el) el.remove();
  }

  async function sendToAI(userMsg) {
    chatHistory.push({ role: 'user', content: userMsg });

    try {
      const res = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({ messages: chatHistory.slice(-10) })
      });

      const data = await res.json();
      removeTyping();

      if (!res.ok) {
        addMessage('assistant', `Erro: ${esc(data.detail || 'Erro desconhecido')}`);
        return;
      }

      const reply = data.reply;
      chatHistory.push({ role: 'assistant', content: reply });

      const formatted = reply
        .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
        .replace(/`([^`]+)`/g, '<code style="background:var(--code-bg);padding:2px 6px;border-radius:4px;font-size:.82em;font-family:JetBrains Mono,monospace">$1</code>')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br>');

      addMessage('assistant', formatted);
    } catch (err) {
      removeTyping();
      addMessage('assistant', 'Erro ao conectar com o servidor.');
    }
  }

  chatForm.addEventListener('submit', e => {
    e.preventDefault();
    if (!iaPaid) return;
    const msg = chatInput.value.trim();
    if (!msg) return;
    addMessage('user', esc(msg));
    chatInput.value = '';
    addTyping();
    sendToAI(msg);
  });

  // ===== INIT =====
  loadTasks();
  updatePomoRing();
})();
