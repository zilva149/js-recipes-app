// ******* FAVORITE SECTION SCROLL ********

const FavSectionContainer = document.getElementById("fav-section-container");
const btnScrollLeft = document.getElementById("btn-scroll-left");
const btnScrollRight = document.getElementById("btn-scroll-right");

btnScrollRight.addEventListener("click", () => {
  FavSectionContainer.scrollLeft += 300;
});

btnScrollLeft.addEventListener("click", () => {
  FavSectionContainer.scrollLeft -= 300;
});

// ****** APP ******

const apiUrlRandom = "https://www.themealdb.com/api/json/v1/1/random.php";
const apiUrlSearch = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
const apiUrlID = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";

const btnShowRandom = document.getElementById("btn-show-random");
const recipeOfTheDay = document.getElementById("recipe-of-the-day");
const recipesSection = document.getElementById("recipes-section");
const searchInput = document.getElementById("search");

const debounce = (cb, delay = 1500) => {
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

const appendSearchResult = debounce(async (term) => {
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
                    <i class="fa-regular fa-heart" title="add to favorites"></i>
                    <i
                    class="fa-solid fa-heart hidden"
                    title="remove from favorites"
                    ></i>
                </div>
            </article>`;
    }
  }

  recipesSection.innerHTML = HTML;
});

btnShowRandom.addEventListener("click", async () => {
  let data = await fetchRecipes(apiUrlRandom);
  data = data[0];

  btnShowRandom.classList.add("hidden");
  recipeOfTheDay.classList.remove("hidden");

  recipeOfTheDay.id = data.idMeal;

  recipeOfTheDay.innerHTML = `
            <img src="${data.strMealThumb}" alt="${data.strMeal}" />
            <div class="recipe-footer">
              <h5>${data.strMeal}</h5>
              <i class="fa-regular fa-heart" title="add to favorites"></i>
              <i
                class="fa-solid fa-heart hidden"
                title="remove from favorites"
              ></i>
            </div>`;
});

searchInput.addEventListener("input", (e) => {
  appendSearchResult(e.currentTarget.value);
});
