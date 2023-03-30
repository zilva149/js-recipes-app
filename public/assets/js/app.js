// ******* FAVORITE SECTION SCROLL ********

const favSectionContainer = document.getElementById("fav-section-container");
const btnScrollLeft = document.getElementById("btn-scroll-left");
const btnScrollRight = document.getElementById("btn-scroll-right");

btnScrollRight.addEventListener("click", () => {
  favSectionContainer.scrollLeft += 300;
});

btnScrollLeft.addEventListener("click", () => {
  favSectionContainer.scrollLeft -= 300;
});

// ****** RECIPES ******

const apiUrlRandom = "https://www.themealdb.com/api/json/v1/1/random.php";
const apiUrlSearch = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
const apiUrlID = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";

const btnShowRandom = document.getElementById("btn-show-random");
const recipeOfTheDay = document.querySelector(".recipe-of-the-day");
const recipesSection = document.getElementById("recipes-section");
const searchInput = document.getElementById("search");

const debounce = (cb, delay = 1000) => {
  let timeout;

  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      cb(...args);
    }, delay);
  };
};

const fetchRecipes = async (url, text = "") => {
  const resp = await fetch(url + text);
  const data = await resp.json();

  return data.meals;
};

const appendSearch = debounce(async (term) => {
  const data = await fetchRecipes(apiUrlSearch, term);

  let HTML = "";

  if (term === "") {
    HTML += `
        <div class="empty-list">
            <span>Enter input to search for your favorite recipes.</span>
        </div>`;
  } else if (!data) {
    HTML += `
        <div class="empty-list">
            <span>No recipes found.</span>
        </div>`;
  } else {
    for (const recipe of data) {
      HTML += `
            <article class="recipe" id="${recipe.idMeal}">
                <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}" />
                <div class="recipe-footer">
                    <h5>${recipe.strMeal}</h5>
                    <i class="fa-regular fa-heart"></i>
                </div>
            </article>`;
    }
  }

  recipesSection.innerHTML = HTML;

  const favBtns = recipesSection.querySelectorAll(".fa-heart");

  favBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      if (e.currentTarget.classList.contains("fa-regular")) {
        const id = e.currentTarget.closest(".recipe").id;
        appendFav(id);
        addToLS(id);
        e.currentTarget.classList.remove("fa-regular");
        e.currentTarget.classList.add("fa-solid");
      } else {
        const id = e.currentTarget.closest(".recipe").id;
        removeFav(id);
        removeFromLS(id);
        e.currentTarget.classList.remove("fa-solid");
        e.currentTarget.classList.add("fa-regular");
      }
    });
  });
});

const appendRandom = async () => {
  let data = await fetchRecipes(apiUrlRandom);

  btnShowRandom.classList.add("hidden");
  recipeOfTheDay.classList.remove("hidden");

  recipeOfTheDay.id = data[0].idMeal;

  recipeOfTheDay.innerHTML = `
            <img src="${data[0].strMealThumb}" alt="${data[0].strMeal}" />
            <div class="recipe-footer">
              <h5>${data[0].strMeal}</h5>
              <i class="fa-regular fa-heart"></i>
            </div>`;

  const favBtns = recipeOfTheDay.querySelectorAll(".fa-heart");

  favBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      if (e.currentTarget.classList.contains("fa-regular")) {
        const id = e.currentTarget.closest(".recipe").id;
        appendFav(id);
        addToLS(id);
        e.currentTarget.classList.remove("fa-regular");
        e.currentTarget.classList.add("fa-solid");
      } else {
        const id = e.currentTarget.closest(".recipe").id;
        removeFav(id);
        removeFromLS(id);
        e.currentTarget.classList.remove("fa-solid");
        e.currentTarget.classList.add("fa-regular");
      }
    });
  });
};

btnShowRandom.addEventListener("click", () => {
  appendRandom();
});

searchInput.addEventListener("input", (e) => {
  appendSearch(e.currentTarget.value);
});

const appendFav = async (id) => {
  const data = await fetchRecipes(apiUrlID + id);

  const favRecipe = document.createElement("div");
  favRecipe.classList.add("fav-recipe");
  favRecipe.id = id;
  favRecipe.innerHTML = `
            <i class="btn-remove fa-solid fa-circle-xmark"></i>
            <div class="img">
              <img src="${data[0].strMealThumb}" alt="${data[0].strMeal}" />
            </div>
            <h6>${data[0].strMeal}</h6>`;

  const btnRemove = favRecipe.querySelector(".btn-remove");
  btnRemove.addEventListener("click", (e) => {
    removeFav(id);
    removeFromLS(id);
  });

  favSectionContainer.appendChild(favRecipe);
};

const removeFav = (id) => {
  const favRecipes = favSectionContainer.children;

  for (const recipe of favRecipes) {
    if (recipe.id === id) {
      favSectionContainer.removeChild(recipe);
    }
  }
};

// ****** LOCAL STORAGE ******

const fetchFromLS = () => {
  const values = JSON.parse(localStorage.getItem("recipeIDs"));

  if (values) {
    for (const value of values) {
      appendFav(value);
    }
  }
};

const addToLS = (id) => {
  let values;

  if (!localStorage.getItem("recipeIDs")) {
    values = [];
  } else {
    values = JSON.parse(localStorage.getItem("recipeIDs"));
  }

  values.push(id);

  localStorage.setItem("recipeIDs", JSON.stringify(values));
};

const removeFromLS = (id) => {
  let values = JSON.parse(localStorage.getItem("recipeIDs"));
  const newValues = values.filter((value) => value !== id);

  localStorage.setItem("recipeIDs", JSON.stringify(newValues));
};

window.addEventListener("DOMContentLoaded", () => {
  fetchFromLS();
});
