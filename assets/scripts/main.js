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
});
