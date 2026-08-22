const activityForm = document.getElementById("activity-form");
const activitySubmit = document.getElementById("activity-submit");/*btn modal*/
const addActivity = document.getElementById("new-activity-btn");

let actividadEditandoId = null;
const actividadesGuardadas = localStorage.getItem("actividades")
const actividades = actividadesGuardadas
    ? JSON.parse(actividadesGuardadas)
    : [];

actividades.forEach(function (actividad) {
    console.log(actividad.actividad + ": " + actividad.dia, actividad.horaInicio + "-" + actividad.horaFin);
});


const tbody = document.querySelector("tbody");
const calendarioOriginal = tbody.innerHTML;

/*para limpiar/reconstruir*/
function restaurarCalendario() {
    tbody.innerHTML = calendarioOriginal;
}


function mostrarActividades() {

    restaurarCalendario();

    const filas = document.querySelectorAll("tbody tr");

    actividades.forEach(function (actividad) {

        filas.forEach(function (fila) {

            const hora = parseInt(
                fila.querySelector("th").textContent
            );

            const inicio = parseInt(actividad.horaInicio);
            const fin = parseInt(actividad.horaFin);
            const duracion = fin - inicio;

            if (hora > inicio && hora < fin) {

                const celda = fila.querySelector(
                    `[data-day="${actividad.dia}"]`
                );

                if (celda) {
                    celda.remove();
                }
            }

            if (hora === inicio) {

                const celda = fila.querySelector(
                    `[data-day="${actividad.dia}"]`
                );

                if (celda) {

                    celda.textContent = actividad.actividad;
                    celda.style.textAlign = "center";
                    celda.style.verticalAlign = "middle";
                    celda.rowSpan = duracion;
                    celda.style.background = actividad.color;
                    celda.dataset.id = actividad.id;

                    /* Botón eliminar */
                    const botonEliminar = document.createElement("button");

                    botonEliminar.textContent = "×";
                    botonEliminar.classList.add("btn-eliminar");
                    botonEliminar.title="Eliminar";
                    botonEliminar.addEventListener("click", function (event) {

                        event.stopPropagation();

                        const id = celda.dataset.id;

                        const indice = actividades.findIndex(
                            function (actividad) {
                                return actividad.id === id;
                            }
                        );

                        actividades.splice(indice, 1);

                        localStorage.setItem(
                            "actividades",
                            JSON.stringify(actividades)
                        );

                        mostrarActividades();
                    });

                    celda.appendChild(botonEliminar);

                    /* Click para editar */
                    celda.addEventListener("click", function () {

                        const id = celda.dataset.id;

                        actividadEditandoId = id;

                        const actividadSeleccionada =
                            actividades.find(function (actividad) {
                                return actividad.id === id;
                            });

                        console.log(actividadSeleccionada);

                        document.getElementById("activity-name").value =
                            actividadSeleccionada.actividad;

                        document.getElementById("activity-day").value =
                            actividadSeleccionada.dia;

                        document.getElementById("start-time").value =
                            actividadSeleccionada.horaInicio;

                        document.getElementById("end-time").value =
                            actividadSeleccionada.horaFin;

                        document.getElementById("activity-color").value =
                            actividadSeleccionada.color;

                        activitySubmit.textContent =
                            "Guardar cambios";

                        const modal =
                            document.getElementById("exampleModal");

                        const modalBootstrap =
                            bootstrap.Modal.getOrCreateInstance(modal);

                        modalBootstrap.show();
                    });
                }
            }
        });
    });
}


mostrarActividades();

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


addActivity.addEventListener("click", function () {

    actividadEditandoId = null;

    activityForm.reset();

    activitySubmit.textContent = "Confirmar actividad";

});


activityForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const actividad = activityForm.querySelector("#activity-name").value
    const dia = activityForm.querySelector("#activity-day").value
    const horaInicio = activityForm.querySelector("#start-time").value
    const horaFin = activityForm.querySelector("#end-time").value
    const color = activityForm.querySelector("#activity-color").value

    const nuevaActividad = {
        id: crypto.randomUUID(),
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
        if (actividadEditandoId && actividadExistente.id === actividadEditandoId) {
            return;
        }
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
        if (actividadEditandoId) {
            const indice = actividades.findIndex(function (actividad) {
                return actividad.id === actividadEditandoId
            });

            actividades[indice] = {
                id: actividadEditandoId,
                actividad: actividad,
                dia: dia,
                horaInicio: horaInicio,
                horaFin: horaFin,
                color: color
            };

        } else {
            actividades.push(nuevaActividad);
        }

        const actividadJSON = JSON.stringify(actividades);
        localStorage.setItem("actividades", actividadJSON);

        activityForm.reset();

        actividadEditandoId = null;

        activitySubmit.textContent = "Confirmar actividad";

        const modal = document.getElementById("exampleModal");
        const modalBootstrap = bootstrap.Modal.getOrCreateInstance(modal);

        modalBootstrap.hide();
        mostrarActividades()
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
// Detectar cambios de localStorage hechos desde OTRA pestaña
window.addEventListener("storage", function (event) {

    if (event.key === "actividades") {
        location.reload();
    }

});