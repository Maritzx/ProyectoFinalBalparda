// ELEMENTOS DEL DOM
const formulario = document.querySelector("#formulario");
const inputSueldo = document.querySelector("#inputSueldo");
const selectCuotas = document.querySelector("#cuotas");
const btnVerHistorial = document.querySelector("#verHistorial");
const historialDiv = document.querySelector("#historial");

//  Envío del formulario
formulario.addEventListener("submit", async (e) => {
  e.preventDefault();

  const sueldo = Number(inputSueldo.value.trim());
  const cuotas = Number(selectCuotas.value);

  if (!esSueldoValido(sueldo)) {
    mostrarAlertaError("⚠️ Por favor, ingresa un sueldo válido.");
    return;
  }

  const monto = calcularMonto(sueldo);
  if (monto === 0) {
    mostrarAlertaError("❌ CRÉDITO NO APROBADO. El sueldo mínimo requerido es de $800.000.");
    return;
  }

  const TNA = await obtenerTNA();
  if (!TNA) {
    mostrarAlertaError("❌ Error al obtener la tasa de interés.");
    return;
  }

  const cuota = calcularCuota(monto, cuotas, TNA);

  mostrarAlertaExito(monto, cuotas, TNA, cuota);
  guardarSimulacion(sueldo, monto, cuotas, cuota);
});

// Ver historial
btnVerHistorial.addEventListener("click", mostrarHistorial);

// FUNCIONES
function esSueldoValido(sueldo) {
  return sueldo && sueldo > 0;
}

function calcularMonto(sueldo) {
  if (sueldo < 800000) return 0;
  if (sueldo < 1500000) return 10000000;
  return 20000000;
}

function calcularCuota(monto, cuotas, TNA) {
  const tasaMensual = TNA / 12 / 100;
  return (monto * tasaMensual) / (1 - Math.pow(1 + tasaMensual, -cuotas));
}

async function obtenerTNA() {
  try {
    const res = await fetch("https://68a0b4026e38a02c5819756f.mockapi.io/tasas");
    const data = await res.json();
    return data[0].TNA;
  } catch {
    return null;
  }
}

function guardarSimulacion(sueldo, monto, cuotas, cuota) {
  const simulacion = {
    sueldo,
    monto,
    cuotas,
    cuota: Math.round(cuota),
    fecha: new Date().toLocaleString()
  };
  const historial = JSON.parse(localStorage.getItem("historialSimulaciones")) || [];
  historial.push(simulacion);
  localStorage.setItem("historialSimulaciones", JSON.stringify(historial));
}

function mostrarHistorial() {
  const historial = JSON.parse(localStorage.getItem("historialSimulaciones")) || [];
  historialDiv.innerHTML = "";

  if (historial.length === 0) {
    historialDiv.innerHTML = "<p class='text-red-400'>⚠️ No hay simulaciones guardadas aún.</p>";
    return;
  }

  historial.reverse().forEach((sim, index) => {
    const item = document.createElement("div");
    item.classList.add("bg-[#264532]", "p-4", "rounded", "shadow");

    item.innerHTML = `
      <p class="text-sm font-medium mb-1"><strong>Simulación #${historial.length - index}</strong></p>
      <p>Sueldo: $${sim.sueldo.toLocaleString()}</p>
      <p>Monto aprobado: $${sim.monto.toLocaleString()}</p>
      <p>Cuotas: ${sim.cuotas} meses</p>
      <p>Valor cuota: $${sim.cuota.toLocaleString()}</p>
      <p>Fecha: ${sim.fecha}</p>
    `;
    historialDiv.appendChild(item);
  });
}

// FUNCIONES con SweetAlert2
function mostrarAlertaError(mensaje) {
  Swal.fire({
    icon: "error",
    title: "¡Atención!",
    text: mensaje,
    confirmButtonColor: "#d33"
  });
}

function mostrarAlertaExito(monto, cuotas, TNA, cuota) {
  Swal.fire({
    icon: "success",
    title: "✅ CRÉDITO APROBADO",
    html: `
      <p><strong>Monto aprobado:</strong> $${monto.toLocaleString()}</p>
      <p><strong>TNA:</strong> ${TNA}%</p>
      <p><strong>Cuotas:</strong> ${cuotas} meses</p>
      <p><strong>Valor estimado de cada cuota:</strong> $${Math.round(cuota).toLocaleString()}</p>
    `,
    confirmButtonColor: "#3085d6"
  });
}
