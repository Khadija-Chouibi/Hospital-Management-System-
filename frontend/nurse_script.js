console.log('nurse_script.js loaded');

const form = document.getElementById('appointmentForm');
const list = document.getElementById('nurseAppointments');

if (!form) {
  console.error('appointmentForm not found in DOM');
}
if (!list) {
  console.error('nurseAppointments list not found in DOM');
}

// Fetch and display appointments on load
async function fetchAppointments() {
  if (!list) {
    console.error('Cannot fetch appointments: nurseAppointments list not found');
    return;
  }
  list.innerHTML = '<li>Loading...</li>';
  try {
    const res = await fetch('http://localhost:3000/api/appointments');
    const appointments = await res.json();
    console.log('Fetched appointments:', appointments);
    renderAppointments(appointments);
  } catch (err) {
    console.error('Error fetching appointments:', err);
    list.innerHTML = `<li>Error loading appointments</li>`;
  }
}

function renderAppointments(appointments) {
  if (!list) return;
  list.innerHTML = '';
  appointments.forEach(appt => {
    const item = document.createElement('li');
    item.innerHTML = `
      <strong>${appt.patientname || ''}</strong> (Doctor ID: ${appt.doctorid})<br>
      <small>${appt.datetime}</small><br>
      Diagnosis: ${appt.diagnosis}<br>
      Status: ${appt.status}<br>
      Created at: ${appt.createdat ?? ''}<br>
      Updated at: ${appt.updatedat ?? '—'}
      <hr/>
    `;
    list.appendChild(item);
  });
}

if (form) {
  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = new FormData(form);
    const appointment = {
      doctorID: parseInt(formData.get('doctorId')),
      patientID: parseInt(formData.get('patientId')),
      nurseID: formData.get('nurseId') ? parseInt(formData.get('nurseId')) : null,
      dateTime: formData.get('datetime'),
      status: formData.get('status'),
      diagnosis: formData.get('diagnosis')
    };

    console.log('Submitting appointment:', appointment);

    try {
      const response = await fetch('http://localhost:3000/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appointment)
      });
      const responseBody = await response.json();
      console.log('Backend response:', response.status, responseBody);

      if (!response.ok) {
        alert('Failed to add appointment: ' + (responseBody.error || 'Unknown error'));
        return;
      }
      form.reset();
      fetchAppointments();
    } catch (err) {
      console.error('Error submitting appointment:', err);
      alert('Failed to add appointment');
    }
  });
}

// Initial load
fetchAppointments();