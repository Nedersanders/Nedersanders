// public/javascripts/profile-image-upload.js

document.addEventListener('DOMContentLoaded', function () {
  const fileInput = document.getElementById('profileImage');
  const form = fileInput.closest('form');
  const previewContainer = document.querySelector('.profile-image-container');
  let previewImg = previewContainer.querySelector('img');

  // Create preview image if not present
  if (!previewImg) {
    previewImg = document.createElement('img');
    previewImg.className = 'profile-image';
    previewImg.style.display = 'none';
    previewContainer.appendChild(previewImg);
  }

  fileInput.addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (evt) {
        previewImg.src = evt.target.result;
        previewImg.style.display = 'block';
        previewContainer.style.height = 'auto'; // Reset height to auto for new image
        previewContainer.innerHTML += '<small><b>Preview, press upload to upload</b></small>'; // Clear previous content
        // Hide placeholder if present
        const placeholder = previewContainer.querySelector('.profile-image-placeholder');
        if (placeholder) placeholder.style.display = 'none';
      };
      reader.readAsDataURL(file);
    }
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const formData = new FormData(form);
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Bezig met uploaden...';

    fetch(form.action, {
      method: 'POST',
      body: formData,
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      }
    })
      .then(response => response.json())
      .then(data => {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Upload Foto';
        if (data.success && data.imageUrl) {
          previewImg.src = data.imageUrl;
          previewImg.style.display = 'block';
        }
        if (data.message) {
          alert(data.message);
        }
      })
      .catch(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Upload Foto';
        alert('Er is een fout opgetreden bij het uploaden.');
      });
  });
});
