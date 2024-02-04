import { useAuth } from "../use/useAuth.js";

const auth = useAuth();

// Allows us to get our IMDB ratings for a movie
export async function getMovieReview(name) {
  const BASE_URL = "https://www.omdbapi.com/";
  const requestUrl = `${BASE_URL}?t=${encodeURIComponent(name)}&apikey=${
    auth.omdb.token
  }`;

  const response = await fetch(requestUrl);
  const data = await response.json();

  return data.imdbRating;
}
