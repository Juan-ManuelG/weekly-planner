const activityForm = document.getElementById("activity-form");

const actividadesGuardadas = localStorage.getItem("actividades")
const actividades = actividadesGuardadas
    ? JSON.parse(actividadesGuardadas)
    : [];

actividades.forEach(function (actividad) {
    console.log(actividad.actividad);
});




activityForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const actividad = activityForm.querySelector("#activity-name").value
    const dia = activityForm.querySelector("#activity-day").value
    const horaInicio = activityForm.querySelector("#start-time").value
    const horaFin = activityForm.querySelector("#end-time").value
    const color = activityForm.querySelector("#activity-color").value

    const nuevaActividad = {
        actividad: actividad,
        dia: dia,
        horaInicio: horaInicio,
        horaFin: horaFin,
        color: color
    };

    actividades.push(nuevaActividad);

    const actividadJSON = JSON.stringify(actividades);

    localStorage.setItem("actividades", actividadJSON);


    console.log(actividades)
});


const dias = [
    "lunes",
    "martes",
    "miercoles",
    "jueves",
    "viernes",
    "sabado",
    "domingo"
];


const filas = document.querySelectorAll("tbody tr");

actividades.forEach(function (actividad) {
    filas.forEach(function (fila) {
        const hora = fila.querySelector("th").textContent

        if (hora == actividad.horaInicio) {
            const celdas = fila.querySelectorAll("td");
            const indiceDia = dias.indexOf(actividad.dia);
            const celda = celdas[indiceDia];
            celda.textContent = actividad.actividad;
            celda.style.background=actividad.color;

        }
    });
});
