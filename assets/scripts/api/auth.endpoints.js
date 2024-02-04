// Hit an endpoint for validating if the passed token is valid or not on both OMDB and TMDB
// Check if passed auth token is valid and return bool based on success
export async function getTMDBAuthentication(token) {
  const response = await fetch("https://api.themoviedb.org/3/authentication", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  return data.success;
}

// Check if passed auth token is valid and return bool based on success
export async function getOMDBAuthentication(token) {
  const BASE_URL = "http://www.omdbapi.com/";
  const requestUrl = `${BASE_URL}?t=avengers&apikey=${token}`;

  const response = await fetch(requestUrl);

  const data = await response.json();

  return data.Response === "True";
}
