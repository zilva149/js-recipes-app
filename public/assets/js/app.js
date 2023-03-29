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

const fetchRecipes = async (url, text = "") => {
  const resp = await fetch(url + text);
  const data = await resp.json();

  return data.meals;
};

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
