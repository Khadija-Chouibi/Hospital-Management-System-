function showView(viewId) {
  document.getElementById('loginView').style.display = 'none';
  document.getElementById('nurseView').style.display = 'none';
  document.getElementById('doctorView').style.display = 'none';
  document.getElementById('adminView').style.display = 'none';
  document.getElementById(viewId).style.display = 'block';
}

document.getElementById('loginForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const email = e.target.email.value;
  const password = e.target.password.value;
  const role = e.target.role.value;

  try {
    // Call backend API to authenticate user
    const response = await fetch('http://localhost:3000/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role })
    });

    if (!response.ok) {
      throw new Error('Invalid email, password, or role');
    }

    const user = await response.json();

    // Show the correct dashboard
    if (user.role === 'nurse') {
      showView('nurseView');
      // Optionally, load nurse appointments here
    } else if (user.role === 'doctor') {
      showView('doctorView');
      // Optionally, load doctor appointments here
    } else if (user.role === 'admin') {
      showView('adminView');
      // Optionally, load admin appointments here
    } else {
      alert('Unknown role');
      showView('loginView');
    }
  } catch (err) {
    alert(err.message);
  }
});

function logout() {
  showView('loginView');
}