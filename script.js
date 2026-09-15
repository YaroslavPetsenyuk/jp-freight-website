const menuButton = document.querySelector('.menu-button');
const navigation = document.querySelector('.main-nav');
const toast = document.querySelector('.toast');

menuButton?.addEventListener('click', () => {
  const open = navigation.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});

document.querySelectorAll('.main-nav a').forEach(link => link.addEventListener('click', () => {
  navigation.classList.remove('open');
  menuButton?.setAttribute('aria-expanded', 'false');
}));

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3200);
}

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: .08 });

document.querySelectorAll('.reveal:not(.visible)').forEach(el => observer.observe(el));
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

document.querySelectorAll('.lead-form').forEach(form => {
  const submitButton = form.querySelector('[type="submit"]');
  const successMessage = form.querySelector('[data-fs-success]');
  const errorMessage = form.querySelector('[data-fs-error]');
  const defaultButtonText = submitButton?.textContent.trim() || 'Submit';
  let successTimer;

  form.addEventListener('submit', async event => {
    event.preventDefault();

    if (!form.reportValidity()) return;

    successMessage?.classList.remove('is-visible');
    clearTimeout(successTimer);
    errorMessage?.classList.remove('is-visible');
    if (errorMessage) errorMessage.textContent = '';

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Sending…';
    }

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });

      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        const message = result.errors?.map(error => error.message).join(' ') ||
          'We could not submit the form. Please try again or email info@jpfreightlogistics.com.';
        throw new Error(message);
      }

      form.reset();
      successMessage?.classList.add('is-visible');
      successMessage?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      successTimer = setTimeout(() => {
        successMessage?.classList.remove('is-visible');
      }, 30000);
    } catch (error) {
      if (errorMessage) {
        errorMessage.textContent = error.message ||
          'We could not submit the form. Please try again or email info@jpfreightlogistics.com.';
        errorMessage.classList.add('is-visible');
        errorMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = defaultButtonText;
      }
    }
  });
});

document.querySelectorAll('input[type="date"]').forEach(dateInput => {
  dateInput.addEventListener('click', () => {
    if (typeof dateInput.showPicker === 'function') {
      try {
        dateInput.showPicker();
      } catch (_) {
        // The browser's native date-field behavior remains available.
      }
    }
  });
});
