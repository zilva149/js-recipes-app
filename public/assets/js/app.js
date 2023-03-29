const FavSectionContainer = document.getElementById("fav-section-container");
const btnScrollLeft = document.getElementById("btn-scroll-left");
const btnScrollRight = document.getElementById("btn-scroll-right");

btnScrollRight.addEventListener("click", () => {
  FavSectionContainer.scrollLeft += 300;
});

btnScrollLeft.addEventListener("click", () => {
  FavSectionContainer.scrollLeft -= 300;
});
