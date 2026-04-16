const USERS = [
  { username: 'william', password: 'onda123', name: 'William', role: 'Administrador', permissions: ['all'] },
  { username: 'luise', password: 'luise123', name: 'Luise', role: 'Operacional', permissions: ['view', 'create', 'edit'] },
  { username: 'karem', password: 'karem123', name: 'Karem', role: 'Gestão', permissions: ['view', 'edit', 'reports'] },
];

const STORAGE_KEYS = {
  session: 'onda_session',
  records: 'onda_records',
};

const PROJECT_STATUS = {
  done: [
    'Tela de login com 3 usuários separados.',
    'Dashboard inicial com totais e resumos rápidos.',
    'Cadastro de novo registro com campos principais da rotina.',
    'Categorias de retorno: Falta, Pós-cirúrgico e Orçamento sem resposta.',
    'Filtros por texto, categoria, status e responsável.',
    'Atualização rápida de status dentro da lista de acompanhamentos.',
    'Exclusão de registro com confirmação antes de apagar.',
    'Tela de relatórios para acompanhamento da Karem.',
    'Salvamento local no navegador para testes rápidos.',
  ],
  missing: [
    'Banco de dados online para compartilhar entre computadores.',
    'Histórico detalhado de cada ação com data e hora.',
    'Campo de número de tentativas de contato.',
    'Botões específicos como Ligou, WhatsApp enviado, Remarcar e Aprovou orçamento.',
    'Relatórios por período, por veterinário e por atendente.',
    'Busca por telefone com máscara e validação melhor.',
    'Permissões mais refinadas por usuário.',
    'Backup/exportação dos registros.',
  ],
};

const defaultRecords = [
  {
    id: crypto.randomUUID(),
    tutor: 'Carla Mendes',
    pet: 'Thor',
    phone: '(51) 99999-1010',
    type: 'Falta',
    date: '2026-04-16',
    vet: 'Dra. Bruna',
    owner: 'Luise',
    status: 'Pendente',
    action: 'Ainda sem contato',
    notes: 'Cliente faltou na consulta de revisão.',
    createdAt: new Date().toISOString(),
  },
  {
    id: crypto.randomUUID(),
    tutor: 'Ricardo Alves',
    pet: 'Mel',
    phone: '(51) 98888-2233',
    type: 'Pós-cirúrgico',
    date: '2026-04-15',
    vet: 'Dr. Gustavo',
    owner: 'William',
    status: 'Em contato',
    action: 'WhatsApp enviado',
    notes: 'Cirurgia de castração. Confirmar apetite, medicação e ferida.',
    createdAt: new Date().toISOString(),
  },
  {
    id: crypto.randomUUID(),
    tutor: 'João Pereira',
    pet: 'Luna',
    phone: '(51) 97777-4455',
    type: 'Orçamento sem resposta',
    date: '2026-04-14',
    vet: 'Dra. Raquel',
    owner: 'Karem',
    status: 'Sem resposta',
    action: 'Ligação sem retorno',
    notes: 'Orçamento de limpeza dentária enviado.',
    createdAt: new Date().toISOString(),
  },
];

const state = {
  user: getSession(),
  view: 'dashboard',
  filters: { search: '', type: '', status: '', owner: '' },
};

function getRecords() {
  const saved = localStorage.getItem(STORAGE_KEYS.records);
  if (saved) return JSON.parse(saved);
  localStorage.setItem(STORAGE_KEYS.records, JSON.stringify(defaultRecords));
  return defaultRecords;
}

function saveRecords(records) {
  localStorage.setItem(STORAGE_KEYS.records, JSON.stringify(records));
}

function getSession() {
  const saved = localStorage.getItem(STORAGE_KEYS.session);
  return saved ? JSON.parse(saved) : null;
}

function setSession(user) {
  localStorage.setItem(STORAGE_KEYS.session, JSON.stringify(user));
  state.user = user;
}

function clearSession() {
  localStorage.removeItem(STORAGE_KEYS.session);
  state.user = null;
}

function formatType(type) {
  if (type === 'Pós-cirúrgico') return 'pos-cirurgico';
  if (type === 'Orçamento sem resposta') return 'orcamento';
  return 'falta';
}

