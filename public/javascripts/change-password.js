// public/javascripts/change-password.js

export function initChangePassword() {
  const form = document.querySelector('form[action="/auth/change-password"]');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Bezig met wijzigen...';

    // Collect form values as JSON
    const data = {
      currentPassword: form.currentPassword.value,
      newPassword: form.newPassword.value,
      confirmPassword: form.confirmPassword.value
    };

    fetch(form.action, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(data => {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Wachtwoord Wijzigen';
        const alertBox = document.createElement('div');
        alertBox.className = data.success ? 'bg-green-100 border-l-4 border-green-500 text-green-700 p-4' : 'bg-red-100 border-l-4 border-red-500 text-red-700 p-4';
        let title = data.success ? 'Gelukt' : 'Whoops...';
        alertBox.innerHTML = `<p class="font-bold">${title}</p><p>${data.message}</p>`;
        form.parentNode.insertBefore(alertBox, form);
        setTimeout(() => alertBox.remove(), 5000);
        if (data.success) {
          form.reset();
        }
      })
      .catch(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Wachtwoord Wijzigen';
        const alertBox = document.createElement('div');
        alertBox.className = 'alert alert-error';
        alertBox.textContent = 'Er is een fout opgetreden bij het wijzigen van het wachtwoord. JSON response was not received.';
        form.parentNode.insertBefore(alertBox, form);
        setTimeout(() => alertBox.remove(), 5000);
      });
  });
}
