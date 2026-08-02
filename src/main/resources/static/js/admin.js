// Techzyncmedia Admin Dashboard JS Logic

const AUTH_KEY = 'techzync_admin_token';
const USER_KEY = 'techzync_admin_user';

let currentLeadsData = [];
let currentMessagesData = [];

document.addEventListener('DOMContentLoaded', () => {
  checkAuthStatus();
  initLoginForm();
  initTabNavigation();
});

function getToken() {
  return localStorage.getItem(AUTH_KEY);
}

function checkAuthStatus() {
  const token = getToken();
  const loginOverlay = document.getElementById('loginOverlay');
  const adminMain = document.getElementById('adminApp');
  const userDisplay = document.getElementById('adminUserDisplay');

  if (!token) {
    if (loginOverlay) loginOverlay.style.display = 'flex';
    if (adminMain) adminMain.style.display = 'none';
  } else {
    if (loginOverlay) loginOverlay.style.display = 'none';
    if (adminMain) adminMain.style.display = 'flex';
    const user = JSON.parse(localStorage.getItem(USER_KEY) || '{}');
    if (userDisplay) userDisplay.textContent = user.username || 'Admin';
    
    // Load dashboard data
    loadDashboardStats();
    loadLeads();
    loadMessages();
  }
}

function initLoginForm() {
  const loginForm = document.getElementById('loginForm');
  if (!loginForm) return;

  const errorToast = document.getElementById('loginErrorToast');

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const usernameOrEmail = document.getElementById('loginUsername')?.value.trim();
    const password = document.getElementById('loginPassword')?.value;

    if (!usernameOrEmail || !password) {
      showError(errorToast, 'Please enter username and password');
      return;
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usernameOrEmail, password })
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const data = await response.json();
      localStorage.setItem(AUTH_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify({ username: data.username, email: data.email, role: data.role }));
      
      checkAuthStatus();
    } catch (err) {
      showError(errorToast, 'Login failed: Invalid credentials');
    }
  });
}

function logout() {
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem(USER_KEY);
  checkAuthStatus();
}

function initTabNavigation() {
  const tabs = document.querySelectorAll('.sidebar-item[data-tab]');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const targetTab = tab.getAttribute('data-tab');
      document.querySelectorAll('.tab-content').forEach(content => {
        content.style.display = content.id === targetTab ? 'block' : 'none';
      });
    });
  });
}

async function fetchAuthorized(url, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...(options.headers || {})
  };

  const response = await fetch(url, { ...options, headers });
  if (response.status === 401 || response.status === 403) {
    logout();
    throw new Error('Unauthorized');
  }
  return response;
}

async function loadDashboardStats() {
  try {
    const res = await fetchAuthorized('/api/admin/stats');
    if (!res.ok) return;
    const stats = await res.json();

    document.getElementById('statTotalLeads').textContent = stats.totalLeads || 0;
    document.getElementById('statNewLeads').textContent = stats.newLeads || 0;
    document.getElementById('statConvertedLeads').textContent = stats.convertedLeads || 0;
    document.getElementById('statUnreadMessages').textContent = stats.unreadMessages || 0;
  } catch (err) {
    console.error('Error loading stats:', err);
  }
}

async function loadLeads(statusFilter = '') {
  const tbody = document.getElementById('leadsTableBody');
  if (!tbody) return;

  tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:30px;">Loading leads...</td></tr>';

  try {
    const url = statusFilter ? `/api/admin/leads?status=${statusFilter}` : '/api/admin/leads';
    const res = await fetchAuthorized(url);
    currentLeadsData = await res.json();

    renderLeadsTable(currentLeadsData);
  } catch (err) {
    console.error('Error loading leads:', err);
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:30px; color:#f87171;">Failed to load leads.</td></tr>';
  }
}