function formatStatus(status) {
  const map = {
    'Pendente': 'pendente',
    'Em contato': 'contato',
    'Sem resposta': 'sem-resposta',
    'Resolvido': 'resolvido',
  };
  return map[status] || 'pendente';
}

function countBy(records, predicate) {
  return records.filter(predicate).length;
}

function filteredRecords() {
  const records = getRecords();
  return records.filter((record) => {
    const search = state.filters.search.toLowerCase();
    const matchesSearch = !search || [record.tutor, record.pet, record.phone, record.vet, record.notes]
      .join(' ')
      .toLowerCase()
      .includes(search);
    const matchesType = !state.filters.type || record.type === state.filters.type;
    const matchesStatus = !state.filters.status || record.status === state.filters.status;
    const matchesOwner = !state.filters.owner || record.owner === state.filters.owner;
    return matchesSearch && matchesType && matchesStatus && matchesOwner;
  });
}

function app() {
  const root = document.getElementById('app');
  root.innerHTML = state.user ? renderMain() : renderLogin();
  bindEvents();
}

function renderLogin() {
  return `
    <div class="app-shell login-screen">
      <div class="login-card">
        <div class="login-brand">
          <div class="brand-badge">● Clínica Onda Animal</div>
          <h1>Central de Retornos ONDA</h1>
          <p>Controle faltas, pós-cirúrgicos e orçamentos sem resposta em um só lugar. Cada contato fica registrado com responsável, status e observações.</p>

          <div class="feature-grid">
            <div class="feature-box">
              <strong>Faltas</strong>
              <span>Registre clientes que marcaram e não compareceram para retorno rápido.</span>
            </div>
            <div class="feature-box">
              <strong>Pós-cirúrgico</strong>
              <span>Acompanhe como o animal está após cirurgia e organize próximos passos.</span>
            </div>
            <div class="feature-box">
              <strong>Orçamentos</strong>
              <span>Controle quem recebeu proposta e ainda não respondeu.</span>
            </div>
            <div class="feature-box">
              <strong>Equipe</strong>
              <span>William, Luise e Karem com acesso individual e histórico das ações.</span>
            </div>
          </div>
        </div>

        <div class="login-form-wrap">
          <div class="login-panel">
            <h2>Entrar no sistema</h2>
            <p>Use seu usuário e senha para acessar os acompanhamentos da clínica.</p>
            <form id="loginForm">
              <div class="form-row">
                <label class="label">Usuário</label>
                <input name="username" placeholder="Digite seu usuário" required />
              </div>
              <div class="form-row">
                <label class="label">Senha</label>
                <input name="password" type="password" placeholder="Digite sua senha" required />
              </div>
              <button class="primary-btn" type="submit">Entrar</button>
            </form>
            <div class="helper-card">
              <strong style="display:block; margin-bottom:8px; color:white;">Primeira versão pronta para teste</strong>
              Depois vamos adaptar campos, filtros, tela e fluxo conforme a rotina real da clínica.
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderMain() {
  const records = getRecords();
  const visibleRecords = filteredRecords();
  const today = new Date().toLocaleDateString('pt-BR');

  return `
    <div class="main-layout">
      <aside class="sidebar">
        <div class="logo-card">
          <div class="brand-badge">● Sistema interno</div>
          <h2>Central de Retornos ONDA</h2>
          <p>Gestão de faltas, pós-cirúrgicos e orçamentos com controle por equipe.</p>
          <div class="role-tag">${state.user.role}</div>
        </div>

        <div class="nav">
          <button data-view="dashboard" class="${state.view === 'dashboard' ? 'active' : ''}">Dashboard</button>
          <button data-view="records" class="${state.view === 'records' ? 'active' : ''}">Acompanhamentos</button>
          <button data-view="new" class="${state.view === 'new' ? 'active' : ''}">Novo registro</button>
          <button data-view="reports" class="${state.view === 'reports' ? 'active' : ''}">Relatórios</button>
        </div>

        <div class="sidebar-footer">
          <small>Usuário logado</small>
          <strong>${state.user.name}</strong>
          <div style="height:10px"></div>
          <button class="logout-btn" id="logoutBtn">Sair</button>
        </div>
      </aside>

      <main class="content">
        <div class="topbar">
          <div>
            <h1>${pageTitle()}</h1>
            <p>${pageSubtitle()} • ${today}</p>
          </div>
          <div class="user-chip">
            <strong>${state.user.name}</strong>
            <span>${state.user.role} • Clínica Onda Animal</span>
          </div>
        </div>

        ${state.view === 'dashboard' ? renderDashboard(records) : ''}
        ${state.view === 'records' ? renderRecords(visibleRecords) : ''}
        ${state.view === 'new' ? renderNewForm() : ''}
        ${state.view === 'reports' ? renderReports(records) : ''}
      </main>
    </div>
  `;
}

function renderDashboard(records) {
  return `
    <div class="stats-grid">
      <div class="stat-card"><span>Total de acompanhamentos</span><strong>${records.length}</strong></div>
      <div class="stat-card"><span>Pendentes</span><strong>${countBy(records, r => r.status === 'Pendente')}</strong></div>
      <div class="stat-card"><span>Sem resposta</span><strong>${countBy(records, r => r.status === 'Sem resposta')}</strong></div>
      <div class="stat-card"><span>Resolvidos</span><strong>${countBy(records, r => r.status === 'Resolvido')}</strong></div>
    </div>

    <div class="panel-grid">
      <section class="card">
        <h3>Últimos acompanhamentos</h3>
        ${renderRecordsTable(records.slice().reverse().slice(0, 6), false)}
      </section>
      <section class="card">
        <h3>Resumo rápido</h3>
        <div class="meta-list">
          <div class="meta-item">
            <strong>Faltas pendentes</strong>
            <span>${countBy(records, r => r.type === 'Falta' && r.status !== 'Resolvido')} registros aguardando retorno.</span>
          </div>
          <div class="meta-item">
            <strong>Pós-cirúrgicos ativos</strong>
            <span>${countBy(records, r => r.type === 'Pós-cirúrgico' && r.status !== 'Resolvido')} pets precisam de acompanhamento.</span>
          </div>
          <div class="meta-item">
            <strong>Orçamentos em aberto</strong>
            <span>${countBy(records, r => r.type === 'Orçamento sem resposta' && r.status !== 'Resolvido')} clientes sem resposta até agora.</span>
          </div>
        </div>
      </section>
    </div>
  `;
}

function renderRecords(records) {
  return `
    <section class="card">
      <h3>Lista de acompanhamentos</h3>
      <div class="filters">
        <input id="searchFilter" value="${state.filters.search}" placeholder="Buscar por tutor, pet, telefone, veterinário ou observação" />
        <select id="typeFilter">
          <option value="">Todos os tipos</option>
          <option ${state.filters.type === 'Falta' ? 'selected' : ''}>Falta</option>
          <option ${state.filters.type === 'Pós-cirúrgico' ? 'selected' : ''}>Pós-cirúrgico</option>
          <option ${state.filters.type === 'Orçamento sem resposta' ? 'selected' : ''}>Orçamento sem resposta</option>
        </select>
        <select id="statusFilter">
          <option value="">Todos os status</option>
          <option ${state.filters.status === 'Pendente' ? 'selected' : ''}>Pendente</option>
          <option ${state.filters.status === 'Em contato' ? 'selected' : ''}>Em contato</option>
          <option ${state.filters.status === 'Sem resposta' ? 'selected' : ''}>Sem resposta</option>
          <option ${state.filters.status === 'Resolvido' ? 'selected' : ''}>Resolvido</option>
        </select>
        <select id="ownerFilter">
          <option value="">Todos os responsáveis</option>
          ${USERS.map(user => `<option ${state.filters.owner === user.name ? 'selected' : ''}>${user.name}</option>`).join('')}
        </select>
        <button id="clearFilters" class="secondary-btn">Limpar</button>
      </div>
      ${renderRecordsTable(records, true)}
    </section>
  `;
}

function renderRecordsTable(records, allowActions) {
  if (!records.length) {
    return `<div class="empty-state">Nenhum registro encontrado com os filtros atuais.</div>`;
  }

  return `
    <div style="overflow:auto;">
      <table class="records-table">
        <thead>
          <tr>
            <th>Tutor / Pet</th>
            <th>Categoria</th>
            <th>Data</th>
            <th>Veterinário</th>
            <th>Responsável</th>
            <th>Status</th>
            <th>Última ação</th>
            ${allowActions ? '<th>Ações</th>' : ''}
          </tr>
        </thead>
        <tbody>
          ${records.map(record => `
            <tr>
              <td>
                <strong>${record.tutor}</strong><br>
                ${record.pet}<br>
                <span class="note">${record.phone}</span>
              </td>
              <td>
                <span class="badge ${formatType(record.type)}">${record.type}</span>
              </td>
              <td>${new Date(record.date + 'T12:00:00').toLocaleDateString('pt-BR')}</td>
              <td>${record.vet || '-'}</td>
              <td>${record.owner}</td>
              <td><span class="badge ${formatStatus(record.status)}">${record.status}</span></td>
              <td>
                <strong>${record.action}</strong><br>
                <span class="note">${record.notes || 'Sem observações.'}</span>
              </td>
              ${allowActions ? `
                <td>
                  <div class="inline-actions">
                    <button class="mini-btn success" data-action="resolve" data-id="${record.id}">Resolver</button>
                    <button class="mini-btn warn" data-action="contact" data-id="${record.id}">Em contato</button>
                    <button class="mini-btn danger" data-action="noanswer" data-id="${record.id}">Sem resposta</button>
                    <button class="mini-btn delete" data-delete-id="${record.id}">Excluir</button>
                  </div>
                </td>
              ` : ''}
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function renderNewForm() {
  return `
    <section class="card">
      <h3>Novo registro</h3>
      <form id="recordForm">
        <div class="form-grid">
          <div>
            <label class="label">Nome do tutor</label>
            <input name="tutor" required placeholder="Ex.: Carla Mendes" />
          </div>
          <div>
            <label class="label">Nome do pet</label>
            <input name="pet" required placeholder="Ex.: Thor" />
          </div>
          <div>
            <label class="label">Telefone</label>
            <input name="phone" required placeholder="(51) 99999-9999" />
          </div>
          <div>
            <label class="label">Categoria</label>
            <select name="type" required>
              <option value="">Selecione</option>
              <option>Falta</option>
              <option>Pós-cirúrgico</option>
              <option>Orçamento sem resposta</option>
            </select>
          </div>
          <div>
            <label class="label">Data do caso</label>
            <input name="date" type="date" required />
          </div>
          <div>
            <label class="label">Veterinário</label>
            <input name="vet" placeholder="Ex.: Dra. Bruna" />
          </div>
          <div>
            <label class="label">Responsável</label>
            <select name="owner" required>
              ${USERS.map(user => `<option ${user.name === state.user.name ? 'selected' : ''}>${user.name}</option>`).join('')}
            </select>
          </div>
          <div>
            <label class="label">Status inicial</label>
            <select name="status" required>
              <option>Pendente</option>
              <option>Em contato</option>
              <option>Sem resposta</option>
              <option>Resolvido</option>
            </select>
          </div>
          <div class="full">
            <label class="label">Última ação</label>
            <input name="action" required placeholder="Ex.: Ligação realizada / WhatsApp enviado / Cliente faltou" />
          </div>
          <div class="full">
            <label class="label">Observações</label>
            <textarea name="notes" placeholder="Detalhes úteis para o próximo contato..."></textarea>
          </div>
        </div>
        <div style="height:16px"></div>
        <button class="primary-btn" type="submit">Salvar registro</button>
      </form>
    </section>
  `;
}

function renderReports(records) {
  return `
    <section class="card">
      <h3>Painel de acompanhamento da Karem</h3>
      <p class="note">Resumo da versão atual para conferência: o que já foi entregue e o que ainda está pendente para próximas melhorias.</p>
      <div class="info-strip">
        <div class="strip-box">
          <strong>${countBy(records, r => r.owner === 'Luise')}</strong>
          <span>Registros com Luise</span>
        </div>
        <div class="strip-box">
          <strong>${countBy(records, r => r.owner === 'William')}</strong>
          <span>Registros com William</span>
        </div>
        <div class="strip-box">
          <strong>${countBy(records, r => r.owner === 'Karem')}</strong>
          <span>Registros com Karem</span>
        </div>
      </div>
      <div style="height:18px"></div>
      <div class="report-grid">
        <div class="meta-item status-panel done-panel">
          <strong>O que já foi feito</strong>
          <ul class="status-list">
            ${PROJECT_STATUS.done.map(item => `<li>${item}</li>`).join('')}
          </ul>
        </div>
        <div class="meta-item status-panel pending-panel">
          <strong>O que ainda está faltando</strong>
          <ul class="status-list">
            ${PROJECT_STATUS.missing.map(item => `<li>${item}</li>`).join('')}
          </ul>
        </div>
      </div>
      <div style="height:18px"></div>
      <div class="meta-list">
        ${USERS.map(user => `
          <div class="meta-item">
            <strong>${user.name}</strong>
            <span>${user.role}. Ativos: ${countBy(records, r => r.owner === user.name && r.status !== 'Resolvido')} • Resolvidos: ${countBy(records, r => r.owner === user.name && r.status === 'Resolvido')}</span>
          </div>
        `).join('')}
      </div>
    </section>
  `;
}

function pageTitle() {
  const map = {
    dashboard: 'Dashboard',
    records: 'Acompanhamentos',
    new: 'Novo registro',
    reports: 'Relatórios',
  };
  return map[state.view];
}

function pageSubtitle() {
  const map = {
    dashboard: 'Visão geral da operação',
    records: 'Filtros e acompanhamento da equipe',
    new: 'Cadastro rápido de um novo caso',
    reports: 'Resumo da versão e andamento do sistema',
  };
  return map[state.view];
}

function bindEvents() {
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const form = new FormData(loginForm);
      const username = String(form.get('username')).trim().toLowerCase();
      const password = String(form.get('password')).trim();
      const user = USERS.find(u => u.username === username && u.password === password);
      if (!user) {
        alert('Usuário ou senha inválidos.');
        return;
      }
      setSession(user);
      app();
    });
  }

  document.querySelectorAll('[data-view]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.view = btn.dataset.view;
      app();
    });
  });

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      clearSession();
      state.view = 'dashboard';
      app();
    });
  }

  const recordForm = document.getElementById('recordForm');
  if (recordForm) {
    recordForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const form = new FormData(recordForm);
      const newRecord = {
        id: crypto.randomUUID(),
        tutor: form.get('tutor'),
        pet: form.get('pet'),
        phone: form.get('phone'),
        type: form.get('type'),
        date: form.get('date'),
        vet: form.get('vet'),
        owner: form.get('owner'),
        status: form.get('status'),
        action: form.get('action'),
        notes: form.get('notes'),
        createdAt: new Date().toISOString(),
      };
      const records = getRecords();
      records.push(newRecord);
      saveRecords(records);
      alert('Registro salvo com sucesso.');
      state.view = 'records';
      app();
    });
  }

  const searchFilter = document.getElementById('searchFilter');
  if (searchFilter) {
    searchFilter.addEventListener('input', (e) => {
      state.filters.search = e.target.value;
      app();
    });
  }

  ['typeFilter', 'statusFilter', 'ownerFilter'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('change', (e) => {
        const key = id.replace('Filter', '');
        state.filters[key] = e.target.value;
        app();
      });
    }
  });

  const clearFilters = document.getElementById('clearFilters');
  if (clearFilters) {
    clearFilters.addEventListener('click', () => {
      state.filters = { search: '', type: '', status: '', owner: '' };
      app();
    });
  }

  document.querySelectorAll('[data-action]').forEach(btn => {
    btn.addEventListener('click', () => quickUpdate(btn.dataset.id, btn.dataset.action));
  });

  document.querySelectorAll('[data-delete-id]').forEach(btn => {
    btn.addEventListener('click', () => deleteRecord(btn.dataset.deleteId));
  });
}

function quickUpdate(id, actionType) {
  const records = getRecords();
  const record = records.find(r => r.id === id);
  if (!record) return;

  const map = {
    resolve: { status: 'Resolvido', action: `Resolvido por ${state.user.name}` },
    contact: { status: 'Em contato', action: `Contato atualizado por ${state.user.name}` },
    noanswer: { status: 'Sem resposta', action: `Tentativa sem resposta por ${state.user.name}` },
  };

  record.status = map[actionType].status;
  record.action = map[actionType].action;
  saveRecords(records);
  app();
}

function deleteRecord(id) {
  const records = getRecords();
  const record = records.find(r => r.id === id);
  if (!record) return;

  const confirmed = window.confirm(`Deseja realmente excluir o registro de ${record.tutor} / ${record.pet}?`);
  if (!confirmed) return;

  const updated = records.filter(r => r.id !== id);
  saveRecords(updated);
  app();
}

app();
