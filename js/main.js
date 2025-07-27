document.addEventListener("DOMContentLoaded", () => {
  const formulario = document.querySelector("#formulario");
  const inputSueldo = document.querySelector("#inputSueldo");
  const selectCuotas = document.querySelector("#cuotas");
  const resultado = document.querySelector("#resultado");
  const btnVerSimulaciones = document.querySelector("#verSimulaciones");

  // Evento cuando se envía el formulario
  formulario.addEventListener("submit", (e) => {
    e.preventDefault();

    const sueldo = Number(inputSueldo.value.trim());
    const cuotas = Number(selectCuotas.value);
    const TNA = 45;
    const tasaMensual = TNA / 12 / 100;

    // Validación del sueldo ingresado
    if (!sueldo || sueldo < 0) {
      resultado.textContent = "⚠️ Por favor, ingresa un sueldo válido.";
      resultado.classList.remove("text-green-400");
      resultado.classList.add("text-red-400");
      return;
    }

    let monto = 0;

    if (sueldo < 800000) {
      resultado.textContent = "❌ CREDITO NO APROBADO. El sueldo mínimo requerido es de $800.000.";
      resultado.classList.remove("text-green-400");
      resultado.classList.add("text-red-400");
      return;
    } else if (sueldo >= 800000 && sueldo < 1500000) {
      monto = 10000000;
    } else {
      monto = 20000000;
    }

    // Cálculo de la cuota mensual
    const cuota = (monto * tasaMensual) / (1 - Math.pow(1 + tasaMensual, -cuotas));

    // Mensaje para mostrar en pantalla
    const textoResultado = `
✅ CREDITO APROBADO
Monto aprobado: $${monto.toLocaleString()}
TNA: ${TNA}%
Cuotas: ${cuotas} meses
Valor estimado de cada cuota: $${Math.round(cuota).toLocaleString()}
    `;

    resultado.textContent = textoResultado;
    resultado.classList.remove("text-red-400");
    resultado.classList.add("text-green-400");

    // Guardar la simulación en localStorage
    const simulacion = {
      sueldo,
      cuotas,
      monto,
      cuota: Math.round(cuota),
      fecha: new Date().toLocaleString()
    };

    localStorage.setItem("ultimaSimulacion", JSON.stringify(simulacion));
  });

  // Evento para mostrar la última simulación guardada
  btnVerSimulaciones.addEventListener("click", () => {
    const data = JSON.parse(localStorage.getItem("ultimaSimulacion"));

    if (data) {
      resultado.textContent = `
📌 Última simulación guardada:
🧾 Sueldo: $${data.sueldo.toLocaleString()}
📅 Cuotas: ${data.cuotas} meses
💰 Monto aprobado: $${data.monto.toLocaleString()}
📈 Cuota estimada: $${data.cuota.toLocaleString()}
🕒 Fecha: ${data.fecha}
      `;
      resultado.classList.remove("text-red-400");
      resultado.classList.add("text-green-400");
    } else {
      resultado.textContent = "⚠️ No hay ninguna simulación guardada todavía.";
      resultado.classList.remove("text-green-400");
      resultado.classList.add("text-red-400");
    }
  });
});
