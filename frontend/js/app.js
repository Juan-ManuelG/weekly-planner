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


    let conflicto=false;
    actividades.forEach(function(actividadExistente){
        if(actividadExistente.dia===nuevaActividad.dia){
            const nuevoInicio=parseInt(nuevaActividad.horaInicio);
            const nuevoFin=parseInt(nuevaActividad.horaFin);
        
            const inicioExistente=parseInt(actividadExistente.horaInicio);
            const finExistente=parseInt(actividadExistente.horaFin);

            if(nuevoInicio<finExistente && nuevoFin>inicioExistente){
                conflicto=true
            }
        }


    });

    if(!conflicto){
        actividades.push(nuevaActividad);
    }else{
        alert("No se puede agregar la actividad porque existe un conflicto de horario.");
    }
    

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
        const hora = parseInt(fila.querySelector("th").textContent);
        const inicio=parseInt(actividad.horaInicio);
        const fin=parseInt(actividad.horaFin);
        if (hora >= inicio && hora <= fin) {
            const celdas = fila.querySelectorAll("td");
            const indiceDia = dias.indexOf(actividad.dia);
            const celda = celdas[indiceDia];
                celda.textContent = actividad.actividad;
                celda.style.background=actividad.color;
        }
    });
});
