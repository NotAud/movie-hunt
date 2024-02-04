import { useViewManager } from "./useViewManager.js";
import { useOverlay } from "./useOverlay.js";

// Set up some necessary wrappers for our carousel
const viewManager = useViewManager();
const overlay = useOverlay();

// Handle leaving the carousel inside of the carousel view
document.addEventListener("DOMContentLoaded", async () => {
  const carouselExitButton = document.querySelector("#exit-carousel-button");
  carouselExitButton.addEventListener("click", () => {
    viewManager.change("home");
  });
});

// Create our wrapper function
export function useCarousel() {
  const carouselElement = document.querySelector("#movie-carousel");

  // Initialize variable related to what is displayed on the carousel
  let carouselItems = undefined;
  let currentIndex = 0;

  // Initialize variable to prevent multiple animations overlapping
  let isAnimating = false;

  // Function to set the carousel with a list of movies
  // Lets us reset the state when viewing the carousel
  function set(movieList) {
    currentIndex = 0;
    carouselElement.innerHTML = "";
    carouselItems = movieList;

    // Generate the first 3 movies in the carousel from our movie list
    for (let i = 0; i < 3; i++) {
      const newItem = createItem(carouselItems[i]);
      carouselElement.appendChild(newItem);
    }
  }

  // Generate the poster / movie element for the carousel
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

    // Movie poster image from TMDB
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

    // When a poster is clicked we can pop up our overlay with clicked movie
    movieContainer.addEventListener("click", (e) => {
      overlay.setMovie(movie);
    });

    // Return the movie element we just generated so that it can be added to the carousel
    return movieContainer;
  }

  // Handles updated / animating the carousel based on a direction
  // The only two directions are "next/right" and "prev/left"
  function updateCarousel(dir) {
    // Get our current first and last elements on the carousel
    const firstItem = carouselElement.firstElementChild;
    const lastItem = carouselElement.lastElementChild;

    // Handle our next/right animations
    // This technically means the carousel will be pushed to the left
    if (dir === "next") {
      // If we're at the end of the carousel we don't want to animate
      if (currentIndex + 3 >= carouselItems.length) {
        isAnimating = false;
        return;
      }

      // Create a new item to add to the end of the carousel
      const newItem = createItem(carouselItems[currentIndex + 3], true);

      // Hide our element and put it off screen
      newItem.style.opacity = 0;
      newItem.classList.add("absolute");

      // Increment our current index since we are moving up in the movie list
      currentIndex += 1;

      // Append our new movie to the carousel
      carouselElement.appendChild(newItem);

      // Some math to handle the animation by using bounding boxes
      const currElement = carouselElement.children[0];
      const currBounding = currElement.getBoundingClientRect();

      const nextElement = carouselElement.children[1];
      const nextBounding = nextElement.getBoundingClientRect();

      const lastElement = carouselElement.children[2];
      const lastBounding = lastElement.getBoundingClientRect();

      // Calc the distance between the left of the next element and the right of our current element
      const diff = nextBounding.left - currBounding.right;

      // Calc the offset for the animation to move as the carousel is moving
      const offset = diff + currBounding.width;

      // Set the new item off screen to the right based on our offset
      // This should match how far flexbox is styling the distance between our elements
      newItem.style.left = `${lastBounding.x + offset}px`;

      // Loop through our carousel elements
      for (let i = 0; i < carouselElement.children.length; i++) {
        // As we animate we want to remove our no transition rule
        // Semi-hacky fix for the animation to work properly
        carouselElement.children[i].classList.remove("transition-none");

        // If this is the last element (the one we added)
        if (i === 3) {
          // Set our new opacity and translate into the carousel using our offset
          newItem.style.opacity = 100;
          carouselElement.children[i].style.transform =
            "translateX(-" + offset + "px)";
          continue;
        }

        carouselElement.children[i].style.transform =
          "translateX(-" + offset + "px)";
      }

      // Create a timeout for when our animation finishes
      setTimeout(() => {
        // Loop through our carousel elements
        for (let i = 0; i < carouselElement.children.length; i++) {
          // Continuation of hacky fix, add back our no transition rule
          // Prevent any more animations from happening
          carouselElement.children[i].classList.add("transition-none");

          // Remove our position absolute and it should fix into its place
          // based on our flexbox position
          if (i === 3) {
            carouselElement.children[i].classList.remove("absolute");
          }

          // Remove our transform
          carouselElement.children[i].style.transform = "";
        }
        // Remove our first element as it should now be off screen
        firstItem.remove();

        // Animation should be fully completely, so allow a new one to start
        isAnimating = false;

        // Our timeout should match our transition times
        // Not perfect but mostly aligns the timings
      }, 150);
    } else {
      // Mostly same logic as above but for the previous direction
      // Moving the carousel the opposite direction
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

  // Handle our next button click
  // Animates the carousel to the right and appends the next movie
  const nextButton = document.querySelector("#carousel-next");
  nextButton.addEventListener("click", function (e) {
    if (!isAnimating) {
      isAnimating = true;
      updateCarousel("next");
    }
  });

  // Handle our previous button click
  // Animates the carousel to the left and prepends the previous movie
  const prevButton = document.querySelector("#carousel-prev");
  prevButton.addEventListener("click", function () {
    if (!isAnimating) {
      isAnimating = true;
      updateCarousel("prev");
    }
  });

  // Outside of this wrapper we only ever need to set a movielist
  return {
    set,
  };
}
