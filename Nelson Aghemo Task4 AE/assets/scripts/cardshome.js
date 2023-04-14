const contenedor = document.getElementById(`cards-container`);

fetch("https://mindhub-xj03.onrender.com/api/amazing")
  .then((response) => response.json())
  .then((data) => {
    let events = data.events;

    function crearCard(card) {
      const cardLink = document.createElement("a");
      cardLink.href = `./assets/pages/details/1.html?name=${card.name}`;

      const cardContainer = document.createElement("div");
      cardContainer.classList.add("card");
      cardLink.appendChild(cardContainer);

      const img = document.createElement("img");
      img.src = card.image;
      img.alt = "img";
      cardContainer.appendChild(img);

      const title = document.createElement("h3");
      title.classList.add("card-title");
      title.textContent = card.name;
      cardContainer.appendChild(title);

      const category = document.createElement("span");
      category.textContent = card.category;
      cardContainer.appendChild(category);

      const description = document.createElement("span");
      description.textContent = card.description;
      cardContainer.appendChild(description);

      return cardLink;
    }

    function renderCards(cards) {
      while (contenedor.firstChild) {
        contenedor.removeChild(contenedor.firstChild);
      }
      for (let card of cards) {
        contenedor.appendChild(crearCard(card));
      }
    }

    renderCards(events);

    const searchInput = document.getElementById("search-input");
    searchInput.addEventListener("input", () => {
      const value = searchInput.value.toLowerCase().trim();
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

      renderCards(filteredCards);
    });

    const categoriesContainer = document.getElementById("categories-container");

    const eventCategories = [...new Set(events.map((event) => event.category))];

    for (let category of eventCategories) {
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.name = "category";
      checkbox.value = category;

      const label = document.createElement("label");
      label.textContent = category;

      const container = document.createElement("div");
      container.classList.add("category-container");
      container.appendChild(checkbox);
      container.appendChild(label);

      categoriesContainer.appendChild(container);

      checkbox.addEventListener("change", () => {
        const selectedCategories = Array.from(
          categoriesContainer.querySelectorAll("input[type=checkbox]:checked")
        ).map((input) => input.value);

        let filteredCards = events;
        if (selectedCategories.length > 0) {
          filteredCards = events.filter((card) => {
            return selectedCategories.includes(card.category);
          });
        }

        const value = searchInput.value.toLowerCase().trim();

        filteredCards = filteredCards.filter((card) => {
          return (
            card.category.toLowerCase().includes(value) ||
            card.name.toLowerCase().includes(value)
          );
        });

        renderCards(filteredCards);
      });
    }
  })
  .catch((error) => console.error(error));
