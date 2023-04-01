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

export const isOverflown = (element) => {
  return (
    element.scrollHeight > element.clientHeight ||
    element.scrollWidth > element.clientWidth
  );
};

// ****** LOCAL STORAGE ******

export const fetchRecipes = async (url) => {
  const resp = await fetch(url);
  const data = await resp.json();

  return data.meals;
};

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
      appendFav(value);
    }
  }

  return values;
};
