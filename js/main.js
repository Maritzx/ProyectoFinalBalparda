document.addEventListener("DOMContentLoaded", () => {
  const formulario = document.querySelector("#formulario");
  const inputSueldo = document.querySelector("#inputSueldo");
  const selectCuotas = document.querySelector("#cuotas");
  const resultado = document.querySelector("#resultado");
  const btnVerHistorial = document.querySelector("#verHistorial");
  const historialDiv = document.querySelector("#historial");

  // Evento al enviar el formulario
  formulario.addEventListener("submit", (e) => {
    e.preventDefault();

    const sueldo = Number(inputSueldo.value.trim());
    const cuotas = Number(selectCuotas.value);
    const TNA = 45;
    const tasaMensual = TNA / 12 / 100;

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
    } else if (sueldo < 1500000) {
      monto = 10000000;
    } else {
      monto = 20000000;
    }

    const cuota = (monto * tasaMensual) / (1 - Math.pow(1 + tasaMensual, -cuotas));

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

    // Guardar nueva simulación al historial
    const nuevaSimulacion = {
      sueldo,
      cuotas,
      monto,
      cuota: Math.round(cuota),
      fecha: new Date().toLocaleString()
    };

    const historial = JSON.parse(localStorage.getItem("historialSimulaciones")) || [];
    historial.push(nuevaSimulacion);
    localStorage.setItem("historialSimulaciones", JSON.stringify(historial));
  });

  // Ver historial completo
  btnVerHistorial.addEventListener("click", () => {
    const historial = JSON.parse(localStorage.getItem("historialSimulaciones")) || [];

    if (historial.length === 0) {
      historialDiv.innerHTML = "<p class='text-red-400'>⚠️ No hay simulaciones guardadas aún.</p>";
      return;
    }

    historialDiv.innerHTML = ""; 

    historial.reverse().forEach((sim, index) => {
      const item = document.createElement("div");
      item.classList.add("bg-[#264532]", "p-4", "rounded", "shadow");

      item.innerHTML = `
        <p class="text-sm font-medium mb-1"> <strong>Simulación #${historial.length - index}</strong></p>
        <p> Sueldo: $${sim.sueldo.toLocaleString()}</p>
        <p> Monto aprobado: $${sim.monto.toLocaleString()}</p>
        <p> Cuotas: ${sim.cuotas} meses</p>
        <p> Valor cuota: $${sim.cuota.toLocaleString()}</p>
        <p> Fecha: ${sim.fecha}</p>
      `;

      historialDiv.appendChild(item);
    });
  });
});
