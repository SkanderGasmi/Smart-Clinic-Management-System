// patientDashboard.js

// Import modules
import { createDoctorCard } from './components/doctorCard.js';
import { renderPatientSignup } from './components/modals/patientSignupModal.js';
import { renderPatientLogin } from './components/modals/patientLoginModal.js';
import { getDoctors, filterDoctors } from './services/doctorServices.js';
import { patientSignup, patientLogin } from './services/patientServices.js';

document.addEventListener("DOMContentLoaded", () => {
  const contentDiv = document.getElementById("content");
  const modal = document.getElementById("modal");
  const modalBody = document.getElementById("modal-body");
  const closeBtn = document.getElementById("closeModal");

  if (!contentDiv || !modal || !modalBody) return;

  // Load all doctors
  loadDoctorCards();

  // Close modal button
  if (closeBtn) closeBtn.onclick = () => (modal.style.display = 'none');

  // Patient Signup
  const signupBtn = document.getElementById("patientSignup");
  if (signupBtn) {
    signupBtn.addEventListener("click", () => {
      modal.style.display = 'block';
      renderPatientSignup(modalBody);
    });
  }

  // Patient Login
  const loginBtn = document.getElementById("patientLogin");
  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      modal.style.display = 'block';
      renderPatientLogin(modalBody);
    });
  }

  // Filter listeners
  const searchBar = document.getElementById("searchBar");
  const filterTime = document.getElementById("filterTime");
  const filterSpecialty = document.getElementById("filterSpecialty");

  if (searchBar) searchBar.addEventListener("input", filterDoctorsOnChange);
  if (filterTime) filterTime.addEventListener("change", filterDoctorsOnChange);
  if (filterSpecialty) filterSpecialty.addEventListener("change", filterDoctorsOnChange);
});

// Fetch and display all doctors
async function loadDoctorCards() {
  try {
    const doctors = await getDoctors();
    renderDoctorCards(doctors);
  } catch (error) {
    console.error("Failed to load doctors:", error);
    const contentDiv = document.getElementById("content");
    if (contentDiv) contentDiv.innerHTML = "<p>Failed to load doctors. Please try again later.</p>";
  }
}

// Render doctor cards
function renderDoctorCards(doctors) {
  const contentDiv = document.getElementById("content");
  if (!contentDiv) return;

  contentDiv.innerHTML = "";
  if (!doctors || doctors.length === 0) {
    contentDiv.innerHTML = "<p>No doctors available.</p>";
    return;
  }

  doctors.forEach(doctor => {
    const card = createDoctorCard(doctor);
    contentDiv.appendChild(card);
  });
}

// Filter doctors dynamically
async function filterDoctorsOnChange() {
  const name = document.getElementById("searchBar")?.value.trim() || null;
  const time = document.getElementById("filterTime")?.value || null;
  const specialty = document.getElementById("filterSpecialty")?.value || null;

  try {
    const response = await filterDoctors(name, time, specialty);
    const doctors = response?.doctors || [];
    if (doctors.length > 0) {
      renderDoctorCards(doctors);
    } else {
      const contentDiv = document.getElementById("content");
      if (contentDiv) contentDiv.innerHTML = "<p>No doctors found with the given filters.</p>";
    }
  } catch (error) {
    console.error("Failed to filter doctors:", error);
    alert("❌ An error occurred while filtering doctors.");
  }
}

// Signup handler (used in patientSignupModal.js)
window.signupPatient = async function () {
  try {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const phone = document.getElementById("phone").value;
    const address = document.getElementById("address").value;

    const data = { name, email, password, phone, address };
    const { success, message } = await patientSignup(data);

    if (success) {
      alert(message);
      document.getElementById("modal").style.display = "none";
      window.location.reload();
    } else {
      alert(message);
    }
  } catch (error) {
    console.error("Signup failed:", error);
    alert("❌ An error occurred while signing up.");
  }
};

// Login handler (used in patientLoginModal.js)
window.loginPatient = async function () {
  try {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const data = { email, password };

    const response = await patientLogin(data);

    if (response.ok) {
      const result = await response.json();
      localStorage.setItem("token", result.token);
      localStorage.setItem("userRole", "loggedPatient");
      window.location.href = '/pages/loggedPatientDashboard.html';
    } else {
      alert("❌ Invalid credentials!");
    }
  } catch (error) {
    console.error("Login failed:", error);
    alert("❌ Failed to login. Please try again.");
  }
};
