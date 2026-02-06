/**
 * Demo mínima para comprobar que JS carga y manipula DOM.
 */
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("btn");
  const status = document.getElementById("status");
  const count = document.getElementById("count");

  /** @type {number} */
  let clicks = 0;

  // Prueba inmediata: si esto cambia al cargar, JS está funcionando.
  status.textContent = "JS: cargado";
  status.classList.add("ok");

  btn.addEventListener("click", () => {
    clicks += 1;
    count.textContent = String(clicks);

    // Pequeña prueba extra: alternar texto del botón
    btn.textContent = clicks === 1 ? "¡Bien! Sigue..." : "Haz click (" + clicks + ")";
  });
});

// Fecha objetivo (YYYY-MM-DDTHH:MM:SS)
const targetDate = new Date('2026-05-01T18:00:00').getTime();

/**
 * Actualiza la cuenta atrás
 */
const updateCountdown = () => {
  const now = Date.now();
  const diff = targetDate - now;

  // Si ya pasó la fecha
  if (diff <= 0) {
    document.getElementById('countdown').textContent = '¡Tiempo finalizado!';
    clearInterval(interval);
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  document.getElementById('days').textContent = String(days).padStart(2, '0');
  document.getElementById('hours').textContent = String(hours).padStart(2, '0');
  document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
  document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
};

// Actualizar cada segundo
const interval = setInterval(updateCountdown, 1000);

// Ejecutar una vez al cargar
updateCountdown();

var swiper = new Swiper(".mySwiper", {
  effect: "cards",
  grabCursor: true,
});