function renderLeadsTable(leads) {
  const tbody = document.getElementById('leadsTableBody');
  if (!tbody) return;

  if (!leads || leads.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:30px; color:#64748b;">No leads found.</td></tr>';
    return;
  }

  tbody.innerHTML = leads.map(lead => `
    <tr>
      <td>#${lead.id}</td>
      <td><strong>${escapeHtml(lead.fullName)}</strong><br><small style="color:#64748b;">${escapeHtml(lead.email)}</small></td>
      <td>${escapeHtml(lead.phone || 'N/A')}</td>
      <td>${lead.websiteUrl ? `<a href="${escapeHtml(lead.websiteUrl)}" target="_blank" style="color:var(--accent-cyan); text-decoration:underline;">${escapeHtml(lead.websiteUrl)}</a>` : 'N/A'}</td>
      <td>${escapeHtml(lead.serviceNeeded || 'Audit')}</td>
      <td>
        <select class="status-select" onchange="updateLeadStatus(${lead.id}, this.value)">
          <option value="NEW" ${lead.status === 'NEW' ? 'selected' : ''}>NEW</option>
          <option value="CONTACTED" ${lead.status === 'CONTACTED' ? 'selected' : ''}>CONTACTED</option>
          <option value="QUALIFIED" ${lead.status === 'QUALIFIED' ? 'selected' : ''}>QUALIFIED</option>
          <option value="PROPOSAL_SENT" ${lead.status === 'PROPOSAL_SENT' ? 'selected' : ''}>PROPOSAL SENT</option>
          <option value="CONVERTED" ${lead.status === 'CONVERTED' ? 'selected' : ''}>CONVERTED</option>
          <option value="ARCHIVED" ${lead.status === 'ARCHIVED' ? 'selected' : ''}>ARCHIVED</option>
        </select>
      </td>
      <td style="display:flex; gap:6px;">
        <button class="btn btn-outline btn-sm" style="padding:4px 10px; font-size:0.78rem;" onclick="openLeadDetailModal(${lead.id})">Details</button>
        <button class="btn btn-outline btn-sm" style="padding:4px 10px; font-size:0.78rem; border-color:rgba(239,68,68,0.4); color:#f87171;" onclick="deleteLead(${lead.id})">Delete</button>
      </td>
    </tr>
  `).join('');
}

function searchLeads(query) {
  const q = query.toLowerCase().trim();
  if (!q) {
    renderLeadsTable(currentLeadsData);
    return;
  }
  const filtered = currentLeadsData.filter(l => 
    (l.fullName && l.fullName.toLowerCase().includes(q)) ||
    (l.email && l.email.toLowerCase().includes(q)) ||
    (l.websiteUrl && l.websiteUrl.toLowerCase().includes(q)) ||
    (l.serviceNeeded && l.serviceNeeded.toLowerCase().includes(q))
  );
  renderLeadsTable(filtered);
}

async function updateLeadStatus(id, newStatus) {
  try {
    const res = await fetchAuthorized(`/api/admin/leads/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status: newStatus })
    });
    if (res.ok) {
      loadDashboardStats();
    }
  } catch (err) {
    console.error('Failed to update lead status:', err);
  }
}

async function deleteLead(id) {
  if (!confirm('Are you sure you want to delete this lead?')) return;
  try {
    const res = await fetchAuthorized(`/api/admin/leads/${id}`, { method: 'DELETE' });
    if (res.ok) {
      loadLeads();
      loadDashboardStats();
    }
  } catch (err) {
    console.error('Failed to delete lead:', err);
  }
}

async function loadMessages(statusFilter = '') {
  const tbody = document.getElementById('messagesTableBody');
  if (!tbody) return;

  tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:30px;">Loading messages...</td></tr>';

  try {
    const url = statusFilter ? `/api/admin/contacts?status=${statusFilter}` : '/api/admin/contacts';
    const res = await fetchAuthorized(url);
    currentMessagesData = await res.json();

    renderMessagesTable(currentMessagesData);
  } catch (err) {
    console.error('Error loading messages:', err);
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:30px; color:#f87171;">Failed to load messages.</td></tr>';
  }
}

function renderMessagesTable(messages) {
  const tbody = document.getElementById('messagesTableBody');
  if (!tbody) return;

  if (!messages || messages.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:30px; color:var(--text-muted);">No contact messages found.</td></tr>';
    return;
  }

  tbody.innerHTML = messages.map(msg => `
    <tr>
      <td>#${msg.id}</td>
      <td><strong>${escapeHtml(msg.name)}</strong><br><small style="color:#64748b;">${escapeHtml(msg.email)}</small></td>
      <td>${escapeHtml(msg.subject || 'General')}</td>
      <td class="msg-content-cell">${escapeHtml(msg.message)}</td>
      <td>
        <select class="status-select" onchange="updateMessageStatus(${msg.id}, this.value)">
          <option value="UNREAD" ${msg.status === 'UNREAD' ? 'selected' : ''}>UNREAD</option>
          <option value="READ" ${msg.status === 'READ' ? 'selected' : ''}>READ</option>
          <option value="REPLIED" ${msg.status === 'REPLIED' ? 'selected' : ''}>REPLIED</option>
          <option value="CLOSED" ${msg.status === 'CLOSED' ? 'selected' : ''}>CLOSED</option>
        </select>
      </td>
      <td style="display:flex; gap:6px;">
        <button class="btn btn-outline btn-sm" style="padding:4px 10px; font-size:0.78rem;" onclick="openMessageDetailModal(${msg.id})">Details</button>
        <button class="btn btn-outline btn-sm" style="padding:4px 10px; font-size:0.78rem; border-color:rgba(239,68,68,0.4); color:#f87171;" onclick="deleteMessage(${msg.id})">Delete</button>
      </td>
    </tr>
  `).join('');
}

function searchMessages(query) {
  const q = query.toLowerCase().trim();
  if (!q) {
    renderMessagesTable(currentMessagesData);
    return;
  }
  const filtered = currentMessagesData.filter(m => 
    (m.name && m.name.toLowerCase().includes(q)) ||
    (m.email && m.email.toLowerCase().includes(q)) ||
    (m.subject && m.subject.toLowerCase().includes(q)) ||
    (m.message && m.message.toLowerCase().includes(q))
  );
  renderMessagesTable(filtered);
}

async function updateMessageStatus(id, newStatus) {
  try {
    const res = await fetchAuthorized(`/api/admin/contacts/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status: newStatus })
    });
    if (res.ok) {
      loadDashboardStats();
    }
  } catch (err) {
    console.error('Failed to update message status:', err);
  }
}

