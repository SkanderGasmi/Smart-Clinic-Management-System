import { API_BASE_URL } from '../config/config.js';

const ADMIN_API = API_BASE_URL + '/admin/login';
const DOCTOR_API = API_BASE_URL + '/doctor/login';

export async function adminLoginHandler(username, password) {
  try {
    const response = await fetch(ADMIN_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    if (!response.ok) {
      const err = await response.json();
      return alert(err.message || 'Invalid credentials!');
    }

    const data = await response.json();
    localStorage.setItem('token', data.token);
    localStorage.setItem('userRole', 'admin');
    window.location.href = '/admin/dashboard';
  } catch (err) {
    console.error(err);
    alert('Login failed');
  }
}

export async function doctorLoginHandler(email, password) {
  try {
    const response = await fetch(DOCTOR_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      const err = await response.json();
      return alert(err.message || 'Invalid credentials!');
    }

    const data = await response.json();
    localStorage.setItem('token', data.token);
    localStorage.setItem('userRole', 'doctor');
    window.location.href = '/doctor/dashboard';
  } catch (err) {
    console.error(err);
    alert('Login failed');
  }
}

// ---- Role selection for homepage buttons ----
export function selectRole(role) {
  localStorage.setItem('userRole', role);

  switch (role) {
    case 'admin':
      window.location.href = '/admin/dashboard';
      break;
    case 'doctor':
      window.location.href = '/doctor/dashboard';
      break;
    case 'patient':
      window.location.href = '/pages/patientDashboard.html';
      break;
    default:
      window.location.href = '/';
  }
}

// DOMContentLoaded for modal buttons
window.addEventListener('DOMContentLoaded', () => {
  const adminBtn = document.getElementById('adminLogin');
  const doctorBtn = document.getElementById('doctorLogin');
  const modal = document.getElementById('modal');
  const modalBody = document.getElementById('modal-body');
  const closeBtn = document.getElementById('closeModal');

  if (adminBtn && modal && modalBody) {
    adminBtn.addEventListener('click', () => {
      modal.style.display = 'block';
      import('../modals/adminLoginModal.js').then(mod => mod.renderAdminLogin(modalBody));
    });
  }

  if (doctorBtn && modal && modalBody) {
    doctorBtn.addEventListener('click', () => {
      modal.style.display = 'block';
      import('../modals/doctorLoginModal.js').then(mod => mod.renderDoctorLogin(modalBody));
    });
  }

  if (closeBtn && modal) {
    closeBtn.onclick = () => (modal.style.display = 'none');
  }
});
