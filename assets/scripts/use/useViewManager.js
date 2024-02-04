// To allow for the illusion of multiple pages we use a "View Manager"
// This conditionally allows us to have separate renders for each "page" of our app

// This is a simple object that holds our view names - Prevents mistakes when using in code
const VIEWS = {
  LOGIN: "login",
  HOME: "home",
  FAVORITES: "favorites",
  CAROUSEL: "carousel",
};

// Create our view manager wrapper
export function useViewManager() {
  // Function the handles swapping views
  // Hides any view that isn't the selected one based on a data attr and shows the selected one
  function change(viewName) {
    const viewElements = document.querySelectorAll("[data-view]");
    viewElements.forEach((viewElement) => {
      if (viewElement.dataset.view === viewName) {
        viewElement.classList.remove("hidden");
      } else {
        viewElement.classList.add("hidden");
      }
    });
  }

  // Function to get the current view
  function currentView() {
    const viewElements = document.querySelectorAll("[data-view]");
    return Array.from(viewElements).find((viewElement) => {
      return !viewElement.classList.contains("hidden");
    }).dataset.view;
  }

  // Return the values we want to expose externally
  return {
    currentView,
    VIEWS,
    change,
  };
}
