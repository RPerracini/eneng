document.addEventListener("DOMContentLoaded", () => {
  // Carrega o header
  fetch("header-nav.html")
    .then(response => response.text())
    .then(data => {
      document.getElementById("header-nav-container").innerHTML = data;
    });

  // Carrega o footer
  fetch("footer.html")
    .then(response => response.text())
    .then(data => {
      document.getElementById("footer-container").innerHTML = data;
    });
});
