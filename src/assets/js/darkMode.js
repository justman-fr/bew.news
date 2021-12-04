// Toggle dark/light mode, inline JS to avoid any theme flicker
function toggleDarkLightMode(isInit) {
  // First time visitors
  if (!("theme" in localStorage)) {
    if (window.matchMedia("(prefers-color-scheme: light)").matches) {
      document.querySelector("html").classList.remove("dark");
      document.querySelector("html").classList.add("light");
      localStorage.theme = "light";
    } else {
      localStorage.theme = "dark";
    }
  } else {
    if (!isInit) {
      if (localStorage.theme === "light") {
        document.querySelector("html").classList.add("dark");
        document.querySelector("html").classList.remove("light");
        localStorage.theme = "dark";
      } else if (localStorage.theme === "dark") {
        document.querySelector("html").classList.add("light");
        document.querySelector("html").classList.remove("dark");
        localStorage.theme = "light";
      }
    } else {
      if (localStorage.theme === "light") {
        document.querySelector("html").classList.remove("dark");
        document.querySelector("html").classList.add("light");
      } else if (localStorage.theme === "dark") {
        document.querySelector("html").classList.remove("light");
        document.querySelector("html").classList.add("dark");
      }
    }
  }
}
toggleDarkLightMode(true);
