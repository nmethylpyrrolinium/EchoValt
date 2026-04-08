/* =========================================================
   EchoVault — router.js
   Smooth page transitions + active nav highlight
========================================================= */

function highlightActiveNav() {
    const links = document.querySelectorAll(".nav-link");
    const current = window.location.pathname;

    links.forEach(link => {
        const href = link.getAttribute("href");
        if (href === current) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });
}

// Smooth fade-in for pages
function smoothPageEnter() {
    const page = document.body;
    page.style.opacity = 0;
    page.style.transition = "opacity 0.6s ease";
    requestAnimationFrame(() => {
        page.style.opacity = 1;
    });
      }
