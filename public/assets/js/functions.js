export const pipe =
  (...fns) =>
  (x) =>
    fns.reduce((v, f) => f(v), x);

export const curry = (fn, arity = fn.length) => {
  return (function nexCurried(prevArgs) {
    return function curried(nextArg) {
      const args = [...prevArgs, nextArg];
      if (args.length >= arity) {
        return fn(...args);
      } else {
        return nexCurried(args);
      }
    };
  })([]);
};

export const debounce = (cb, delay = 1000) => {
  let timeout;

  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      cb(...args);
    }, delay);
  };
};

export const getDomElByID = (id) => document.getElementById(`${id}`);
export const getDomElBySel = (selector, el) => el.querySelector(`${selector}`);
export const getDomEls = (selector, el) => el.querySelectorAll(`${selector}`);

export const createDomEl = (el) => {
  el = document.createElement(el);
  return el;
};

export const addID = (id, el) => {
  el.id = id;
  return el;
};

export const addClass = (name, el) => {
  el.classList.add(name);
  return el;
};

export const removeClass = (name, el) => {
  el.classList.remove(name);
  return el;
};

export const hasClass = (name, el) => {
  return el.classList.contains(name);
};

export const getClosest = (selector, el) => {
  return el.closest(selector);
};

export const setAttr = (attr, value, el) => {
  el.setAttribute(attr, value);
  return el;
};

export const appendChild = (child, el) => {
  el.appendChild(child);
  return el;
};

export const removeChild = (child, el) => {
  el.removeChild(child);
  return el;
};

export const addContent = (content, el) => {
  el.innerHTML = content;
  return el;
};

export const on = (event, el, fn) => {
  el.addEventListener(event, fn);
};

export const isOverflown = (element) => {
  return (
    element.scrollHeight > element.clientHeight ||
    element.scrollWidth > element.clientWidth
  );
};

export const fetchRecipes = async (url) => {
  const resp = await fetch(url);
  const data = await resp.json();

  return data.meals;
};

export const createFavRecipe = async (id) => {
  const data = await fetchRecipes(
    "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id
  );

  const favRecipe = createDomEl("div");

  addClass("fav-recipe", favRecipe);
  addID(id, favRecipe);
  addContent(
    `
            <i class="btn-remove fa-solid fa-circle-xmark"></i>
            <div class="img">
              <img src="${data[0].strMealThumb}" alt="${data[0].strMeal}" />
            </div>
            <h6>${data[0].strMeal}</h6>`,
    favRecipe
  );

  const btnRemove = getDomElBySel(".btn-remove", favRecipe);

  on("click", btnRemove, (e) => {
    const fetchData = fetchFromLS();
    removeFromFav(id);
    removeFromRecipes(id);
    removeFromLS(id, fetchData);
  });

  return favRecipe;
};

export const appendFavRecipe = async (id) => {
  const favSectionContainer = getDomElByID("fav-section-container");
  const favRecipe = await createFavRecipe(id);

  appendChild(favRecipe, favSectionContainer);

  if (isOverflown(favSectionContainer)) {
    addClass("show", getDomElByID("btn-scroll-left"));
    addClass("show", getDomElByID("btn-scroll-right"));
  } else {
    removeClass("show", getDomElByID("btn-scroll-left"));
    removeClass("show", getDomElByID("btn-scroll-right"));
  }
};

export const removeFromFav = (id) => {
  const favSectionContainer = getDomElByID("fav-section-container");
  const favRecipes = favSectionContainer.children;

  for (const recipe of favRecipes) {
    if (recipe.id === id) {
      removeChild(recipe, getDomElByID("fav-section-container"));
    }
  }

  if (isOverflown(favSectionContainer)) {
    addClass("show", getDomElByID("btn-scroll-left"));
    addClass("show", getDomElByID("btn-scroll-right"));
  } else {
    removeClass("show", getDomElByID("btn-scroll-left"));
    removeClass("show", getDomElByID("btn-scroll-right"));
  }
};

export const removeFromRecipes = (id) => {
  const recipeOfTheDay = getDomElBySel(".recipe-of-the-day", document);

  if (recipeOfTheDay.id === id) {
    const btn = getDomElBySel(".fa-heart", recipeOfTheDay);

    removeClass("fa-solid", btn);
    addClass("fa-regular", btn);
  }

  const searchRecipes = getDomElByID("recipes-section").children;

  for (const child of searchRecipes) {
    if (child.id === id) {
      const btn = getDomElBySel(".fa-heart", child);

      removeClass("fa-solid", btn);
      addClass("fa-regular", btn);
    }
  }
};

// ****** LOCAL STORAGE ******

export const fetchFromLS = () => {
  const values = JSON.parse(localStorage.getItem("recipeIDs"));

  return values;
};

export const addToLS = (id, values) => {
  values.push(id);

  localStorage.setItem("recipeIDs", JSON.stringify(values));

  return values;
};

export const removeFromLS = (id, values) => {
  const newValues = values.filter((value) => value !== id);

  localStorage.setItem("recipeIDs", JSON.stringify(newValues));

  return values;
};

export const appendFavFromLS = (values) => {
  if (values) {
    for (const value of values) {
      appendFavRecipe(value);
    }
  }

  return values;
};
