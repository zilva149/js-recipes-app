"use strict";

// ****** IMPORTS ******

import * as exports from "./functions.js";
Object.entries(exports).forEach(
  ([name, exported]) => (window[name] = exported)
);

on("click", getDomElByID("btn-scroll-right"), () => {
  getDomElByID("fav-section-container").scrollLeft += 300;
});

on("click", getDomElByID("btn-scroll-left"), (e) => {
  getDomElByID("fav-section-container").scrollLeft -= 300;
});

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
