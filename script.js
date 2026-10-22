
"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const whatsappNumber = document.body.dataset.whatsapp;
    const searchInput = document.getElementById("product-search");
    const filterButtons = document.querySelectorAll(".filter-btn");
    const productCards = document.querySelectorAll(".product-card");
    const noResults = document.getElementById("no-results");

    let activeCategory = "All";

    // ------------------------------------
    // FILTER PRODUCTS
    // ------------------------------------

    function filterProducts() {
        const query = searchInput.value.trim().toLowerCase();
        let visibleCount = 0;

        productCards.forEach(card => {
            const name = card.dataset.name || "";
            const category = card.dataset.category || "";

            const matchesSearch =
                name.includes(query) ||
                category.toLowerCase().includes(query);

            const matchesCategory =
                activeCategory === "All" ||
                category === activeCategory;

            const visible = matchesSearch && matchesCategory;

            card.hidden = !visible;

            if (visible) {
                visibleCount++;
            }
        });

        noResults.hidden = visibleCount !== 0;
    }

    searchInput.addEventListener("input", filterProducts);

    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            activeCategory = button.dataset.category;

            filterButtons.forEach(item => {
                const isActive = item === button;

                item.classList.toggle("active", isActive);
                item.setAttribute(
                    "aria-pressed",
                    String(isActive)
                );
            });

            filterProducts();
        });
    });

    // ------------------------------------
    // WHATSAPP PRODUCT ENQUIRIES & ORDERS
    // ------------------------------------

    document.querySelectorAll(".whatsapp-btn").forEach(button => {
        button.addEventListener("click", () => {
            const card = button.closest(".product-card");

            if (!card) {
                return;
            }

            const productName = button.dataset.productName;
            const price = Number(button.dataset.productPrice);
            const colour = button.dataset.productColor;

            const sizeSelect = card.querySelector(".size-select");
            const size = sizeSelect ? sizeSelect.value : "Not selected";

            if (!/^\d{10,15}$/.test(whatsappNumber || "")) {
                alert("The store WhatsApp number is not configured correctly.");
                return;
            }

            const message = [
                "Hi LastRound! 👋",
                "",
                "I'm interested in this product:",
                "",
                "Product: " + productName,
                "Price: RM " + price.toFixed(2),
                "Colour: " + colour,
                "Size: " + size,
                "Quantity: 1",
                "",
                "Is this item available?",
                "I'd like to ask about ordering and payment.",
                "Please confirm the delivery fee and final total.",
            ].join("\n");

            const whatsappURL =
                "https://api.whatsapp.com/send/?phone=" +
                whatsappNumber +
                "&text=" +
                encodeURIComponent(message);

            window.open(
                whatsappURL,
                "_blank",
                "noopener,noreferrer"
            );
        });
    });
});
