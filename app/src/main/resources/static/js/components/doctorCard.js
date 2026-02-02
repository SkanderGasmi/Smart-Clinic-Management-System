// doctorCard.js
// Creates dynamic doctor cards for Admin and Patient dashboards

import { showBookingOverlay } from './loggedPatient.js';
import { deleteDoctor } from './doctorServices.js';
import { getPatientData } from './patientServices.js';

export function createDoctorCard(doctor) {
  // Main card container
  const card = document.createElement("div");
  card.classList.add("doctor-card");

  // Get current user role
  const role = localStorage.getItem("userRole");

  // Doctor info section
  const infoDiv = document.createElement("div");
  infoDiv.classList.add("doctor-info");

  const name = document.createElement("h3");
  name.textContent = doctor.name;

  const specialization = document.createElement("p");
  specialization.textContent = `Specialty: ${doctor.specialty}`;

  const email = document.createElement("p");
  email.textContent = `Email: ${doctor.email}`;

  const availability = document.createElement("p");
  availability.textContent = `Available: ${doctor.availability.join(", ")}`;

  // Append info to infoDiv
  infoDiv.appendChild(name);
  infoDiv.appendChild(specialization);
  infoDiv.appendChild(email);
  infoDiv.appendChild(availability);

  // Actions container
  const actionsDiv = document.createElement("div");
  actionsDiv.classList.add("card-actions");

  // Role-based buttons
  if (role === "admin") {
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Delete";
    removeBtn.addEventListener("click", async () => {
      const confirmDelete = confirm(`Are you sure you want to delete Dr. ${doctor.name}?`);
      if (!confirmDelete) return;

      const token = localStorage.getItem("token");
      try {
        const success = await deleteDoctor(doctor.id, token);
        if (success) {
          alert("Doctor deleted successfully.");
          card.remove();
        } else {
          alert("Failed to delete doctor. Try again.");
        }
      } catch (err) {
        console.error(err);
        alert("Error deleting doctor.");
      }
    });
    actionsDiv.appendChild(removeBtn);

  } else if (role === "patient") {
    const bookNow = document.createElement("button");
    bookNow.textContent = "Book Now";
    bookNow.addEventListener("click", () => {
      alert("Please log in first to book an appointment.");
    });
    actionsDiv.appendChild(bookNow);

  } else if (role === "loggedPatient") {
    const bookNow = document.createElement("button");
    bookNow.textContent = "Book Now";
    bookNow.addEventListener("click", async (e) => {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Session expired. Please log in again.");
        window.location.href = "/";
        return;
      }
      try {
        const patientData = await getPatientData(token);
        showBookingOverlay(e, doctor, patientData);
      } catch (err) {
        console.error(err);
        alert("Unable to fetch patient info.");
      }
    });
    actionsDiv.appendChild(bookNow);
  }

  // Assemble card
  card.appendChild(infoDiv);
  card.appendChild(actionsDiv);

  return card;
}
