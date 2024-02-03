import { useAuth } from "../use/useAuth.js";

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

export async function getMovieList(ids) {
  const response = await fetch(
    `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=${ids}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${auth.tmdb.token}`,
        "Content-Type": "application/json",
      },
    }
  );
  const data = await response.json();
  return data.results;
}

export async function getProviders(id) {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${id}/watch/providers`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${auth.tmdb.token}`,
        "Content-Type": "application/json",
      },
    }
  );
  const data = await response.json();
  return data.results;
}

export async function getVideoId(id) {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${id}/videos`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${auth.tmdb.token}`,
        "Content-Type": "application/json",
      },
    }
  );
  const data = await response.json();

  const video = data.results.find((video) => video.type === "Trailer");
  if (!video) {
    return data.results[0].key;
  }

  return video.key;
}
