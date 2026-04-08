const API_BASE = '/users';

async function fetchUsers() {
  try {
    const res = await fetch(API_BASE);
    if (!res.ok) throw new Error('Failed to fetch users');
    const users = await res.json();
    renderUsers(users);
  } catch (err) {
    showError('Could not load users: ' + err.message);
  }
}

function renderUsers(users) {
  const listEl = document.getElementById('userList');
  if (!users.length) {
    listEl.innerHTML = '<li class="empty">✨ No users yet. Add one above!</li>';
    return;
  }
  listEl.innerHTML = users.map(user => `
    <li class="user-item" data-id="${user.id}">
      <div>
        <div class="user-info">${escapeHtml(user.name)}</div>
        <div class="user-email">${escapeHtml(user.email)}</div>
      </div>
      <div>
        <button class="delete-btn" data-id="${user.id}">Delete</button>
        <span class="badge">#${user.id}</span>
      </div>
    </li>
  `).join('');

  // Attach delete event listeners
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = btn.getAttribute('data-id');
      await deleteUser(id);
    });
  });
}

async function deleteUser(id) {
  try {
    const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || 'Delete failed');
    }
    // Refresh list after successful deletion
    await fetchUsers();
  } catch (err) {
    showError(err.message);
  }
}

async function createUser(name, email) {
  try {
    const res = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email })
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Something went wrong');
    }
    const newUser = await res.json();
    document.getElementById('formMessage').innerHTML = '';
    await fetchUsers();
    return newUser;
  } catch (err) {
    showError(err.message, true);
    throw err;
  }
}

function showError(message, isFormError = false) {
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error';
  errorDiv.textContent = message;
  if (isFormError) {
    const container = document.getElementById('formMessage');
    container.innerHTML = '';
    container.appendChild(errorDiv);
    setTimeout(() => {
      if (container.firstChild === errorDiv) container.innerHTML = '';
    }, 3000);
  } else {
    const listEl = document.getElementById('userList');
    listEl.innerHTML = '';
    listEl.appendChild(errorDiv);
    setTimeout(() => {
      if (listEl.firstChild === errorDiv) fetchUsers();
    }, 3000);
  }
}

function escapeHtml(str) {
  return str.replace(/[&<>]/g, function(m) {
    if (m === '&') return '&amp;';
    if (m === '<') return '&lt;';
    if (m === '>') return '&gt;';
    return m;
  });
}

// Form submit handler
document.getElementById('userForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const name = nameInput.value.trim();
  const email = emailInput.value.trim();

  if (!name || !email) {
    showError('Please fill in both fields', true);
    return;
  }

  const submitBtn = e.target.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Creating...';
  submitBtn.disabled = true;

  try {
    await createUser(name, email);
    nameInput.value = '';
    emailInput.value = '';
  } finally {
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }
});

// Initial load
fetchUsers();