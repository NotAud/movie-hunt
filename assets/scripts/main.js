import { useAuth } from "./auth/authentication.js";
import { getGenres } from "./api/tmdb.endpoints.js";

const auth = useAuth();
auth.tmdb.onSuccess(generateGenreList);

auth.tmdb.onSuccess = () => {
  console.log("Youtube token is valid");
};

document.addEventListener("DOMContentLoaded", async () => {
  const loginButton = document.querySelector("#login-button");
  loginButton.addEventListener("click", () => {
    const youtubeToken = document.querySelector("#youtube-token-input").value;
    auth.youtube.token = youtubeToken;

    const tmdbToken = document.querySelector("#tmdb-token-input").value;
    auth.tmdb.token = tmdbToken;
  });
});

async function generateGenreList() {
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

    document.querySelector("#genre-list").appendChild(genreElement);
  });
}

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
