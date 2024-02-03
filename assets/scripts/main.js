import { useAuth } from "./use/useAuth.js";
import { useViewManager } from "./use/useViewManager.js";
import { useCarousel } from "./use/useCarousel.js";
import { useFavorites } from "./use/useFavorites.js";
import { getGenres, getMovieList } from "./api/tmdb.endpoints.js";

const auth = useAuth();
auth.tmdb.onSuccess(generateGenreList);

auth.omdb.onSuccess = () => {
  console.log("OMDB token is valid");
};

const viewManager = useViewManager();
const carousel = useCarousel();
const favorites = useFavorites();

// LOCAL STORAGE - FAVORITES
// COMMENTS
// CLEANUP

document.addEventListener("DOMContentLoaded", async () => {
  const logoButton = document.querySelector("#logo-button");
  logoButton.addEventListener("click", () => {
    if (auth.omdb.token && auth.tmdb.token) {
      viewManager.change(viewManager.VIEWS.HOME);
    } else {
      viewManager.change(viewManager.VIEWS.LOGIN);
    }
  });

  const homeButton = document.querySelector("#home-button");
  homeButton.addEventListener("click", () => {
    viewManager.change(viewManager.VIEWS.HOME);
  });

  const favoritesButton = document.querySelector("#favorites-button");
  favoritesButton.addEventListener("click", () => {
    favorites.generateFavoriteList();
    viewManager.change(viewManager.VIEWS.FAVORITES);
  });

  const loginButton = document.querySelector("#login-button");
  loginButton.addEventListener("click", () => {
    const omdbToken = document.querySelector("#omdb-token-input").value;
    auth.omdb.token = omdbToken;

    const tmdbToken = document.querySelector("#tmdb-token-input").value;
    auth.tmdb.token = tmdbToken;
  });

  const logoutButton = document.querySelector("#logout-button");
  logoutButton.addEventListener("click", () => {
    auth.logout();
  });

  const searchMoviesButton = document.querySelector("#search-movies-button");
  searchMoviesButton.addEventListener("click", async (e) => {
    const selectedGenres = document.querySelectorAll(".selected-genre");
    if (selectedGenres.length === 0) {
      console.log("No genres selected");
    }
    const genreIds = Array.from(selectedGenres)
      .map((genre) => genre.getAttribute("data-id"))
      .join(",");
    const movieList = await getMovieList(genreIds);

    carousel.set(movieList);

    viewManager.change(viewManager.VIEWS.CAROUSEL);
  });
});

async function generateGenreList() {
  const genreList = document.querySelector("#genre-list");

  if (genreList.children.length > 0) {
    return;
  }

  const genres = await getGenres();
  genres.forEach((genre) => {
    const genreElement = document.createElement("button");

    genreElement.classList.add(
      "rounded-lg",
      "border",
      "shadow-sm",
      "p-4",
      "hover:bg-primary/90",
      "hover:text-white"
    );
    genreElement.setAttribute("data-id", genre.id);
    genreElement.textContent = genre.name;

    genreElement.addEventListener("click", async (e) => {
      if (e.target.classList.contains("selected-genre")) {
        e.target.classList.remove("selected-genre");
      } else {
        e.target.classList.add("selected-genre");
      }
    });

    genreList.appendChild(genreElement);
  });
}
