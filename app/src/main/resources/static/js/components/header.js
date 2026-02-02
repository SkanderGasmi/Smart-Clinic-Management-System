// header.js
// This script dynamically renders the header based on the user's role and session state

function renderHeader() {
  const headerDiv = document.getElementById("header");

  // If on homepage/root, clear session and render simple logo header
  if (window.location.pathname.endsWith("/")) {
    localStorage.removeItem("userRole");
    localStorage.removeItem("token");

    headerDiv.innerHTML = `
            <header class="header">
                <div class="logo-section">
                    <img src="../assets/images/logo/logo.png" alt="Hospital CRM Logo" class="logo-img">
                    <span class="logo-title">Hospital CMS</span>
                </div>
            </header>`;
    return;
  }

  // Retrieve user role and token
  const role = localStorage.getItem("userRole");
  const token = localStorage.getItem("token");

  let headerContent = `
        <header class="header">
            <div class="logo-section">
                <img src="../assets/images/logo/logo.png" alt="Hospital CRM Logo" class="logo-img">
                <span class="logo-title">Hospital CMS</span>
            </div>
            <nav>`;

  // Session expired or invalid login check
  if ((role === "loggedPatient" || role === "admin" || role === "doctor") && !token) {
    localStorage.removeItem("userRole");
    alert("Session expired or invalid login. Please log in again.");
    window.location.href = "/";
    return;
  }

  // Add role-specific header buttons/links
  if (role === "admin") {
    headerContent += `
            <button id="addDocBtn" class="adminBtn" onclick="openModal('addDoctor')">Add Doctor</button>
            <a href="#" onclick="logout()">Logout</a>`;
  } else if (role === "doctor") {
    headerContent += `
            <button class="adminBtn" onclick="selectRole('doctor')">Home</button>
            <a href="#" onclick="logout()">Logout</a>`;
  } else if (role === "patient") {
    headerContent += `
            <button id="patientLogin" class="adminBtn">Login</button>
            <button id="patientSignup" class="adminBtn">Sign Up</button>`;
  } else if (role === "loggedPatient") {
    headerContent += `
            <button id="home" class="adminBtn" onclick="window.location.href='/pages/loggedPatientDashboard.html'">Home</button>
            <button id="patientAppointments" class="adminBtn" onclick="window.location.href='/pages/patientAppointments.html'">Appointments</button>
            <a href="#" onclick="logoutPatient()">Logout</a>`;
  }

  // Close nav and header
  headerContent += `
            </nav>
        </header>`;

  // Inject the generated header into the DOM
  headerDiv.innerHTML = headerContent;

  // Attach dynamic event listeners
  attachHeaderButtonListeners();
}

// Attach event listeners to dynamically created header buttons
function attachHeaderButtonListeners() {
  const loginBtn = document.getElementById("patientLogin");
  if (loginBtn) loginBtn.addEventListener("click", () => openModal('patientLogin'));

  const signupBtn = document.getElementById("patientSignup");
  if (signupBtn) signupBtn.addEventListener("click", () => openModal('patientSignup'));

  const addDocBtn = document.getElementById("addDocBtn");
  if (addDocBtn) addDocBtn.addEventListener("click", () => openModal('addDoctor'));
}

// Logout function for admin, doctor, or loggedPatient
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("userRole");
  window.location.href = "/";
}

// Logout function specifically for loggedPatient
function logoutPatient() {
  localStorage.removeItem("token");
  localStorage.setItem("userRole", "patient"); // Retain patient role to show login/signup again
  window.location.href = "/pages/patientDashboard.html";
}

// Call renderHeader on page load
document.addEventListener("DOMContentLoaded", renderHeader);
