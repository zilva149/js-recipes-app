"use strict";

// ****** IMPORTS ******

import * as exports from "./functions.js";
Object.entries(exports).forEach(
  ([name, exported]) => (window[name] = exported)
);

const favSectionContainer = getDomElByID("fav-section-container");
const btnScrollLeft = getDomElByID("btn-scroll-left");
const btnScrollRight = getDomElByID("btn-scroll-right");

on("click", btnScrollRight, () => (favSectionContainer.scrollLeft += 300));
on("click", btnScrollLeft, () => (favSectionContainer.scrollLeft -= 300));

// ****** RECIPES ******

const btnShowRandom = getDomElByID("btn-show-random");
const recipeOfTheDay = getDomElBySel(".recipe-of-the-day", document);
const recipesSection = getDomElByID("recipes-section");
const searchInput = getDomElByID("search");

const appendSearch = debounce(async (term) => {
  const data = await fetchRecipes(
    "https://www.themealdb.com/api/json/v1/1/search.php?s=" + term
  );

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

  addContent(HTML, recipesSection);

  const recipes = getDomEls(".recipe", recipesSection);
  const favBtns = getDomEls(".fa-heart", recipesSection);

  const dataLS = fetchFromLS();

  for (const favID of dataLS) {
    for (const recipe of recipes) {
      if (recipe.id === favID) {
        const btn = recipe.querySelector(".fa-heart");
        btn.classList.remove("fa-regular");
        btn.classList.add("fa-solid");
      }
    }
  }

  favBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      if (e.currentTarget.classList.contains("fa-regular")) {
        const id = e.currentTarget.closest(".recipe").id;
        const fetchData = fetchFromLS();
        appendFavRecipe(id);
        addToLS(id, fetchData);
        e.currentTarget.classList.remove("fa-regular");
        e.currentTarget.classList.add("fa-solid");
      } else {
        const id = e.currentTarget.closest(".recipe").id;
        const fetchData = fetchFromLS();
        removeFromFav(id);
        removeFromLS(id, fetchData);
        e.currentTarget.classList.remove("fa-solid");
        e.currentTarget.classList.add("fa-regular");
      }
    });
  });
});

const appendRandom = async () => {
  let data = await fetchRecipes(
    "https://www.themealdb.com/api/json/v1/1/random.php"
  );

  btnShowRandom.classList.add("hidden");
  recipeOfTheDay.classList.remove("hidden");

  recipeOfTheDay.id = data[0].idMeal;

  recipeOfTheDay.innerHTML = `
            <img src="${data[0].strMealThumb}" alt="${data[0].strMeal}" />
            <div class="recipe-footer">
              <h5>${data[0].strMeal}</h5>
              <i class="fa-regular fa-heart"></i>
            </div>`;

  const favBtn = recipeOfTheDay.querySelector(".fa-heart");

  const dataLS = fetchFromLS();

  for (const favID of dataLS) {
    if (favID === data[0].idMeal) {
      favBtn.classList.remove("fa-regular");
      favBtn.classList.add("fa-solid");
    }
  }

  favBtn.addEventListener("click", async (e) => {
    if (e.currentTarget.classList.contains("fa-regular")) {
      const id = e.currentTarget.closest(".recipe").id;
      const fetchData = fetchFromLS();
      appendFavRecipe(id);
      addToLS(id, fetchData);
      e.currentTarget.classList.remove("fa-regular");
      e.currentTarget.classList.add("fa-solid");
    } else {
      const id = e.currentTarget.closest(".recipe").id;
      const fetchData = fetchFromLS();
      removeFromFav(id);
      removeFromLS(id, fetchData);
      e.currentTarget.classList.remove("fa-solid");
      e.currentTarget.classList.add("fa-regular");
    }
  });
};

on("click", btnShowRandom, () => {
  appendRandom();
});

on("input", searchInput, (e) => {
  appendSearch(e.currentTarget.value);
});

const removeFromFav = (id) => {
  const favRecipes = favSectionContainer.children;

  for (const recipe of favRecipes) {
    if (recipe.id === id) {
      favSectionContainer.removeChild(recipe);
    }
  }

  if (isOverflown(favSectionContainer)) {
    btnScrollLeft.classList.add("show");
    btnScrollRight.classList.add("show");
  } else {
    btnScrollLeft.classList.remove("show");
    btnScrollRight.classList.remove("show");
  }
};

const removeFromRecipes = (id) => {
  if (recipeOfTheDay.id === id) {
    const btn = recipeOfTheDay.querySelector(".fa-heart");

    btn.classList.remove("fa-solid");
    btn.classList.add("fa-regular");
  }

  const searchRecipes = recipesSection.children;

  for (const child of searchRecipes) {
    if (child.id === id) {
      const btn = child.querySelector(".fa-heart");

      btn.classList.remove("fa-solid");
      btn.classList.add("fa-regular");
    }
  }
};

on("DOMContentLoaded", window, () => {
  const fetchData = fetchFromLS();
  appendFavFromLS(fetchData);
});
