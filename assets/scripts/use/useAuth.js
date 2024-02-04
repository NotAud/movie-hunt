import {
  getTMDBAuthentication,
  getOMDBAuthentication,
} from "../api/auth.endpoints.js";
import { useViewManager } from "./useViewManager.js";

// Use our view manager to create a "safe guard" for our validation states
const viewManager = useViewManager();

// Allows us to inject a custom validator for our tokens and manage them separately
class TokenProvider {
  // Set up some initial values for our tokens
  constructor(name, validator) {
    this._name = name;
    this._token = undefined;
    this._validator = validator;

    this._onSuccess = undefined;
    this._onFailure = undefined;

    // Check for a stored token on initialization
    this.checkStoredToken();
  }

  // Run our injected callback function if validation was successful
  onSuccess(callback) {
    this._onSuccess = () => {
      callback();
      validateAuth();
    };
  }

  // Run our injected callback function if validation was a failure
  // This is useful, but not required for our use case
  onFailure(callback) {
    this._onFailure = () => {
      callback();
      validateAuth();
    };
  }

  // When we set our token, run a validator and react accordingly
  set token(value) {
    this._validator(value).then((isValidated) => {
      // Our validator returned true, so we can set our token and store it
      if (isValidated) {
        this._token = value;
        localStorage.setItem(`${this._name}_api_token`, value);

        // If we have a success callback, run it
        if (this._onSuccess) {
          this._onSuccess();
        }
      } else {
        // Our validator was false, so we reset our tokens
        this.resetToken();

        // If we have a failure callback, run it
        if (this._onFailure) {
          this._onFailure();
        }
      }
    });
  }

  // Return our current token
  get token() {
    return this._token;
  }

  // Reset our token and remove it from local storage
  resetToken() {
    this._token = undefined;
    localStorage.removeItem(`${this._name}_api_token`);
  }

  // Check for a stored token and set it if it exists
  checkStoredToken() {
    const storedToken = localStorage.getItem(`${this._name}_api_token`);
    if (this._token === undefined && storedToken !== null) {
      this.token = storedToken;
    }
  }
}

// Create our token providers
// The two APIs we are using are OMDB and TMDB
const omdbToken = new TokenProvider("omdb", getOMDBAuthentication);
const tmdbToken = new TokenProvider("tmdb", getTMDBAuthentication);

// Create a wrapper for the auth functionality that we want to expose externally
export function useAuth() {
  // Allow our auth wrapper to handle logging out
  function logout() {
    resetAuth();
    viewManager.change(viewManager.VIEWS.LOGIN);
  }

  // Return the values we want to expost externally
  return {
    logout,
    omdb: omdbToken,
    tmdb: tmdbToken,
  };
}

// Fully invalidate our tokens and reset our view manager
function resetAuth() {
  omdbToken.resetToken();
  tmdbToken.resetToken();

  // When logged out we don't want to see our nav
  const nav = document.querySelector("nav");
  nav.classList.add("hidden");
}

// Validate both tokens are set and run our view manager
function validateAuth() {
  if (omdbToken.token && tmdbToken.token) {
    viewManager.change(viewManager.VIEWS.HOME);

    const nav = document.querySelector("nav");
    nav.classList.remove("hidden");
  } else {
    // One or both tokens are not set, so do a full reset
    resetAuth();
    viewManager.change(viewManager.VIEWS.LOGIN);
  }
}
