export async function getYoutubeAuthentication(token) {
  return true;
}

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
