import { useAuth } from "./use/useAuth.js";

// Use our auth manager to validate our tokens and run our onSuccess functions
const auth = useAuth();
auth.tmdb.onSuccess(generateGenreList);

auth.omdb.onSuccess = () => {
  console.log("OMDB token is valid");
};

document.addEventListener("DOMContentLoaded", async () => {
  // Register our login button
  const loginButton = document.querySelector("#login-button");
  loginButton.addEventListener("click", () => {
    // Set our tokens (Which get stored and validated automatically by our auth manager)
    const omdbToken = document.querySelector("#omdb-token-input").value;
    auth.omdb.token = omdbToken;

    const tmdbToken = document.querySelector("#tmdb-token-input").value;
    auth.tmdb.token = tmdbToken;
  });

  // Handle when we click the search button from the genres page
  const searchMoviesButton = document.querySelector("#search-movies-button");
  searchMoviesButton.addEventListener("click", async (e) => {
    const selectedGenres = document.querySelectorAll(".selected-genre");

    // Validate we selected any genres
    if (selectedGenres.length === 0) {
      console.log("No genres selected");
    }

    // Create the string we'll use for the movie endpoint which can take a list of
    // genres separated by a comma
    const genreIds = Array.from(selectedGenres)
      .map((genre) => genre.getAttribute("data-id"))
      .join(",");

    // Hit our movie endpoint with our genre list
    const movieList = await getMovieList(genreIds);

    // Use our carousel wrapper to set the movie list and generate accordingly
    carousel.set(movieList);

    // Update our view after the carousel is set
    viewManager.change(viewManager.VIEWS.CAROUSEL);
  });
});

// Function to generate our genre list with our tailwind styles
async function generateGenreList() {
  const genreList = document.querySelector("#genre-list");

  // Validate there are no genres already (no reason to rehit / generate the list)
  if (genreList.children.length > 0) {
    return;
  }

  // Get our genres from the API
  const genres = await getGenres();

  // Loop through our genres and create a button for each
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

    // Set our data-id attribute to the genre id so we can use it later
    genreElement.setAttribute("data-id", genre.id);
    genreElement.textContent = genre.name;

    // Add a click event listener to toggle the selected class (highlighting effect)
    genreElement.addEventListener("click", async (e) => {
      if (e.target.classList.contains("selected-genre")) {
        e.target.classList.remove("selected-genre");
      } else {
        e.target.classList.add("selected-genre");
      }
    });

    // Append our genre button to the list element
    genreList.appendChild(genreElement);
  });
}
