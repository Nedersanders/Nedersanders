// public/javascripts/profile-image-upload.js

export function initProfileImageUpload() {
  console.log('Initializing profile image upload...');
  const fileInput = document.getElementById('profileImage');
  if (!fileInput) {
    console.log('Profile image input not found');
    return;
  }
  console.log('Profile image input found:', fileInput);
  
  const form = fileInput.closest('form');
  if (!form) {
    console.log('Form not found');
    return;
  }
  console.log('Form found:', form);
  
  // Find the existing image or create a preview area
  let previewContainer = form.parentElement.querySelector('.mb-4.flex.justify-center');
  if (!previewContainer) {
    console.log('Standard preview container not found - creating one...');
    // Create a preview container above the form
    previewContainer = document.createElement('div');
    previewContainer.className = 'mb-4 flex justify-center';
    form.parentElement.insertBefore(previewContainer, form);
  }
  console.log('Using preview container:', previewContainer);
  
  let previewImg = previewContainer.querySelector('img');

  // Create preview image if not present
  if (!previewImg) {
    console.log('Creating new preview image...');
    previewImg = document.createElement('img');
    previewImg.className = 'w-32 h-32 rounded-full object-cover border-4 border-blue-200';
    previewImg.style.display = 'none';
    previewContainer.appendChild(previewImg);
  } else {
    console.log('Using existing image for preview:', previewImg);
  }

  fileInput.addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (file) {
      console.log('File selected:', file.name);
      const reader = new FileReader();
      reader.onload = function (evt) {
        previewImg.src = evt.target.result;
        previewImg.style.display = 'block';
        console.log('Preview updated');
        
        // Hide any existing placeholder
        const placeholder = previewContainer.querySelector('div');
        if (placeholder && placeholder !== previewImg) {
          placeholder.style.display = 'none';
        }
      };
      reader.readAsDataURL(file);
    }
  });

  form.addEventListener('submit', function (e) {
    console.log('Form submit event triggered');
    e.preventDefault();
    console.log('Default form submission prevented');
    const formData = new FormData(form);
    const submitBtn = form.querySelector('button[type="submit"]');
    
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Bezig met uploaden...';
    }

    fetch(form.action, {
      method: 'POST',
      body: formData,
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      }
    })
      .then(response => response.json())
      .then(data => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Upload Foto';
        }
        if (data.success && data.imageUrl) {
          previewImg.src = data.imageUrl;
          previewImg.style.display = 'block';
        }
        if (data.message) {
          alert(data.message);
        }
      })
      .catch(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Upload Foto';
        }
        alert('Er is een fout opgetreden bij het uploaden.');
      });
  });
}
