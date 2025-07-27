// Main JavaScript file for Nedersanders.nl
(function() {
  'use strict';
  
  // Initialize when DOM is ready
  document.addEventListener('DOMContentLoaded', function() {
    console.log('Nedersanders.nl dev environment loaded successfully!');
    
    // Add smooth scrolling for any anchor links
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth'
          });
        }
      });
    });
    
    // Add enhanced hover effects for contact buttons
    const buttons = document.querySelectorAll('.phone');
    buttons.forEach(button => {
      button.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px) scale(1.02)';
        this.style.boxShadow = '0 8px 25px rgba(52, 152, 219, 0.4)';
      });
      
      button.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
        this.style.boxShadow = '';
      });
    });
    
    // Add click tracking for analytics
    const trackableElements = document.querySelectorAll('[data-track]');
    trackableElements.forEach(element => {
      element.addEventListener('click', function() {
        const trackingData = this.dataset.track;
        console.log('Tracking event:', trackingData);
        
        // Send to analytics service (placeholder)
        if (window.gtag) {
          window.gtag('event', 'click', {
            'event_category': 'interaction',
            'event_label': trackingData
          });
        }
      });
    });
    
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
  });
  
})();
