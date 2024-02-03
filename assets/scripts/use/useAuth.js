import {
  getTMDBAuthentication,
  getOMDBAuthentication,
} from "../api/auth.endpoints.js";
import { useViewManager } from "./useViewManager.js";

const viewManager = useViewManager();

class TokenProvider {
  constructor(name, validator) {
    this._name = name;
    this._token = undefined;
    this._validator = validator;

    this._onSuccess = undefined;
    this._onFailure = undefined;

    this.checkStoredToken();
  }

  onSuccess(callback) {
    this._onSuccess = () => {
      callback();
      validateAuth();
    };
  }

  onFailure(callback) {
    this._onFailure = () => {
      callback();
      validateAuth();
    };
  }

  set token(value) {
    this._validator(value).then((isValidated) => {
      if (isValidated) {
        this._token = value;
        localStorage.setItem(`${this._name}_api_token`, value);

        if (this._onSuccess) {
          this._onSuccess();
        }
      } else {
        this.resetToken();

        if (this._onFailure) {
          this._onFailure();
        }
      }
    });
  }

  get token() {
    return this._token;
  }

  resetToken() {
    this._token = undefined;
    localStorage.removeItem(`${this._name}_api_token`);
  }

  checkStoredToken() {
    const storedToken = localStorage.getItem(`${this._name}_api_token`);
    if (this._token === undefined && storedToken !== null) {
      this.token = storedToken;
    }
  }
}

const omdbToken = new TokenProvider("omdb", getOMDBAuthentication);
const tmdbToken = new TokenProvider("tmdb", getTMDBAuthentication);

export function useAuth() {
  function logout() {
    resetAuth();
    viewManager.change(viewManager.VIEWS.LOGIN);
  }

  return {
    logout,
    omdb: omdbToken,
    tmdb: tmdbToken,
  };
}

function resetAuth() {
  omdbToken.resetToken();
  tmdbToken.resetToken();

  const nav = document.querySelector("nav");
  nav.classList.add("hidden");
}

function validateAuth() {
  if (omdbToken.token && tmdbToken.token) {
    viewManager.change(viewManager.VIEWS.HOME);

    const nav = document.querySelector("nav");
    nav.classList.remove("hidden");
  } else {
    resetAuth();
    viewManager.change(viewManager.VIEWS.LOGIN);
  }
}
