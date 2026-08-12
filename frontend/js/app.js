document.addEventListener("DOMContentLoaded", () => {

    loadCakes();

    setupSearch();

    setupFilters();

    setupCategoryCards();

    setupThemeToggle();

    updateBasketCount();

    loadCustomerOrders();

});


function setupSearch() {

    const searchInput =
        document.getElementById("searchInput");

    if (!searchInput) {
        return;
    }

    let searchTimer;

    searchInput.addEventListener("input", () => {

        clearTimeout(searchTimer);

        searchTimer = setTimeout(() => {
            searchCakes();
        }, 400);

    });

}


function setupFilters() {

    const categoryFilter =
        document.getElementById("categoryFilter");

    const minPrice =
        document.getElementById("minPrice");

    const maxPrice =
        document.getElementById("maxPrice");

    const clearFilters =
        document.getElementById("clearFilters");


    if (categoryFilter) {

        categoryFilter.addEventListener(
            "change",
            searchCakes
        );

    }


    if (minPrice) {

        minPrice.addEventListener(
            "change",
            searchCakes
        );

    }


    if (maxPrice) {

        maxPrice.addEventListener(
            "change",
            searchCakes
        );

    }


    if (clearFilters) {

        clearFilters.addEventListener(
            "click",
            clearCatalogFilters
        );

    }

}


function setupCategoryCards() {

    document
        .querySelectorAll(".category-card")
        .forEach(card => {

            card.addEventListener(
                "click",
                () => {

                    const category =
                        card.dataset.category;

                    const categoryFilter =
                        document.getElementById(
                            "categoryFilter"
                        );

                    if (categoryFilter) {

                        categoryFilter.value =
                            category;

                    }

                    document
                        .getElementById("cakes")
                        .scrollIntoView({
                            behavior: "smooth"
                        });

                    searchCakes();

                }
            );

        });

}


function setupThemeToggle() {

    const button =
        document.getElementById("themeToggle");

    if (!button) {
        return;
    }

    button.addEventListener(
        "click",
        () => {

            document.body.classList.toggle(
                "dark-mode"
            );

            const icon =
                button.querySelector("i");

            if (
                document.body.classList.contains(
                    "dark-mode"
                )
            ) {

                icon.className =
                    "bi bi-sun-fill";

            } else {

                icon.className =
                    "bi bi-moon-stars-fill";

            }

        }
    );

}


async function loadCustomerOrders() {

    const email =
        localStorage.getItem(
            "cakeDelightCustomerEmail"
        );

    const ordersContainer =
        document.getElementById(
            "ordersContainer"
        );

    const emptyState =
        document.getElementById(
            "ordersEmpty"
        );

    const loading =
        document.getElementById(
            "ordersLoading"
        );

    const totalOrders =
        document.getElementById(
            "totalOrders"
        );


    if (!email || !ordersContainer) {
        return;
    }


    if (loading) {
        loading.classList.remove("d-none");
    }

    if (emptyState) {
        emptyState.classList.add("d-none");
    }

    ordersContainer.innerHTML = "";


    try {

        const response =
            await fetch(
                `${API_CONFIG.ORDER_SERVICE}/api/orders/customer/${encodeURIComponent(email)}`
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load orders"
            );

        }


        const orders =
            await response.json();


        if (loading) {
            loading.classList.add("d-none");
        }


        if (!orders || orders.length === 0) {

            if (emptyState) {
                emptyState.classList.remove("d-none");
            }

            if (totalOrders) {
                totalOrders.textContent = "0";
            }

            return;

        }


        if (totalOrders) {
            totalOrders.textContent =
                orders.length;
        }


        orders
            .sort(
                (a, b) =>
                    new Date(b.orderDate) -
                    new Date(a.orderDate)
            )
            .forEach(order => {

                if (
                    typeof createOrderCard ===
                    "function"
                ) {

                    ordersContainer.appendChild(
                        createOrderCard(order)
                    );

                }

            });


    } catch (error) {

        if (loading) {
            loading.classList.add("d-none");
        }


        ordersContainer.innerHTML = `
            <div class="empty-state">

                <div class="empty-icon">
                    <i class="bi bi-exclamation-circle"></i>
                </div>

                <h5>
                    Unable to load orders
                </h5>

                <p>
                    Please check that the Order Service is running.
                </p>

            </div>
        `;

        console.error(
            "Order history error:",
            error
        );

    }

}


function formatOrderDate(date) {

    if (!date) {
        return "Date unavailable";
    }

    return new Date(date).toLocaleString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        }
    );

}