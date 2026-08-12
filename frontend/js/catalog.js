let allCakes = [];

async function loadCakes() {
    showLoading(true);

    try {
        const response = await fetch(`${API_CONFIG.CATALOG_SERVICE}/api/cakes`);

        if (!response.ok) {
            throw new Error("Unable to load cakes");
        }

        const data = await response.json();

        allCakes = Array.isArray(data) ? data : [];

        displayCakes(allCakes);
        populateCategories(allCakes);

        document.getElementById("totalCakes").textContent = allCakes.length;

    } catch (error) {
        console.error("Catalog service error:", error);

        showEmptyState(
            "Unable to load cakes",
            "Please make sure the Catalog Service is running."
        );

    } finally {
        showLoading(false);
    }
}


function displayCakes(cakes) {

    const container = document.getElementById("cakeContainer");
    const emptyState = document.getElementById("emptyState");

    container.innerHTML = "";

    if (!cakes || cakes.length === 0) {
        emptyState.classList.remove("d-none");
        return;
    }

    emptyState.classList.add("d-none");

    cakes.forEach(cake => {

        const card = createCakeCard(cake);

        container.appendChild(card);

    });
}


function createCakeCard(cake) {

    const column = document.createElement("div");

    column.className = "col-xl-3 col-lg-4 col-md-6";

    const cakeId =
        cake.id ||
        cake._id ||
        cake.cakeId ||
        cake.name;
    column.dataset.cakeId = cakeId;
    
    const image =
        cake.imageUrl ||
        "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=700&q=80";

    const name = cake.name || "Delicious Cake";

    const description =
        cake.description ||
        "Freshly prepared cake made with quality ingredients.";

    const category =
        cake.category ||
        "Cake";

    const price =
        Number(cake.price || 0);

    const availability =
        cake.availability !== false;

    column.innerHTML = `
        <div class="cake-card">

            <div class="cake-image-wrapper">

                <img
                    src="${image}"
                    alt="${name}"
                    onerror="this.src='https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=700&q=80'">

                <span class="cake-category">
                    ${category}
                </span>

                <span class="cake-availability"
                      style="${availability ? "" : "background:#777;"}">
                    ${availability ? "Available" : "Unavailable"}
                </span>

            </div>

            <div class="cake-body">

                <h4>${name}</h4>

                <p class="cake-description">
                    ${description}
                </p>

                <div class="cake-rating">

                    <span class='rating-stars'>
                        <i class="bi bi-star-fill"></i>
                        <i class="bi bi-star-fill"></i>
                        <i class="bi bi-star-fill"></i>
                        <i class="bi bi-star-fill"></i>
                        <i class="bi bi-star"></i>
                    </span>
                    
                    <strong>--</strong>
                    <span class="text-muted">
                          Loading...  
                    </span>

                </div>

                <button
                    type="button"
                    class="review-button"
                    onclick="openRatingModal(
                        '${String(cakeId).replace(/'/g, "\\'")}',
                        '${String(name).replace(/'/g, "\\'")}'
                )">

                <i class="bi bi-chat-heart"></i>

                Read reviews / Write a review

                </button>

                <div class="cake-footer">

                    <div class="cake-price">
                        ₹${price.toLocaleString("en-IN")}
                    </div>

                    <button
                        class="add-button"
                        title="Add to basket"
                        ${availability ? "" : "disabled"}
                        onclick='addToBasket(${JSON.stringify(cake)})'>

                        <i class="bi bi-plus-lg"></i>

                    </button>

                </div>

            </div>

        </div>
    `;

    const cardElement =
        column.querySelector(".cake-card");

    updateCakeCardRating(
        cardElement,
        cakeId
    );

    return column;
}


function populateCategories(cakes) {

    const categoryFilter =
        document.getElementById("categoryFilter");

    const categories = [
        ...new Set(
            cakes
                .map(cake => cake.category)
                .filter(category => category)
        )
    ];

    categoryFilter.innerHTML =
        `<option value="">All categories</option>`;

    categories.sort().forEach(category => {

        const option =
            document.createElement("option");

        option.value = category;
        option.textContent = category;

        categoryFilter.appendChild(option);

    });
}


async function searchCakes() {

    const searchValue =
        document.getElementById("searchInput").value.trim();

    const category =
        document.getElementById("categoryFilter").value;

    const minPrice =
        document.getElementById("minPrice").value;

    const maxPrice =
        document.getElementById("maxPrice").value;

    if (!searchValue && !category && !minPrice && !maxPrice) {
        displayCakes(allCakes);
        return;
    }

    showLoading(true);

    try {

        let url =
            `${API_CONFIG.CATALOG_SERVICE}/api/cakes/search?`;

        const params = new URLSearchParams();

        if (searchValue) {
            params.append("name", searchValue);
        }

        if (category) {
            params.append("category", category);
        }

        if (minPrice) {
            params.append("minPrice", minPrice);
        }

        if (maxPrice) {
            params.append("maxPrice", maxPrice);
        }

        url += params.toString();

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Search failed");
        }

        const data = await response.json();

        displayCakes(
            Array.isArray(data) ? data : []
        );

    } catch (error) {

        console.error("Search error:", error);

        showEmptyState(
            "Search unavailable",
            "Please check the Catalog Service."
        );

    } finally {

        showLoading(false);

    }
}


function clearCatalogFilters() {

    document.getElementById("searchInput").value = "";
    document.getElementById("categoryFilter").value = "";
    document.getElementById("minPrice").value = "";
    document.getElementById("maxPrice").value = "";

    displayCakes(allCakes);
}


function showLoading(show) {

    const spinner =
        document.getElementById("loadingSpinner");

    const container =
        document.getElementById("cakeContainer");

    if (show) {

        spinner.classList.remove("d-none");
        container.classList.add("d-none");

    } else {

        spinner.classList.add("d-none");
        container.classList.remove("d-none");

    }
}


function showEmptyState(title, message) {

    const emptyState =
        document.getElementById("emptyState");

    const heading =
        emptyState.querySelector("h4");

    const paragraph =
        emptyState.querySelector("p");

    heading.textContent = title;
    paragraph.textContent = message;

    emptyState.classList.remove("d-none");

    document
        .getElementById("cakeContainer")
        .classList.add("d-none");
}