// Main JavaScript file for Nedersanders.nl
(function() {
  'use strict';
  
  // Initialize when DOM is ready
  document.addEventListener('DOMContentLoaded', function() {
    console.log('Nedersanders.nl dev environment loaded successfully!');
    
    // Add easter egg for development
    const title = document.querySelector('h1');
    if (title) {
      let clickCount = 0;
      title.addEventListener('click', function() {
        clickCount++;
        if (clickCount === 5) {
          this.style.background = 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #ffeaa7)';
          this.style.webkitBackgroundClip = 'text';
          this.style.webkitTextFillColor = 'transparent';
          this.style.animation = 'rainbow 2s infinite';
          console.log('🎉 Easter egg activated! You found the rainbow mode!');
        }
      });
    }
    const rainbowButton = document.getElementById('ignore-event-button');
    if (rainbowButton) {
      rainbowButton.addEventListener('click', function() {
        toggleRainbowBarf();
      });
    }
  });
  
})();

// Function to enable rainbow barf effect
function toggleRainbowBarf() {
  const allElements = document.querySelectorAll('div');
  allElements.forEach(el => {
    if(el.classList.contains('rainbow-barf')) {
      el.classList.remove('rainbow-barf');
    }
    else {
      el.classList.add('rainbow-barf');
    }
  });
  console.log('🌈 Rainbow barf effect toggled!');
}