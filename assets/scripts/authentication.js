import { changeView, VIEWS } from "./viewManager.js";

const YOUTUBE_TOKEN = {
  _value: undefined,
  set value(token) {
    this.validateToken(token).then((isAuthenticated) => {
      if (isAuthenticated) {
        this._value = token;
        localStorage.setItem("youtube_api_token", token);
        AUTH.validateSession();
      }
    });
  },
  get value() {
    this.checkStoredToken();
    return this._value;
  },
  checkStoredToken() {
    const storedToken = localStorage.getItem("tmdb_api_token");
    if (this._value === undefined && storedToken !== null) {
      this.value = storedToken;
    }
  },
  async validateToken(token) {
    const isAuthenticated = await getYouTubeAuthentication(token);

    if (!isAuthenticated) {
      this.resetToken();
    }

    return isAuthenticated;
  },
  resetToken() {
    this._value = undefined;
    localStorage.removeItem("youtube_api_token");
    AUTH.validateSession();
  },
};

const TMDB_TOKEN = {
  _value: undefined,
  set value(token) {
    this.validateToken(token).then((isAuthenticated) => {
      if (isAuthenticated) {
        this._value = token;
        localStorage.setItem("tmdb_api_token", token);
        AUTH.validateSession();
      }
    });
  },
  get value() {
    this.checkStoredToken();
    return this._value;
  },
  checkStoredToken() {
    const storedToken = localStorage.getItem("tmdb_api_token");
    if (this._value === undefined && storedToken !== null) {
      this.value = storedToken;
    }
  },
  async validateToken(token) {
    const isAuthenticated = await getTMDBAuthentication(token);

    if (!isAuthenticated) {
      this.resetToken();
    }

    return isAuthenticated;
  },
  resetToken() {
    this._value = undefined;
    localStorage.removeItem("tmdb_api_token");
    AUTH.validateSession();
  },
};

export const AUTH = {
  YOUTUBE: YOUTUBE_TOKEN,
  TMDB: TMDB_TOKEN,

  resetAuth() {
    this.YOUTUBE.resetToken();
    this.TMDB.resetToken();
    this.validateSession();
  },
  validateSession() {
    if (this.YOUTUBE.value && this.TMDB.value) {
      changeView(VIEWS.HOME);
    } else {
      changeView(VIEWS.LOGIN);
    }
  },
};
AUTH.YOUTUBE.checkStoredToken();
AUTH.TMDB.checkStoredToken();

async function getYouTubeAuthentication(token) {
  return true;
}

async function getTMDBAuthentication(token) {
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
