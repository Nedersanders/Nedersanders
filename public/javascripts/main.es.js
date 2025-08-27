// Main JavaScript file for Nedersanders.nl - ES Module version
"use strict";

function removeAppliedThemes(themeList) {
  for (let i = 0; i < themeList.length; i++) {
    document.body.classList.remove(themeList[i]);
  }
}

function checkThemes() {
  let availableThemes = ["light", "dark"];
  let currentTheme = localStorage.getItem("theme") || "light";
  let localStorageThemeOveride = false;
  if (
    localStorage.getItem("theme") &&
    availableThemes.includes(currentTheme)
  ) {
    localStorageThemeOveride = true;
  }
  // Check if the browser supports prefers-color-scheme
  if (window.matchMedia) {
    // Check the user's preferred color scheme
    const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");
    if (darkModeQuery.matches) {
      // User prefers dark mode
      console.log("Dark mode is preferred by the user");
      // If no localStorage override, set to dark
      if (!localStorageThemeOveride) {
        currentTheme = "dark";
      }
    } else {
      // User prefers light mode
      console.log("Light mode is preferred by the user");
      // If no localStorage override, set to light
      if (!localStorageThemeOveride) {
        currentTheme = "light";
      }
    }
    // Apply the theme
    removeAppliedThemes(availableThemes);
    document.body.classList.add(currentTheme);
  } else {
    console.warn(
      "Browser does not support prefers-color-scheme, defaulting to light mode"
    );
    // Fallback to light mode if prefers-color-scheme is not supported
    removeAppliedThemes(availableThemes);
    document.body.classList.add("light");
  }
}

// Export functions for use by other modules
export { checkThemes, removeAppliedThemes };

// Also expose globally for backward compatibility
window.checkThemes = checkThemes;
window.removeAppliedThemes = removeAppliedThemes;

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", function () {
  checkThemes();
});
