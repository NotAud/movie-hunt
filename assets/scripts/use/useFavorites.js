import { useViewManager } from "./useViewManager.js";
import { useOverlay } from "./useOverlay.js";

const viewManager = useViewManager();
const overlay = useOverlay();

const favorites = [];

const savedFavorites = localStorage.getItem("favorites");
if (savedFavorites) {
  favorites.push(...JSON.parse(savedFavorites));
}

export function useFavorites() {
  function addFavorite(movie) {
    favorites.push(movie);
    localStorage.setItem("favorites", JSON.stringify(favorites));

    if (viewManager.currentView() === viewManager.VIEWS.FAVORITES) {
      generateFavoriteList();
    }
  }

  function removeFavorite(movie) {
    const index = favorites.findIndex((m) => m.id === movie.id);
    if (index !== -1) {
      favorites.splice(index, 1);
      localStorage.setItem("favorites", JSON.stringify(favorites));
    }

    if (viewManager.currentView() === viewManager.VIEWS.FAVORITES) {
      generateFavoriteList();
    }
  }

  function isFavorite(movie) {
    return favorites.some((m) => m.id === movie.id);
  }

  function generateFavoriteList() {
    _generateFavoriteList(favorites);
  }

  return { addFavorite, removeFavorite, isFavorite, generateFavoriteList };
}

function _generateFavoriteList(favorites) {
  const favoritesList = document.querySelector("#favorites-container");
  favoritesList.innerHTML = "";

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
        e.stopPropagation();

        const favorites = useFavorites();
        favorites.removeFavorite(movie);
        row.remove();

        if (favoritesList.children.length === 0) {
          const emptyMessage = document.createElement("p");
          emptyMessage.textContent = "No favorites yet!";
          favoritesList.appendChild(emptyMessage);
        }
      });
      row.appendChild(removeButton);

      row.addEventListener("click", () => {
        overlay.setMovie(movie);
      });
      favoritesList.appendChild(row);
    });
  } else {
    const emptyMessage = document.createElement("p");
    emptyMessage.textContent = "No favorites yet!";
    favoritesList.appendChild(emptyMessage);
  }
}
