const $contenedor = document.getElementById(`cards-container`);

fetch("https://mindhub-xj03.onrender.com/api/amazing")
  .then((response) => response.json())
  .then((data) => {
    let events = data.events;
    let templateCard = "";

    function crearCard(card) {
      const cardNode = document.createElement("a");
      cardNode.href = `../pages/details/1.html?name=${card.name}`;
      cardNode.innerHTML = `<div class="card">
          <img
            src="${card.image}"
            alt="img"
          />
          <h3 class="card-title" >${card.name}</h3>
          <span>${card.category}</span>
          <span>${card.description}</span>
        </div>`;

      return cardNode;
    }

    function renderCards(cards) {
      templateCard = "";
      const currentDate = new Date();
      for (let card of cards) {
        const eventDate = new Date(card.date);
        if (eventDate < currentDate) {
          const cardNode = crearCard(card);
          $contenedor.appendChild(cardNode);
        }
      }
    }

    renderCards(events);

    const $searchInput = document.getElementById("search-input");
    $searchInput.addEventListener("input", () => {
      const value = $searchInput.value.toLowerCase().trim();
      const selectedCategories = Array.from(
        document.querySelectorAll("input[type=checkbox]:checked")
      ).map((input) => input.value);

      let filteredCards = events;
      if (selectedCategories.length > 0) {
        filteredCards = events.filter((card) => {
          return selectedCategories.includes(card.category);
        });
      }

      filteredCards = filteredCards.filter((card) => {
        return (
          card.category.toLowerCase().includes(value) ||
          card.name.toLowerCase().includes(value)
        );
      });

      $contenedor.innerHTML = "";
      renderCards(filteredCards);
    });

    const $categoriesContainer = document.getElementById(
      "categories-container"
    );

    // Obtener lista única de categorías de eventos
    const eventCategories = [...new Set(events.map((event) => event.category))];

    // Crear checkboxes para cada categoría
    for (let category of eventCategories) {
      const $checkbox = document.createElement("input");
      $checkbox.type = "checkbox";
      $checkbox.name = "category";
      $checkbox.value = category;

      const $label = document.createElement("label");
      $label.textContent = category;

      const $container = document.createElement("div");
      $container.classList.add("category-container");
      $container.appendChild($checkbox);
      $container.appendChild($label);

      $categoriesContainer.appendChild($container);

      // Add event listener to each checkbox
      $checkbox.addEventListener("change", () => {
        const selectedCategories = Array.from(
          $categoriesContainer.querySelectorAll("input[type=checkbox]:checked")
        ).map((input) => input.value);

        let filteredCards = events;
        if (selectedCategories.length > 0) {
          filteredCards = events.filter((card) => {
            return selectedCategories.includes(card.category);
          });
        }

        const value = $searchInput.value.toLowerCase().trim();

        filteredCards = filteredCards.filter((card) => {
          return (
            card.category.toLowerCase().includes(value) ||
            card.name.toLowerCase().includes(value)
          );
        });

        $contenedor.innerHTML = "";
        renderCards(filteredCards);
      });
    }
  })
  .catch((error) => console.error(error));
