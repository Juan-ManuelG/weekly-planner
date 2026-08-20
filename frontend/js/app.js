const activityForm = document.getElementById("activity-form");

const actividadesGuardadas = localStorage.getItem("actividades")
const actividades = actividadesGuardadas
    ? JSON.parse(actividadesGuardadas)
    : [];

actividades.forEach(function (actividad) {
    console.log(actividad.actividad + ": " + actividad.dia, actividad.horaInicio + "-" + actividad.horaFin);
});


const filas = document.querySelectorAll("tbody tr");

function mostrarActividades() {
    actividades.forEach(function (actividad) {
        filas.forEach(function (fila) {
            const hora = parseInt(fila.querySelector("th").textContent);
            const inicio = parseInt(actividad.horaInicio);
            const fin = parseInt(actividad.horaFin);
            const duracion = fin - inicio;
            if (hora > inicio && hora < fin) {
                const celda = fila.querySelector(`[data-day="${actividad.dia}"]`);

                if (celda) {
                    celda.remove();
                }
            }
            if (hora === inicio) {
                const celda = fila.querySelector(`[data-day="${actividad.dia}"]`);

                if (celda) {
                    celda.textContent = actividad.actividad;
                    celda.style.textAlign = "center";
                    celda.style.verticalAlign = "middle";
                    celda.rowSpan = duracion;
                    celda.style.background = actividad.color;
                }
            }

        });
    });
}

/*Alertas */
function mostrarAlerta(mensaje) {
    const alerta = document.getElementById("custom-alert");
    const mensajeAlerta = document.getElementById("alert-message");

    mensajeAlerta.textContent = mensaje;

    alerta.classList.add("show");
}

/*boton limpiar calendario*/
const botonLimpiar = document.getElementById("limpiar");

botonLimpiar.addEventListener("click", function () {
    localStorage.removeItem("actividades");
    location.reload();
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

    const nuevoInicio = parseInt(nuevaActividad.horaInicio);
    const nuevoFin = parseInt(nuevaActividad.horaFin);
    let conflictoHora = nuevoFin <= nuevoInicio;
    let conflicto = false;
    /*recorro el array actividades para validar horarios y evitar solapamientos*/
    actividades.forEach(function (actividadExistente) {
        if (actividadExistente.dia === nuevaActividad.dia) {
            const inicioExistente = parseInt(actividadExistente.horaInicio);
            const finExistente = parseInt(actividadExistente.horaFin);

            if (nuevoInicio < finExistente && nuevoFin > inicioExistente) {
                conflicto = true
            }
            if (nuevoFin <= nuevoInicio) {
                conflictoHora = true;
            }
        }
    });

    if (conflictoHora) {
        mostrarAlerta(
            "La hora de finalización debe ser posterior a la hora de inicio."
        );

    } else if (conflicto) {
        mostrarAlerta(
            "No se puede agregar la actividad porque existe un conflicto de horario."
        );
    } else {
        actividades.push(nuevaActividad);
        mostrarActividades();

        const actividadJSON = JSON.stringify(actividades);
        localStorage.setItem("actividades", actividadJSON);

        activityForm.reset();

        const modal = document.getElementById("exampleModal");
        const modalBootstrap = bootstrap.Modal.getOrCreateInstance(modal);

        modalBootstrap.hide();
    }


});

const alerta = document.getElementById("custom-alert");
const botonCerrar = document.getElementById("alert-close");
const botonOk = document.getElementById("alert-ok");

botonCerrar.addEventListener("click", function () {
    alerta.classList.remove("show");
});

botonOk.addEventListener("click", function () {
    alerta.classList.remove("show");
});
