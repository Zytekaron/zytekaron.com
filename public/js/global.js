// Navbar Toggle Button Functionality for Mobile
document.addEventListener("DOMContentLoaded", function () {
  var navbarToggler = document.querySelector(".navbar-toggler");

  navbarToggler.addEventListener("click", function () {
    var navbarCollapse = document.querySelector(".navbar-collapse");

    navbarCollapse.classList.toggle("show");
  });
});
