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
