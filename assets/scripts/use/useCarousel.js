import { useViewManager } from "./useViewManager.js";
import { useOverlay } from "./useOverlay.js";

const viewManager = useViewManager();
const overlay = useOverlay();

document.addEventListener("DOMContentLoaded", async () => {
  const carouselExitButton = document.querySelector("#exit-carousel-button");
  carouselExitButton.addEventListener("click", () => {
    viewManager.change("home");
  });
});

export function useCarousel() {
  const carouselElement = document.querySelector("#movie-carousel");

  let carouselItems = undefined;
  let currentIndex = 0;
  let isAnimating = false;

  function set(movieList) {
    currentIndex = 0;
    carouselElement.innerHTML = "";
    carouselItems = movieList;

    for (let i = 0; i < 3; i++) {
      const newItem = createItem(carouselItems[i]);
      carouselElement.appendChild(newItem);
    }
  }

  function createItem(movie) {
    const movieContainer = document.createElement("button");
    movieContainer.classList.add(
      "h-full",
      "shrink-0",
      "rounded-md",
      "overflow-hidden",
      "inline-block",
      "hover:scale-110",
      "transition-transform",
      "transition-all"
    );

    const moviePoster = document.createElement("img");
    moviePoster.classList.add(
      "object-fill",
      "h-full",
      "select-none",
      "max-w-fit"
    );
    moviePoster.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    moviePoster.setAttribute("draggable", false);

    movieContainer.appendChild(moviePoster);

    movieContainer.addEventListener("click", (e) => {
      overlay.setMovie(movie);
    });

    return movieContainer;
  }

  function updateCarousel(dir) {
    const firstItem = carouselElement.firstElementChild;
    const lastItem = carouselElement.lastElementChild;

    if (dir === "next") {
      if (currentIndex + 3 >= carouselItems.length) {
        isAnimating = false;
        return;
      }

      const newItem = createItem(carouselItems[currentIndex + 3], true);
      newItem.style.opacity = 0;
      newItem.classList.add("absolute");
      currentIndex += 1;

      carouselElement.appendChild(newItem);

      const currElement = carouselElement.children[0];
      const currBounding = currElement.getBoundingClientRect();

      const nextElement = carouselElement.children[1];
      const nextBounding = nextElement.getBoundingClientRect();

      const lastElement = carouselElement.children[2];
      const lastBounding = lastElement.getBoundingClientRect();

      const diff = nextBounding.left - currBounding.right;
      const offset = diff + currBounding.width;

      newItem.style.left = `${lastBounding.x + offset}px`;

      for (let i = 0; i < carouselElement.children.length; i++) {
        carouselElement.children[i].classList.remove("transition-none");

        if (i === 3) {
          newItem.style.opacity = 100;
          carouselElement.children[i].style.transform =
            "translateX(-" + offset + "px)";
          continue;
        }

        carouselElement.children[i].style.transform =
          "translateX(-" + offset + "px)";
      }

      setTimeout(() => {
        for (let i = 0; i < carouselElement.children.length; i++) {
          carouselElement.children[i].classList.add("transition-none");
          if (i === 3) {
            carouselElement.children[i].classList.remove("absolute");
          }
          carouselElement.children[i].style.transform = "";
        }
        firstItem.remove();
        isAnimating = false;
      }, 150);
    } else {
      if (currentIndex - 1 < 0) {
        isAnimating = false;
        return;
      }
      const newItem = createItem(carouselItems[currentIndex - 1]);
      newItem.style.opacity = 0;
      newItem.classList.add("absolute");
      currentIndex -= 1;

      carouselElement.prepend(newItem);

      const currElement = carouselElement.children[2];
      const currBounding = currElement.getBoundingClientRect();

      const nextElement = carouselElement.children[3];
      const nextBounding = nextElement.getBoundingClientRect();

      const firstElement = carouselElement.children[1];
      const firstBounding = firstElement.getBoundingClientRect();

      const diff = nextBounding.left - currBounding.right;
      const offset = diff + currBounding.width;

      newItem.style.left = `${firstBounding.x - offset}px`;

      for (let i = 0; i < carouselElement.children.length; i++) {
        carouselElement.children[i].classList.remove("transition-none");

        if (i === 0) {
          newItem.style.opacity = 100;
          carouselElement.children[i].style.transform =
            "translateX(" + offset + "px)";
          continue;
        }

        carouselElement.children[i].style.transform =
          "translateX(" + offset + "px)";
      }

      setTimeout(() => {
        for (let i = 0; i < carouselElement.children.length; i++) {
          carouselElement.children[i].classList.add("transition-none");
          if (i === 0) {
            carouselElement.children[i].classList.remove("absolute");
          }
          carouselElement.children[i].style.transform = "";
        }
        lastItem.remove();
        isAnimating = false;
      }, 150);
    }
  }

  const nextButton = document.querySelector("#carousel-next");
  nextButton.addEventListener("click", function (e) {
    if (!isAnimating) {
      isAnimating = true;
      updateCarousel("next");
    }
  });

  const prevButton = document.querySelector("#carousel-prev");
  prevButton.addEventListener("click", function () {
    if (!isAnimating) {
      isAnimating = true;
      updateCarousel("prev");
    }
  });

  return {
    set,
  };
}
