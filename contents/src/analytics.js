const WORKER_URL = "https://baudo-analystic.totoyopacmam.workers.dev";
const VISIT_KEY = "baudo_visit_sent";

function formatNumber(num) {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, '') + "K";
  return num.toString();
}

function animateNumber(el, start, end, duration = 1500) {
  const startTime = performance.now();
  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeOut = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(start + (end - start) * easeOut);
    el.textContent = formatNumber(current);
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

async function trackVisit() {
  const el = document.getElementById("siteViews");
  if (!el) return;

  try {
    const today = new Date().toISOString().split('T')[0];
    const lastSent = localStorage.getItem(VISIT_KEY);

    if (lastSent === today) {
      const res = await fetch(`${WORKER_URL}/stats`);
      const data = await res.json();
      if (data.success) {
        animateNumber(el, 0, data.totalVisits);
      }
      return;
    }

    const res = await fetch(`${WORKER_URL}/visit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    if (data.success) {
      if (data.newVisit) {
        localStorage.setItem(VISIT_KEY, today);
      }
      animateNumber(el, 0, data.totalVisits);
    }

  } catch (err) {
    console.error("Analytics error:", err);
    el.textContent = "—";
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", trackVisit);
} else {
  trackVisit();
}
