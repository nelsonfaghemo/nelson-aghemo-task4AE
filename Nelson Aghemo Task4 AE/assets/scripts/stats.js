function tabla(array, lugar) {
  const template = array.reduce((acc, act) => {
    return (
      acc +
      `
      <td>${act.categoria}</td>
      <td>${act.revenues} </td>
      <td>${act.porcentaje.toFixed(2)} %</td>
    </tr>
    `
    );
  }, "");
  lugar.innerHTML = template;
}

function imprimirTabla(array) {
  return `
                  
                  <table>
                  <thead>
                  <tr>
                      <th class="superth" colspan="3">Events Statistics</th>
                  </tr>
                  <tr>
                      <th>Events with the highest percentage of attendance</th>
                      <th>Events with the lowest percentage of attendance</th>
                      <th>Events with larger capacity</th>
                  </tr>
                  <tr>
                      <td id="evenmax"></td>
                      <td id="evenmin"></td>
                      <td id="evencap"></td>
                  </tr>
                  </thead>
                  <tr>
                      <th class="superth" colspan="3">Upcomming events statistics by category</th>
                  </tr>
                  <tr>
                      <td>Categories</td>
                      <td>Revenues</td>
                      <td>Percentage off attendance</td>
                  </tr>
                  <tbody id="up">
                  <tr>
                  
                  <tr>
                  </tbody>
                  <tr>
                      <th class="superth" colspan="3">Past Events statistic by category</th>
                  </tr>
                  <tr>
                      <td>Categories</td>
                      <td>Revenues</td>
                      <td>Percentage off attendance</td>
                  </tr>
                  <tbody id="past">
                 
                  </tbody>
              </table>
                  
                  `;
}
function eventMaxAssistance(array) {
  let mayorAsistencia = { nombre: "", asistencia: 0 };

  array.forEach((a) => {
    const asistencia = (a.assistance * 100) / a.capacity;
    if (asistencia > mayorAsistencia.asistencia) {
      mayorAsistencia.nombre = a.name;
      mayorAsistencia.asistencia = asistencia;
    }
  });

  return `-${mayorAsistencia.nombre} : ${mayorAsistencia.asistencia.toFixed(
    1
  )} %`;
}

function eventMinAssistance(array) {
  let menorAsistencia = { nombre: "", asistencia: 100 };

  array.forEach((a) => {
    const asistencia = (a.assistance * 100) / a.capacity;
    if (asistencia < menorAsistencia.asistencia) {
      menorAsistencia.nombre = a.name;
      menorAsistencia.asistencia = asistencia;
    }
  });

  return `-${menorAsistencia.nombre} : ${menorAsistencia.asistencia.toFixed(
    1
  )} %`;
}

function eventMaxCapacity(array) {
  let mayorCapacidad = { nombre: "", capacidad: 0 };

  array.forEach((a) => {
    const capacidad = a.capacity;
    if (capacidad > mayorCapacidad.capacidad) {
      mayorCapacidad.nombre = a.name;
      mayorCapacidad.capacidad = capacidad;
    }
  });

  return `${mayorCapacidad.nombre} : ${mayorCapacidad.capacidad.toFixed(
    0
  )} (capacity) `;
}

let todosLosEventos;
fetch("https://mindhub-xj03.onrender.com/api/amazing")
  .then((data) => data.json())
  .then((res) => {
    todosLosEventos = res.events;
    console.log(todosLosEventos);

    let fecha = res.currentDate;
    const pastEvent = todosLosEventos.filter((evento) => fecha > evento.date);
    const upcomingEvent = todosLosEventos.filter(
      (evento) => fecha < evento.date
    );

    const $tableConteiner = document.getElementById("tableContent");
    $tableConteiner.innerHTML = imprimirTabla(todosLosEventos);

    let upcomingStatics = upcomingEvent.map((e) => {
      return {
        categoria: e.category,
        revenues: e.price * e.estimate,
        porcentajeDeAsistencia: (e.estimate * 100) / e.capacity,
      };
    });

    let upcomingFilter = [
      ...new Set(upcomingEvent.map((evento) => evento.category)),
    ].map((categoria) => {
      let aux = upcomingStatics.filter(
        (elemento) => elemento.categoria == categoria
      );
      console.log(aux);
      let acumulado = {
        categoria: categoria,
        revenues: 0,
        porcentaje: 0,
        cantidad: 0,
      };
      console.log(acumulado);
      for (let iterator of aux) {
        acumulado.revenues += iterator.revenues;
        acumulado.porcentaje += iterator.porcentajeDeAsistencia;
        acumulado.cantidad++;
      }
      acumulado.porcentaje = acumulado.porcentaje / acumulado.cantidad;
      return acumulado;
    });
    console.log(upcomingFilter);

    let pastSratics = pastEvent.map((e) => {
      return {
        categoria: e.category,
        revenues: e.price * e.assistance,
        porcentajeDeAsistencia: (e.assistance * 100) / e.capacity,
      };
    });

    let pastEventFilter = [
      ...new Set(pastEvent.map((evento) => evento.category)),
    ].map((categoria) => {
      let aux = pastSratics.filter(
        (elemento) => elemento.categoria == categoria
      );
      console.log(aux);
      let acumulado = {
        categoria: categoria,
        revenues: 0,
        porcentaje: 0,
        cantidad: 0,
      };
      console.log(acumulado);
      for (let iterator of aux) {
        acumulado.revenues += iterator.revenues;
        acumulado.porcentaje += iterator.porcentajeDeAsistencia;
        acumulado.cantidad++;
      }
      acumulado.porcentaje = acumulado.porcentaje / acumulado.cantidad;
      return acumulado;
    });
    console.log(pastEventFilter);

    const up = document.getElementById("up");
    const pas = document.getElementById("past");
    const $evenmax = document.getElementById("evenmax");
    const $evenmin = document.getElementById("evenmin");
    const $evencap = document.getElementById("evencap");

    $evenmax.innerHTML = eventMaxAssistance(pastEvent);
    $evenmin.innerHTML = eventMinAssistance(pastEvent);
    $evencap.innerHTML = eventMaxCapacity(todosLosEventos);

    tabla(upcomingFilter, up);
    tabla(pastEventFilter, pas);
  })

  .catch((err) => console.log(err));
