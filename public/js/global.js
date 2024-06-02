// Navbar Toggle Button Functionality for Mobile
document.addEventListener("DOMContentLoaded", function () {
    const navbarToggler = document.querySelector(".navbar-toggler");

    navbarToggler.addEventListener("click", function () {
        const navbarCollapse = document.querySelector(".navbar-collapse");

        navbarCollapse.classList.toggle("show");
    });
});
