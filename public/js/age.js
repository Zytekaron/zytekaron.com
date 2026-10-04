import { calculateAge } from './calculate-age.js';

const ageElements = document.querySelectorAll('[data-birth-date]');
const updateAges = () => {
  if (document.hidden) return;
  const now = new Date();
  ageElements.forEach(element => {
    try {
      element.textContent = String(calculateAge(
        element.dataset.birthDate, now, element.dataset.ageTimeZone,
      ));
    } catch {
      // Keep the rendered value if the browser cannot calculate a replacement.
    }
  });
};

if (ageElements.length) {
  updateAges();
  // Refresh an open tab as well as a newly loaded static page.
  setInterval(updateAges, 60_000);
  document.addEventListener('visibilitychange', updateAges);
  window.addEventListener('pageshow', updateAges);
}
