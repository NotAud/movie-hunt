import { AUTH } from "./authentication.js";

document.addEventListener("DOMContentLoaded", async () => {
  const loginButton = document.querySelector("#login-button");
  loginButton.addEventListener("click", () => {
    const youtubeToken = document.querySelector("#youtube-token-input").value;
    AUTH.YOUTUBE.value = youtubeToken;

    const tmdbToken = document.querySelector("#tmdb-token-input").value;
    AUTH.TMDB.value = tmdbToken;

    AUTH.validateSession();
  });
});

// document.addEventListener("DOMContentLoaded", () => {
//   API_TOKEN.validateToken();

//   const loginButton = document.querySelector("#login-button");
//   loginButton.addEventListener("click", () => {
//     const token = document.querySelector("#token-input").value;
//     API_TOKEN.value = token;
//   });

//   const logoutButton = document.querySelector("#logout-button");
//   logoutButton.addEventListener("click", () => {
//     API_TOKEN.value = "";
//   });

//   const searchButton = document.querySelector("#search-button");
//   searchButton.addEventListener("click", async () => {
//     const searchValue = document.querySelector("#search-input").value;
//     if (!searchValue) {
//       return;
//     }

//     const response = await searchVideos(searchValue);
//     const videoCarousel = document.querySelector("#video-carousel");

//     response.items.forEach((video) => {
//       console.log(video);
//       const videoElement = document.createElement("iframe");
//       videoElement.setAttribute("width", "560");
//       videoElement.setAttribute("height", "315");
//       videoElement.setAttribute(
//         "src",
//         `https://www.youtube.com/embed/${video.id.videoId}`
//       );
//       //   videoElement.setAttribute("frameborder", "0");
//       //   videoElement.setAttribute(
//       //     "allow",
//       //     "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//       //   );
//       //   videoElement.setAttribute("allowfullscreen", "");
//       videoCarousel.appendChild(videoElement);
//     });

//     changeView(VIEWS.CAROUSEL);
//   });
// });

// async function searchVideos(name) {
//   const searchTitle = encodeURIComponent(`${name} song`);
//   const BASE_URL = "https://www.googleapis.com/youtube/v3/search";
//   const requestUrl = `${BASE_URL}?part=snippet&maxResults=3&q=${searchTitle}&type=video&videoCategoryId=10&key=${API_TOKEN.value}`;

//   const response = await fetch(requestUrl);
//   return await response.json();
// }
