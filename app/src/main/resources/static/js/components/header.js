// /js/header.js
import { renderPatientSignup } from './modals/patientSignupModal.js';
import { renderPatientLogin } from './modals/patientLoginModal.js';
import { renderAdminLogin } from './modals/adminLoginModal.js';
import { renderDoctorLogin } from './modals/doctorLoginModal.js';
import { selectRole } from '../services/index.js'; // import selectRole

export function renderHeader() {
  const headerDiv = document.getElementById("header");
  if (!headerDiv) return console.error("Header div not found!");

  const role = localStorage.getItem("userRole");
  const token = localStorage.getItem("token");

  if (window.location.pathname.endsWith("/")) {
    localStorage.removeItem("userRole");
    localStorage.removeItem("token");
    headerDiv.innerHTML = `
      <header class="header">
        <div class="logo-section">
          <img src="../assets/images/logo/logo.png" alt="Hospital CMS Logo" class="logo-img">
          <span class="logo-title">Hospital CMS</span>
        </div>
      </header>`;
    return;
  }

  if ((role === "loggedPatient" || role === "admin" || role === "doctor") && !token) {
    localStorage.removeItem("userRole");
    alert("Session expired. Please log in again.");
    window.location.href = "/";
    return;
  }

  let headerContent = `
    <header class="header">
      <div class="logo-section">
        <img src="../assets/images/logo/logo.png" alt="Hospital CMS Logo" class="logo-img">
        <span class="logo-title">Hospital CMS</span>
      </div>
      <nav>`;

  switch (role) {
    case "admin":
      headerContent += `
        <button id="addDocBtn" class="adminBtn">Add Doctor</button>
        <button id="adminLogin" class="adminBtn">Login</button>
        <button id="logoutBtn" class="adminBtn">Logout</button>`;
      break;
    case "doctor":
      headerContent += `
        <button class="adminBtn" onclick="selectRole('doctor')">Home</button>
        <button id="logoutBtn" class="adminBtn">Logout</button>`;
      break;
    case "patient":
      headerContent += `
        <button id="patientLogin" class="adminBtn">Login</button>
        <button id="patientSignup" class="adminBtn">Sign Up</button>`;
      break;
    case "loggedPatient":
      headerContent += `
        <button class="adminBtn" onclick="selectRole('loggedPatient')">Home</button>
        <button class="adminBtn" onclick="window.location.href='/pages/patientAppointments.html'">Appointments</button>
        <button id="logoutPatientBtn" class="adminBtn">Logout</button>`;
      break;
  }

  headerContent += `</nav></header>`;
  headerDiv.innerHTML = headerContent;

  attachListeners();
}

function attachListeners() {
  const modal = document.getElementById("modal");
  const modalBody = document.getElementById("modal-body");
  const closeBtn = document.getElementById("closeModal");

  if (closeBtn && modal) closeBtn.onclick = () => (modal.style.display = "none");

  const signupBtn = document.getElementById("patientSignup");
  if (signupBtn && modal && modalBody) {
    signupBtn.addEventListener("click", () => {
      modal.style.display = "block";
      renderPatientSignup(modalBody);
    });
  }

  const loginBtn = document.getElementById("patientLogin");
  if (loginBtn && modal && modalBody) {
    loginBtn.addEventListener("click", () => {
      modal.style.display = "block";
      renderPatientLogin(modalBody);
    });
  }

  const adminLoginBtn = document.getElementById("adminLogin");
  if (adminLoginBtn && modal && modalBody) {
    adminLoginBtn.addEventListener("click", () => {
      modal.style.display = "block";
      renderAdminLogin(modalBody);
    });
  }

  const addDocBtn = document.getElementById("addDocBtn");
  if (addDocBtn) addDocBtn.addEventListener("click", () => alert("Add Doctor modal not implemented"));

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    window.location.href = "/";
  });

  const logoutPatientBtn = document.getElementById("logoutPatientBtn");
  if (logoutPatientBtn) logoutPatientBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.setItem("userRole", "patient");
    window.location.href = "/pages/patientDashboard.html";
  });
}

document.addEventListener("DOMContentLoaded", renderHeader);
