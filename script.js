const header = document.querySelector("[data-header]");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const updateHeader = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 12);
};

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

const revealElements = [...document.querySelectorAll(".reveal")];

if (reduceMotion) {
  revealElements.forEach((element) => element.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  revealElements.forEach((element) => revealObserver.observe(element));
}

const countElements = [...document.querySelectorAll("[data-count]")];

const formatCount = (value) => {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}k+`;
  }

  return `${value}+`;
};

const animateCount = (element) => {
  const target = Number(element.dataset.count || 0);

  if (reduceMotion || target === 0) {
    element.textContent = formatCount(target);
    return;
  }

  const duration = 1200;
  const start = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(target * eased);

    element.textContent = formatCount(current);

    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      element.textContent = formatCount(target);
    }
  };

  requestAnimationFrame(tick);
};

if (countElements.length > 0) {
  const countObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          countObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.45 }
  );

  countElements.forEach((element) => countObserver.observe(element));
}
