let appointments = [
  {
    id: 1,
    doctorId: "D001",
    patientId: "P001",
    nurseId: "N001",
    patientName: "John Doe",
    datetime: "2025-05-18T10:00",
    diagnosis: "Flu",
    creationTime: "2025-05-17 14:23",
    updateTime: null,
    status: "upcoming"
  },
  {
    id: 2,
    doctorId: "D001",
    patientId: "P002",
    nurseId: "N002",
    patientName: "Jane Smith",
    datetime: "2025-05-19T09:30",
    diagnosis: "Back Pain",
    creationTime: "2025-05-17 15:00",
    updateTime: "2025-05-17 16:10",
    status: "completed"
  }
];

const list = document.getElementById('adminAppointments');

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
      <form class="edit-appointment-form">
        <label>Doctor ID: <input name="doctorID" type="number" value="${appt.doctorid}" required></label><br>
        <label>Patient ID: <input name="patientID" type="number" value="${appt.patientid}" required></label><br>
        <label>Nurse ID: <input name="nurseID" type="number" value="${appt.nurseid ?? ''}"></label><br>
        <label>Date & Time: <input name="dateTime" type="datetime-local" value="${appt.datetime ? appt.datetime.slice(0,16) : ''}" required></label><br>
        <label>Diagnosis: <input name="diagnosis" type="text" value="${appt.diagnosis ?? ''}"></label><br>
        <label>Status:
          <select name="status" required>
            <option value="upcoming" ${appt.status === 'upcoming' ? 'selected' : ''}>Upcoming</option>
            <option value="completed" ${appt.status === 'completed' ? 'selected' : ''}>Completed</option>
            <option value="canceled" ${appt.status === 'canceled' ? 'selected' : ''}>Canceled</option>
          </select>
        </label><br>
        <button type="submit">Update</button>
        <span class="update-status"></span>
      </form>
      <b>Created:</b> ${appt.createdat ?? ''} <br>
      <b>Updated:</b> ${appt.updatedat ?? '—'}<br>
      <hr/>
    `;
    // Add submit handler for this form
    const form = item.querySelector('.edit-appointment-form');
    const statusSpan = item.querySelector('.update-status');
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      statusSpan.textContent = 'Updating...';
      const formData = new FormData(form);
      const updated = {
        doctorID: parseInt(formData.get('doctorID')),
        patientID: parseInt(formData.get('patientID')),
        nurseID: formData.get('nurseID') ? parseInt(formData.get('nurseID')) : null,
        dateTime: formData.get('dateTime'),
        status: formData.get('status'),
        diagnosis: formData.get('diagnosis')
      };
      try {
        const res = await fetch(`http://localhost:3000/api/appointments/${appt.appointmentid}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updated)
        });
        if (!res.ok) {
          const err = await res.json();
          statusSpan.textContent = 'Error: ' + (err.error || 'Unknown');
        } else {
          statusSpan.textContent = 'Updated!';
          fetchAppointments();
        }
      } catch (err) {
        statusSpan.textContent = 'Network error';
      }
    });
    list.appendChild(item);
  });
}

fetchAppointments();