async function deleteMessage(id) {
  if (!confirm('Are you sure you want to delete this message?')) return;
  try {
    const res = await fetchAuthorized(`/api/admin/contacts/${id}`, { method: 'DELETE' });
    if (res.ok) {
      loadMessages();
      loadDashboardStats();
    }
  } catch (err) {
    console.error('Failed to delete message:', err);
  }
}

// Modal Popups
async function openLeadDetailModal(id) {
  const modal = document.getElementById('detailModalOverlay');
  const title = document.getElementById('modalTitle');
  const content = document.getElementById('modalContent');
  if (!modal || !content) return;

  try {
    const res = await fetchAuthorized(`/api/admin/leads/${id}`);
    const lead = await res.json();

    title.textContent = `Website Audit Lead #${lead.id}`;
    content.innerHTML = `
      <div class="detail-item">
        <span class="detail-label">Full Name</span>
        <span class="detail-value">${escapeHtml(lead.fullName)}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Email Address</span>
        <span class="detail-value"><a href="mailto:${escapeHtml(lead.email)}" style="color:var(--accent-cyan); text-decoration:underline;">${escapeHtml(lead.email)}</a></span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Phone Number</span>
        <span class="detail-value">${escapeHtml(lead.phone || 'N/A')}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Website URL</span>
        <span class="detail-value">${lead.websiteUrl ? `<a href="${escapeHtml(lead.websiteUrl)}" target="_blank" style="color:var(--accent-cyan); text-decoration:underline;">${escapeHtml(lead.websiteUrl)}</a>` : 'N/A'}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Primary Goal</span>
        <span class="detail-value">${escapeHtml(lead.serviceNeeded || 'Audit')}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Budget Range</span>
        <span class="detail-value">${escapeHtml(lead.budgetRange || 'Unspecified')}</span>
      </div>
      <div class="detail-item" style="grid-column: span 2;">
        <span class="detail-label">Submitted Date</span>
        <span class="detail-value">${new Date(lead.createdAt).toLocaleString()}</span>
      </div>
      <div class="detail-item" style="grid-column: span 2;">
        <span class="detail-label">Client Notes & Requirements</span>
        <div style="background:rgba(9,13,22,0.8); padding:14px; border-radius:var(--radius-md); border:1px solid var(--glass-border); margin-top:6px; color:var(--text-muted); font-size:0.9rem; line-height:1.6; white-space:pre-wrap; word-break:break-word;">
          ${escapeHtml(lead.notes || 'No extra notes provided.')}
        </div>
      </div>
    `;
    modal.style.display = 'flex';
  } catch (err) {
    console.error('Failed to load lead details:', err);
  }
}

