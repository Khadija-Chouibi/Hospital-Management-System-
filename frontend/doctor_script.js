const list = document.getElementById('doctorAppointments');

async function fetchAppointments() {
  list.innerHTML = '<li>Loading...</li>';
  try {
    const res = await fetch('http://localhost:3000/api/appointments');
    const appointments = await res.json();
    renderAppointments(appointments);
  } catch (err) {
    list.innerHTML = `<li>Error loading appointments</li>`;
  }
}

function renderAppointments(appointments) {
  list.innerHTML = '';
  appointments.forEach(appt => {
    const item = document.createElement('li');
    item.innerHTML = `
      <strong>${appt.patientname || ''}</strong><br>
      <small><b>Date & Time:</b> ${appt.datetime}</small><br>
      <b>Diagnosis:</b> ${appt.diagnosis}<br>
      <b>Doctor ID:</b> ${appt.doctorid} | 
      <b>Patient ID:</b> ${appt.patientid} | 
      <b>Nurse ID:</b> ${appt.nurseid}<br>
      <b>Status:</b> ${appt.status}<br>
      <b>Created:</b> ${appt.createdat ?? ''} <br>
      <b>Updated:</b> ${appt.updatedat ?? '—'}
      <hr/>
    `;
    list.appendChild(item);
  });
}

fetchAppointments();
