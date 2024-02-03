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

export async function getOMDBAuthentication(token) {
  const BASE_URL = "http://www.omdbapi.com/";
  const requestUrl = `${BASE_URL}?t=avengers&apikey=${token}`;

  const response = await fetch(requestUrl);

  const data = await response.json();

  return data.Response === "True";
}