async function openMessageDetailModal(id) {
  const modal = document.getElementById('detailModalOverlay');
  const title = document.getElementById('modalTitle');
  const content = document.getElementById('modalContent');
  if (!modal || !content) return;

  try {
    const res = await fetchAuthorized(`/api/admin/contacts/${id}`);
    const msg = await res.json();

    title.textContent = `Inquiry Message #${msg.id}`;
    content.innerHTML = `
      <div class="detail-item">
        <span class="detail-label">Sender Name</span>
        <span class="detail-value">${escapeHtml(msg.name)}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Email Address</span>
        <span class="detail-value"><a href="mailto:${escapeHtml(msg.email)}" style="color:var(--accent-cyan); text-decoration:underline;">${escapeHtml(msg.email)}</a></span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Phone Number</span>
        <span class="detail-value">${escapeHtml(msg.phone || 'N/A')}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Company</span>
        <span class="detail-value">${escapeHtml(msg.company || 'N/A')}</span>
      </div>
      <div class="detail-item" style="grid-column: span 2;">
        <span class="detail-label">Subject</span>
        <span class="detail-value">${escapeHtml(msg.subject || 'General Inquiry')}</span>
      </div>
      <div class="detail-item" style="grid-column: span 2;">
        <span class="detail-label">Submitted Date</span>
        <span class="detail-value">${new Date(msg.createdAt).toLocaleString()}</span>
      </div>
      <div class="detail-item" style="grid-column: span 2;">
        <span class="detail-label">Full Message Body</span>
        <div style="background:rgba(9,13,22,0.8); padding:14px; border-radius:var(--radius-md); border:1px solid var(--glass-border); margin-top:6px; color:var(--text-muted); font-size:0.9rem; line-height:1.6; white-space:pre-wrap; word-break:break-word;">
          ${escapeHtml(msg.message)}
        </div>
      </div>
    `;
    modal.style.display = 'flex';
  } catch (err) {
    console.error('Failed to load message details:', err);
  }
}

function closeDetailModal() {
  const modal = document.getElementById('detailModalOverlay');
  if (modal) modal.style.display = 'none';
}

// Export CSV Functions
function exportLeadsCSV() {
  if (!currentLeadsData || currentLeadsData.length === 0) {
    alert('No lead records to export.');
    return;
  }
  const headers = ['ID', 'Full Name', 'Email', 'Phone', 'Website URL', 'Goal/Service', 'Budget Range', 'Status', 'Submitted Date', 'Notes'];
  const rows = currentLeadsData.map(l => [
    l.id,
    `"${csvEscape(l.fullName)}"`,
    `"${csvEscape(l.email)}"`,
    `"${csvEscape(l.phone || '')}"`,
    `"${csvEscape(l.websiteUrl || '')}"`,
    `"${csvEscape(l.serviceNeeded || '')}"`,
    `"${csvEscape(l.budgetRange || '')}"`,
    `"${csvEscape(l.status)}"`,
    `"${new Date(l.createdAt).toLocaleString()}"`,
    `"${csvEscape(l.notes || '')}"`
  ]);

  downloadCSV('techzync_audit_leads.csv', [headers.join(','), ...rows.map(r => r.join(','))].join('\n'));
}

function exportMessagesCSV() {
  if (!currentMessagesData || currentMessagesData.length === 0) {
    alert('No message records to export.');
    return;
  }
  const headers = ['ID', 'Name', 'Email', 'Phone', 'Company', 'Subject', 'Status', 'Submitted Date', 'Message'];
  const rows = currentMessagesData.map(m => [
    m.id,
    `"${csvEscape(m.name)}"`,
    `"${csvEscape(m.email)}"`,
    `"${csvEscape(m.phone || '')}"`,
    `"${csvEscape(m.company || '')}"`,
    `"${csvEscape(m.subject || '')}"`,
    `"${csvEscape(m.status)}"`,
    `"${new Date(m.createdAt).toLocaleString()}"`,
    `"${csvEscape(m.message || '')}"`
  ]);

  downloadCSV('techzync_inquiries.csv', [headers.join(','), ...rows.map(r => r.join(','))].join('\n'));
}

function downloadCSV(filename, csvContent) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function csvEscape(str) {
  if (!str) return '';
  return str.replace(/"/g, '""').replace(/\n/g, ' ');
}

function filterLeads(status, btn) {
  document.querySelectorAll('#leadFilters .filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  loadLeads(status);
}

function filterMessages(status, btn) {
  document.querySelectorAll('#messageFilters .filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  loadMessages(status);
}

function showError(elem, msg) {
  if (!elem) return;
  elem.textContent = msg;
  elem.style.display = 'block';
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>"']/g, function(m) {
    return {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    }[m];
  });
}
