const $detailContenedor = document.getElementById(`details-container`);
let urlParams = location.search;
let params = new URLSearchParams(urlParams);
let id = params.get("name");

fetch("https://mindhub-xj03.onrender.com/api/amazing")
  .then((response) => response.json())
  .then((data) => {
    const datosDetail = data.events;
    let detailFiltrado = datosDetail.find((card) => card.name === id);
    pintarDetails(detailFiltrado);
  })
  .catch((error) => console.error(error));

function pintarDetails(card) {
  let detail = "";
  const currentDate = new Date(); // fecha actual
  const eventDate = new Date(card.date); // fecha del evento
  const assistanceText = eventDate < currentDate ? "Assistance " : "estimate "; // texto a mostrar
  detail = `<img src="${card.image}" alt="${card.name}" />
        <div>
          <h3>${card.name}</h3>
          <p>Date: ${card.date}</p>
          <p>Category: ${card.category}</p>

          <span>${card.description}</span>

          <p>Place: ${card.place}</p>
          <p>Capacity: ${card.capacity}</p>
          <p>${assistanceText}: ${card.assistance}</p>
          <p>Price: $${card.price}</p>
        </div>`;
  $detailContenedor.innerHTML = detail;
}
