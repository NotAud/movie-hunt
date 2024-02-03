const VIEWS = {
  LOGIN: "login",
  HOME: "home",
  FAVORITES: "favorites",
  CAROUSEL: "carousel",
};

export function useViewManager() {
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

  function currentView() {
    const viewElements = document.querySelectorAll("[data-view]");
    return Array.from(viewElements).find((viewElement) => {
      return !viewElement.classList.contains("hidden");
    }).dataset.view;
  }

  return {
    currentView,
    VIEWS,
    change,
  };
}
