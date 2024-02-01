const VIEWS = {
  LOGIN: "login",
  HOME: "home",
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

  return {
    VIEWS,
    change,
  };
}
