import { getProviders, getVideoId } from "../api/tmdb.endpoints.js";
import { getMovieReview } from "../api/omdb.endpoints.js";
import { useFavorites } from "./useFavorites.js";
import { remap } from "../util/remap.js";
import { colorGradient } from "../util/colorGradient.js";

const favorites = useFavorites();

document.addEventListener("DOMContentLoaded", async () => {
  const movieOverlay = document.querySelector("#movie-overlay");
  movieOverlay.addEventListener("click", (e) => {
    if (e.target === movieOverlay) {
      movieOverlay.classList.add("hidden");

      const movieContainer = document.querySelector("#movie-container");
      movieContainer.innerHTML = "";
    }
  });
});

export function useOverlay() {
  async function setMovie(movie) {
    const videoId = getVideoId(movie.id);
    const reviewScore = getMovieReview(movie.title);

    Promise.all([videoId, reviewScore]).then(([id, score]) => {
      _updateOverlay(movie, id, score);
    });
  }

  async function _updateOverlay(movie, id, score) {
    const embed = _createEmbed(movie, id);

    const separator = document.createElement("hr");
    separator.classList.add("my-2");

    const details = document.createElement("div");
    details.classList.add("flex", "flex-col", "px-4", "py-2", "gap-y-2");

    const title = document.createElement("h2");
    title.classList.add("text-2xl", "font-bold");
    title.textContent = movie.title;
    details.appendChild(title);

    const release = document.createElement("p");
    release.textContent = `Release Date: ${movie.release_date}`;
    release.classList.add("text-sm", "text-muted", "leading-none");
    details.appendChild(release);

    const description = document.createElement("p");
    description.textContent = movie.overview;
    details.appendChild(description);

    const scoreElement = _createScore(score);
    if (scoreElement) {
      details.appendChild(scoreElement);
    }

    const providers = await getProviders(movie.id);
    const providersElement = _createProviders(providers);
    if (providersElement) {
      details.appendChild(providersElement);
    }

    const movieOverlay = document.querySelector("#movie-overlay");
    const movieContainer = document.querySelector("#movie-container");
    movieContainer.innerHTML = "";
    movieContainer.appendChild(embed);
    movieContainer.appendChild(separator);
    movieContainer.appendChild(details);

    movieOverlay.classList.remove("hidden");
  }

  function _createEmbed(movie, id) {
    const embedContainer = document.createElement("div");
    embedContainer.classList.add("relative");

    const embed = document.createElement("iframe");
    embed.classList.add(
      "-left-[1px]",
      "-top-[1px]",
      "relative",
      "rounded-tl-[6px]",
      "rounded-tr-[6px]"
    );
    embed.src = `https://www.youtube.com/embed/${id}`;
    embed.title = movie.title;
    embed.width = 560;
    embed.height = 315;
    embed.allowFullscreen = true;
    embed.allow =
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
    embed.setAttribute("frameborder", 0);
    embedContainer.appendChild(embed);

    const favoriteButton = document.createElement("button");
    favoriteButton.classList.add(
      "absolute",
      "bottom-2",
      "right-2",
      "bg-primary",
      "text-white",
      "rounded-full",
      "w-8",
      "h-8",
      "hover:scale-110",
      "hover:text-yellow-400",
      "transition-all"
    );
    const favoriteStar = document.createElement("i");
    const isFavorited = favorites.isFavorite(movie);
    if (isFavorited) {
      favoriteStar.classList.add("fas", "fa-star", "text-yellow-400");
    } else {
      favoriteStar.classList.add("far", "fa-star");
    }
    favoriteButton.appendChild(favoriteStar);

    favoriteButton.addEventListener("click", (e) =>
      handleFavoriteClick(e, movie)
    );
    embedContainer.appendChild(favoriteButton);

    return embedContainer;
  }

  function _createScore(reviewScore) {
    if (reviewScore && reviewScore !== "N/A") {
      const review = document.createElement("div");
      review.classList.add("flex", "flex-col", "gap-y-2", "justify-center");

      const score = document.createElement("p");
      score.textContent = `IMDB Rating: ${reviewScore} out of 10`;
      score.classList.add("text-sm", "text-muted", "leading-none");
      review.appendChild(score);

      const scoreOutter = document.createElement("div");
      scoreOutter.classList.add(
        "h-3",
        "bg-primary",
        "w-full",
        "rounded-full",
        "overflow-hidden"
      );
      const scoreInner = document.createElement("div");
      const scoreFillRemap = remap(parseFloat(reviewScore), 0, 10, 0, 100);
      scoreInner.classList.add("h-full", `w-[${scoreFillRemap}%]`);

      const scoreRemap = remap(parseFloat(reviewScore), 0, 10, 0, 120);
      const backgroundColor = colorGradient(scoreRemap, 0, 120);
      scoreInner.style.background = backgroundColor;

      scoreOutter.appendChild(scoreInner);
      review.appendChild(scoreOutter);

      return review;
    }

    return undefined;
  }

  function _createProviders(providers) {
    if (providers.US) {
      const providerList = document.createElement("div");
      providerList.classList.add("flex", "gap-y-2", "flex-col");

      if (providers.US.buy && providers.US.buy.length > 0) {
        const buyList = document.createElement("div");
        buyList.classList.add(
          "flex",
          "gap-x-2",
          "justify-between",
          "py-2",
          "px-6",
          "bg-primary/10",
          "rounded-md"
        );

        const buyLabel = document.createElement("p");
        buyLabel.textContent = "Buy from:";
        buyLabel.classList.add("text-sm", "text-muted", "leading-none");
        providerList.appendChild(buyLabel);

        providers.US.buy.forEach((provider) => {
          const providerItem = document.createElement("img");
          providerItem.classList.add(
            "h-8",
            "w-8",
            "object-fill",
            "rounded-full"
          );
          providerItem.src = `https://image.tmdb.org/t/p/w500${provider.logo_path}`;
          buyList.appendChild(providerItem);
        });

        providerList.appendChild(buyList);
      }

      if (providers.US.rent && providers.US.rent.length > 0) {
        const rentList = document.createElement("div");
        rentList.classList.add(
          "flex",
          "gap-x-2",
          "justify-between",
          "py-2",
          "px-6",
          "bg-primary/10",
          "rounded-md"
        );

        const rentLabel = document.createElement("p");
        rentLabel.textContent = "Rent from:";
        rentLabel.classList.add("text-sm", "text-muted", "leading-none");
        providerList.appendChild(rentLabel);

        providers.US.rent.forEach((provider) => {
          const providerItem = document.createElement("img");
          providerItem.classList.add(
            "h-8",
            "w-8",
            "object-fill",
            "rounded-full"
          );
          providerItem.src = `https://image.tmdb.org/t/p/w500${provider.logo_path}`;
          rentList.appendChild(providerItem);
        });

        providerList.appendChild(rentList);
      }

      return providerList;
    }

    return undefined;
  }

  return { setMovie };
}

function handleFavoriteClick(e, movie) {
  let starIcon = undefined;
  if (e.target.tagName === "BUTTON") {
    starIcon = e.target.children[0];
  } else {
    starIcon = e.target;
  }

  const isFavorited = favorites.isFavorite(movie);
  if (isFavorited) {
    starIcon.classList.remove("fas", "fa-star", "text-yellow-400");
    starIcon.classList.add("far", "fa-star");
    favorites.removeFavorite(movie);
  } else {
    starIcon.classList.remove("far", "fa-star");
    starIcon.classList.add("fas", "fa-star", "text-yellow-400");
    favorites.addFavorite(movie);
  }
}
