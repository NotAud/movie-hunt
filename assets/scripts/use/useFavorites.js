import { useViewManager } from "./useViewManager.js";
import { useOverlay } from "./useOverlay.js";

// Set up some necessary wrappers for our favorites
const viewManager = useViewManager();
const overlay = useOverlay();

// Create our favorites array
// This should be consistent across the entire app
const favorites = [];

// Load our favorites from local storage if any exist
const savedFavorites = localStorage.getItem("favorites");
if (savedFavorites) {
  favorites.push(...JSON.parse(savedFavorites));
}

// Create our wrapper function
export function useFavorites() {
  // Function to add a movie to our favorites
  function addFavorite(movie) {
    // Push it to our favorites array
    favorites.push(movie);

    // Save/Sync the new movie to our local storage
    localStorage.setItem("favorites", JSON.stringify(favorites));

    // If we're on the favorites view, regenerate the list
    if (viewManager.currentView() === viewManager.VIEWS.FAVORITES) {
      generateFavoriteList();
    }
  }

  // Function to remove a movie from our favorites
  function removeFavorite(movie) {
    // Find the index of the movie in our favorites
    const index = favorites.findIndex((m) => m.id === movie.id);
    // If it exists, remove it
    if (index !== -1) {
      // Modifies the original array
      favorites.splice(index, 1);

      // Update our storage with the new list
      localStorage.setItem("favorites", JSON.stringify(favorites));
    }

    // If we're on the favorites view, regenerate the list
    if (viewManager.currentView() === viewManager.VIEWS.FAVORITES) {
      generateFavoriteList();
    }
  }

  // Function to check if a movie is in our favorites
  function isFavorite(movie) {
    return favorites.some((m) => m.id === movie.id);
  }

  // Function to generate our favorites list
  // Made this call a separate function to keep our wrapper semi-clean
  function generateFavoriteList() {
    _generateFavoriteList(favorites);
  }

  return { addFavorite, removeFavorite, isFavorite, generateFavoriteList };
}

// Function to generate our favorites list view
function _generateFavoriteList(favorites) {
  const favoritesList = document.querySelector("#favorites-container");
  // Reset the container
  favoritesList.innerHTML = "";

  // If we have favorites, generate the list
  if (favorites && favorites.length > 0) {
    favorites.forEach((movie) => {
      const row = document.createElement("button");
      row.classList.add(
        "flex",
        "items-center",
        "p-2",
        "border-b",
        "border-gray-200",
        "hover:bg-gray-100",
        "transition-colors",
        "rounded-t-md",
        "gap-x-4"
      );

      const titleElement = document.createElement("p");
      titleElement.textContent = movie.title;
      row.appendChild(titleElement);

      const releaseElement = document.createElement("p");
      releaseElement.textContent = movie.release_date;
      releaseElement.classList.add("text-muted", "ml-auto");
      row.appendChild(releaseElement);

      const removeButton = document.createElement("button");
      removeButton.textContent = "Remove";
      removeButton.classList.add(
        "rounded-lg",
        "bg-red-600",
        "text-white",
        "px-4",
        "py-2",
        "hover:bg-red-700",
        "transition-colors"
      );

      removeButton.addEventListener("click", (e) => {
        // Prevent the click from bubbling up to the row
        e.stopPropagation();

        // Remove the movie from our favorites and the shown list
        const favorites = useFavorites();
        favorites.removeFavorite(movie);
        row.remove();

        // If we don't have any favorites, show a message
        // Semi-hacky, but if you remove the last favorite this will show a message that it is now empty
        if (favoritesList.children.length === 0) {
          const emptyMessage = document.createElement("p");
          emptyMessage.textContent = "No favorites yet!";
          favoritesList.appendChild(emptyMessage);
        }
      });
      row.appendChild(removeButton);

      // Allow us to display the same overlay from the carousel
      // When a row is clicked
      row.addEventListener("click", () => {
        overlay.setMovie(movie);
      });
      favoritesList.appendChild(row);
    });
  } else {
    // If we don't have any favorites, show a message
    const emptyMessage = document.createElement("p");
    emptyMessage.textContent = "No favorites yet!";
    favoritesList.appendChild(emptyMessage);
  }
}
