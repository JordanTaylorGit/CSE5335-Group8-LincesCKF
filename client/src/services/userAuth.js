
const USERS_KEY = 'lincesckf_users';
const SESSION_KEY = 'lincesckf_user';


function loadUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function safeUser(u) {
  return {
    id: u.id,
    email: u.email,
    firstName: u.firstName,
    lastName: u.lastName,
    companyName: u.companyName,
    phone: u.phone,
    accountType: u.accountType,
    createdAt: u.createdAt,
    // convenience: full display name
    name: u.companyName || [u.firstName, u.lastName].filter(Boolean).join(' ') || u.email,
  };
}


/**
 * Register a new user.
 * @param {{
 *   email: string,
 *   password: string,
 *   accountType: 'CUSTOMER'|'BRAND',
 *   firstName?: string,
 *   lastName?: string,
 *   companyName?: string,
 *   phone?: string,
 *   preferredLanguage?: 'en'|'es'
 * }}
 * @returns {Promise<safeUser>}
 */
export function registerUser({
  email,
  password,
  accountType = 'CUSTOMER',
  firstName = '',
  lastName = '',
  companyName = '',
  phone = '',
}) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const users = loadUsers();
      if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
        return reject({ message: 'An account with this email already exists.' });
      }
      const newUser = {
        id: String(Date.now()),
        email: email.toLowerCase().trim(),
        password, // mock only — hash in real app
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        companyName: companyName.trim(),
        phone: phone.trim(),
        accountType,
        createdAt: new Date().toISOString(),
      };
      saveUsers([...users, newUser]);
      resolve(safeUser(newUser));
    }, 500);
  });
}

/**
 * Log in an existing user.
 * @param {{ email: string, password: string }}
 * @returns {Promise<{ id, email, name, accountType }>}
 */
export function loginUser({ email, password }) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const users = loadUsers();
      const found = users.find(
        u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );
      if (!found) {
        return reject({ message: 'Invalid email or password. Please try again.' });
      }
      resolve(safeUser(found));
    }, 450);
  });
}

/**
 * Persist the logged-in user to localStorage so the session survives a refresh.
 */
export function storeSession(user) {
  if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  else localStorage.removeItem(SESSION_KEY);
}

/**
 * Restore a previously stored session on app load.
 * @returns {{ id, email, name, accountType } | null}
 */
export function getStoredSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
