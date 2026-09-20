// ========================================
// EMMY'S CHOP-HOUSE
// JAVASCRIPT
// ========================================


// ================= MOBILE MENU =================

const menuToggle = document.getElementById("menuToggle");
const navbar = document.getElementById("navbar");

menuToggle.addEventListener("click", () => {
    navbar.classList.toggle("active");

    if (navbar.classList.contains("active")) {
        menuToggle.textContent = "✕";
    } else {
        menuToggle.textContent = "☰";
    }
});


// Close mobile menu after clicking a link

const navLinks = document.querySelectorAll(".navbar a");

navLinks.forEach(link => {

    link.addEventListener("click", () => {

        navbar.classList.remove("active");

        menuToggle.textContent = "☰";

    });

});


// ================= MENU CATEGORY FILTER =================

const categoryButtons = document.querySelectorAll(".category-btn");
const foodCards = document.querySelectorAll(".food-card");


categoryButtons.forEach(button => {

    button.addEventListener("click", () => {

        // Remove active state
        categoryButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        // Activate clicked button
        button.classList.add("active");

        const selectedCategory = button.textContent.trim();


        foodCards.forEach(card => {

            const cardCategory =
                card.querySelector(".food-category")
                    .textContent
                    .trim();


            if (
                selectedCategory === "All" ||
                selectedCategory === cardCategory
            ) {

                card.style.display = "block";

            } else {

                card.style.display = "none";

            }

        });

    });

});


// ================= CURRENT YEAR =================

// Automatically update copyright year if needed

const footerText = document.querySelector("footer p:last-child");

if (footerText) {

    const currentYear = new Date().getFullYear();

    footerText.textContent =
        `© ${currentYear} Emmy's Chop-House. All rights reserved.`;

}


// ================= IMAGE ERROR HANDLING =================

// If an image fails to load, avoid showing a broken image icon.

const images = document.querySelectorAll("img");

images.forEach(image => {

    image.addEventListener("error", () => {

        image.style.display = "none";

    });

});
