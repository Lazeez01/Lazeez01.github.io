// Timeline expand/collapse functionality
document.querySelectorAll('.toggle-details').forEach(button => {
  button.addEventListener('click', function() {
    const details = this.nextElementSibling;
    const isVisible = details.style.display !== 'none';

    if (isVisible) {
      details.style.display = 'none';
      this.textContent = 'View Details';
    } else {
      details.style.display = 'block';
      this.textContent = 'Hide Details';
      // Smooth scroll into view
      details.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });
});

// Animated counter for statistics
function animateCounter(element) {
  const target = parseInt(element.getAttribute('data-count'));
  const duration = 2000; // 2 seconds
  const increment = target / (duration / 16); // 60fps
  let current = 0;

  const counter = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target;
      clearInterval(counter);
    } else {
      element.textContent = Math.floor(current);
    }
  }, 16);
}

// Trigger counters when page loads or comes into view
window.addEventListener('load', () => {
  document.querySelectorAll('.stat-number').forEach(element => {
    // Check if element is in viewport
    const rect = element.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      animateCounter(element);
    }
  });
});

// Intersection Observer for lazy animation
const observerOptions = {
  threshold: 0.5
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && entry.target.classList.contains('stat-number')) {
      if (entry.target.textContent === '0') {
        animateCounter(entry.target);
      }
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.stat-number').forEach(element => {
  observer.observe(element);
});

// Smooth scroll animations for timeline items
const timelineItems = document.querySelectorAll('.timeline-item');
const timelineObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.classList.contains('in-view')) {
      entry.target.classList.add('in-view');
      timelineObserver.unobserve(entry.target); // Stop observing after animation
    }
  });
}, { threshold: 0.3 });

timelineItems.forEach(item => {
  timelineObserver.observe(item);
});

// Theme toggle (light/dark mode)
function initThemeToggle() {
  const themeToggle = document.getElementById('themeToggle');
  if (!themeToggle) return;

  const currentTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);

  themeToggle.addEventListener('click', () => {
    const theme = document.documentElement.getAttribute('data-theme');
    const newTheme = theme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);

    // Update toggle button icon/text
    updateThemeToggleUI(newTheme);
  });

  // Initialize toggle UI
  updateThemeToggleUI(currentTheme);
}

function updateThemeToggleUI(theme) {
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    if (theme === 'dark') {
      themeToggle.innerHTML = '☀️ Light Mode';
      themeToggle.setAttribute('aria-label', 'Switch to light mode');
    } else {
      themeToggle.innerHTML = '🌙 Dark Mode';
      themeToggle.setAttribute('aria-label', 'Switch to dark mode');
    }
  }
}

// Contact Form Handling
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = document.getElementById('submitBtn');
    const submitText = document.getElementById('submitText');
    const submitSpinner = document.getElementById('submitSpinner');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');

    // Hide previous messages
    successMessage.style.display = 'none';
    errorMessage.style.display = 'none';

    // Show loading state
    submitBtn.disabled = true;
    submitText.textContent = 'Sending...';
    submitSpinner.style.display = 'inline-block';

    try {
      // Formspree handles the submission
      const formData = new FormData(contactForm);

      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        // Show success message
        successMessage.style.display = 'block';
        successMessage.scrollIntoView({ behavior: 'smooth' });

        // Reset form
        contactForm.reset();

        // Reset button
        submitBtn.disabled = false;
        submitText.textContent = 'Message Sent! ✓';
        submitSpinner.style.display = 'none';

        // Auto-hide success message after 5 seconds
        setTimeout(() => {
          successMessage.style.display = 'none';
          submitText.textContent = 'Send Message';
        }, 5000);
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      // Show error message
      errorMessage.style.display = 'block';
      errorMessage.scrollIntoView({ behavior: 'smooth' });

      // Reset button
      submitBtn.disabled = false;
      submitText.textContent = 'Send Message';
      submitSpinner.style.display = 'none';

      console.error('Form error:', error);
    }
  });

  // Real-time validation feedback
  const inputs = contactForm.querySelectorAll('input, textarea');
  inputs.forEach(input => {
    input.addEventListener('blur', () => {
      if (!input.validity.valid && input.value) {
        input.classList.add('is-invalid');
      } else {
        input.classList.remove('is-invalid');
      }
    });

    input.addEventListener('input', () => {
      if (input.validity.valid || !input.value) {
        input.classList.remove('is-invalid');
      }
    });
  });
}

// Initialize theme on page load
document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initContactForm();
});
