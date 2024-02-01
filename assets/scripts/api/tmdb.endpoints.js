import { useAuth } from "../auth/authentication.js";

const auth = useAuth();

export async function getGenres() {
  const response = await fetch(
    "https://api.themoviedb.org/3/genre/movie/list",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${auth.tmdb.token}`,
        "Content-Type": "application/json",
      },
    }
  );
  const data = await response.json();
  return data.genres;
}
