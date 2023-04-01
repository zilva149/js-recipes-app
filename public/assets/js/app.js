"use strict";

// ****** IMPORTS ******

import * as exports from "./functions.js";
Object.entries(exports).forEach(
  ([name, exported]) => (window[name] = exported)
);

on(
  "click",
  getDomElByID("btn-scroll-right"),
  (e) => (e.currentTarget.parentElement.scrollLeft += 300)
);

on(
  "click",
  getDomElByID("btn-scroll-left"),
  () => (e.currentTarget.parentElement.scrollLeft -= 300)
);

// ****** RECIPES ******

const appendSearch = debounce(async (term) => {
  const data = await fetchRecipes(
    "https://www.themealdb.com/api/json/v1/1/search.php?s=" + term
  );

  const recipesSection = getDomElByID("recipes-section");

  let HTML = "";

  if (!data) {
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

  addContent(HTML, recipesSection);

  const recipes = getDomEls(".recipe", recipesSection);
  const favBtns = getDomEls(".fa-heart", recipesSection);

  const dataLS = fetchFromLS();

  for (const favID of dataLS) {
    for (const recipe of recipes) {
      if (recipe.id === favID) {
        const btn = getDomElBySel(".fa-heart", recipe);
        removeClass("fa-regular", btn);
        addClass("fa-solid", btn);
      }
    }
  }

  favBtns.forEach((btn) => {
    on("click", btn, (e) => {
      if (e.currentTarget.classList.contains("fa-regular")) {
        const id = e.currentTarget.closest(".recipe").id;
        const fetchData = fetchFromLS();

        appendFavRecipe(id);
        addToLS(id, fetchData);
        removeClass("fa-regular", e.currentTarget);
        addClass("fa-solid", e.currentTarget);
      } else {
        const id = e.currentTarget.closest(".recipe").id;
        const fetchData = fetchFromLS();

        removeFromFav(id);
        removeFromLS(id, fetchData);
        removeClass("fa-solid", e.currentTarget);
        addClass("fa-regular", e.currentTarget);
      }
    });
  });
});

const appendRandom = async () => {
  let data = await fetchRecipes(
    "https://www.themealdb.com/api/json/v1/1/random.php"
  );

  const recipeOfTheDay = getDomElBySel(".recipe-of-the-day", document);
  const btnShowRandom = getDomElByID("btn-show-random");

  addClass("hidden", btnShowRandom);
  removeClass("hidden", recipeOfTheDay);

  addID(data[0].idMeal, recipeOfTheDay);

  addContent(
    `
            <img src="${data[0].strMealThumb}" alt="${data[0].strMeal}" />
            <div class="recipe-footer">
              <h5>${data[0].strMeal}</h5>
              <i class="fa-regular fa-heart"></i>
            </div>`,
    recipeOfTheDay
  );

  const favBtn = getDomElBySel(".fa-heart", recipeOfTheDay);
  const dataLS = fetchFromLS();

  for (const favID of dataLS) {
    if (favID === data[0].idMeal) {
      removeClass("fa-regular", favBtn);
      addClass("fa-solid", favBtn);
    }
  }

  on("click", favBtn, async (e) => {
    const id = getClosest(".recipe", e.currentTarget).id;
    const fetchData = fetchFromLS();

    if (hasClass("fa-regular", e.currentTarget)) {
      appendFavRecipe(id);
      addToLS(id, fetchData);
      removeClass("fa-regular", e.currentTarget);
      addClass("fa-solid", e.currentTarget);
    } else {
      removeFromFav(id);
      removeFromLS(id, fetchData);
      removeClass("fa-solid", e.currentTarget);
      addClass("fa-regular", e.currentTarget);
    }
  });
};

on("click", getDomElByID("btn-show-random"), () => {
  appendRandom();
});

on("input", getDomElByID("search"), (e) => {
  appendSearch(e.currentTarget.value);
});

on("DOMContentLoaded", window, () => {
  const fetchData = fetchFromLS();
  appendFavFromLS(fetchData);
});
