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

export const setAttr = (attr, value, el) => {
  el.setAttribute(attr, value);
  return el;
};

export const appendChild = (child, el) => {
  el.appendChild(child);
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
  const favRecipe = await createFavRecipe(id);

  const favSectionContainer = getDomElByID("fav-section-container");
  const btnScrollLeft = getDomElByID("btn-scroll-left");
  const btnScrollRight = getDomElByID("btn-scroll-right");

  appendChild(favRecipe, favSectionContainer);

  if (isOverflown(favSectionContainer)) {
    addClass("show", btnScrollLeft);
    addClass("show", btnScrollRight);
  } else {
    removeClass("show", btnScrollLeft);
    removeClass("show", btnScrollRight);
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
