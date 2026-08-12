async function loadCakeRating(cakeId) {

    if (!cakeId) {

        return {
            rating: 0,
            count: 0
        };

    }


    try {

        const ratingsResponse =
            await fetch(
                `${API_CONFIG.RATING_SERVICE}/api/ratings/cake/${encodeURIComponent(cakeId)}`
            );


        const averageResponse =
            await fetch(
                `${API_CONFIG.RATING_SERVICE}/api/ratings/cake/${encodeURIComponent(cakeId)}/average`
            );


        if (
            !ratingsResponse.ok ||
            !averageResponse.ok
        ) {

            throw new Error(
                "Rating service unavailable"
            );

        }


        const ratings =
            await ratingsResponse.json();


        const averageData =
            await averageResponse.json();


        return {

            rating:
                Number(
                    averageData.averageRating ?? 0
                ),

            count:
                Array.isArray(ratings)
                    ? ratings.length
                    : 0

        };


    } catch (error) {

        console.warn(
            `Unable to load rating for cake ${cakeId}`,
            error
        );


        return {
            rating: 0,
            count: 0
        };

    }

}


async function loadCakeReviews(cakeId) {

    if (!cakeId) {
        return [];
    }


    try {

        const response =
            await fetch(
                `${API_CONFIG.RATING_SERVICE}/api/ratings/cake/${encodeURIComponent(cakeId)}`
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load reviews"
            );

        }


        const data =
            await response.json();


        return Array.isArray(data)
            ? data
            : [];


    } catch (error) {

        console.error(
            "Review loading error:",
            error
        );


        return [];

    }

}


function createStarRating(rating) {

    const numericRating =
        Number(rating) || 0;


    let html = "";


    for (let i = 1; i <= 5; i++) {

        if (
            i <= Math.round(numericRating)
        ) {

            html +=
                `<i class="bi bi-star-fill"></i>`;

        } else {

            html +=
                `<i class="bi bi-star"></i>`;

        }

    }


    return html;

}


async function updateCakeCardRating(
    cardElement,
    cakeId
) {

    if (!cardElement || !cakeId) {
        return;
    }


    const ratingContainer =
        cardElement.querySelector(
            ".cake-rating"
        );


    if (!ratingContainer) {
        return;
    }


    ratingContainer.innerHTML = `

        <span class="rating-stars">

            <i class="bi bi-arrow-repeat rating-loading-icon"></i>

        </span>

        <span class="text-muted">
            Loading rating...
        </span>

    `;


    const result =
        await loadCakeRating(cakeId);


    if (result.count === 0) {

        ratingContainer.innerHTML = `

            <span class="rating-stars">
                ${createStarRating(0)}
            </span>

            <strong>
                New
            </strong>

            <span class="text-muted">
                No reviews yet
            </span>

        `;

        return;

    }


    ratingContainer.innerHTML = `

        <span class="rating-stars">
            ${createStarRating(result.rating)}
        </span>

        <strong>
            ${Number(result.rating).toFixed(1)}
        </strong>

        <span class="text-muted">
            (${result.count})
        </span>

    `;

}


function refreshCakeRatings() {

    const cards =
        document.querySelectorAll(
            "#cakeContainer .cake-card"
        );


    cards.forEach(card => {

        const cakeId =
            card.closest("[data-cake-id]")
                ?.dataset.cakeId;


        if (!cakeId) {
            return;
        }


        updateCakeCardRating(
            card,
            cakeId
        );

    });

}


async function openRatingModal(
    cakeId,
    cakeName
) {

    if (!cakeId) {

        showToast(
            "Review unavailable",
            "Cake information is missing."
        );

        return;

    }


    const modalElement =
        document.getElementById(
            "ratingModal"
        );


    if (!modalElement) {
        return;
    }


    document.getElementById(
        "ratingCakeId"
    ).value = cakeId;


    document.getElementById(
        "ratingCakeName"
    ).textContent =
        cakeName || "Cake";


    document.getElementById(
        "selectedRating"
    ).value = "";


    document.getElementById(
        "customerRatingEmail"
    ).value =
        localStorage.getItem(
            "cakeDelightCustomerEmail"
        ) || "";


    document.getElementById(
        "ratingReview"
    ).value = "";


    resetRatingStars();


    const reviewsContainer =
        document.getElementById(
            "reviewsContainer"
        );


    const reviewsLoading =
        document.getElementById(
            "reviewsLoading"
        );


    reviewsContainer.innerHTML = "";


    reviewsLoading.classList.remove(
        "d-none"
    );


    const modal =
        bootstrap.Modal.getOrCreateInstance(
            modalElement
        );


    modal.show();


    const reviews =
        await loadCakeReviews(cakeId);


    reviewsLoading.classList.add(
        "d-none"
    );


    displayReviews(reviews);

}


function displayReviews(reviews) {

    const container =
        document.getElementById(
            "reviewsContainer"
        );


    if (!container) {
        return;
    }


    if (
        !reviews ||
        reviews.length === 0
    ) {

        container.innerHTML = `

            <div class="no-reviews">

                <div class="empty-icon">
                    <i class="bi bi-chat-heart"></i>
                </div>

                <strong>
                    No reviews yet
                </strong>

                <p>
                    Be the first customer to review this cake!
                </p>

            </div>

        `;

        return;

    }


    const sortedReviews =
        [...reviews].sort(
            (a, b) =>
                new Date(b.createdAt || 0) -
                new Date(a.createdAt || 0)
        );


    container.innerHTML =
        sortedReviews
            .map(review => {

                const rating =
                    Number(review.rating) || 0;


                const stars =
                    createStarRating(rating);


                const date =
                    review.createdAt
                        ? formatReviewDate(
                            review.createdAt
                        )
                        : "";


                return `

                    <div class="review-item">

                        <div class="review-header">

                            <div>

                                <div class="rating-stars">
                                    ${stars}
                                </div>

                                <strong>
                                    ${rating}/5
                                </strong>

                            </div>

                            <small>
                                ${date}
                            </small>

                        </div>


                        ${
                            review.review
                                ? `
                                    <p class="review-text">
                                        ${escapeHtml(
                                            review.review
                                        )}
                                    </p>
                                `
                                : ""
                        }


                        <small class="review-email">
                            ${maskEmail(
                                review.customerEmail
                            )}
                        </small>

                    </div>

                `;

            })
            .join("");

}


async function submitRating(event) {

    event.preventDefault();


    const cakeId =
        document.getElementById(
            "ratingCakeId"
        ).value;


    const email =
        document.getElementById(
            "customerRatingEmail"
        ).value.trim();


    const rating =
        Number(
            document.getElementById(
                "selectedRating"
            ).value
        );


    const review =
        document.getElementById(
            "ratingReview"
        ).value.trim();


    if (!cakeId) {

        showToast(
            "Rating Error",
            "Cake information is missing."
        );

        return;

    }


    if (!email) {

        showToast(
            "Email required",
            "Please enter your email address."
        );

        return;

    }


    if (
        !rating ||
        rating < 1 ||
        rating > 5
    ) {

        showToast(
            "Rating required",
            "Please select a rating from 1 to 5 stars."
        );

        return;

    }


    const button =
        document.getElementById(
            "submitRatingButton"
        );


    const originalHTML =
        button.innerHTML;


    button.disabled = true;


    button.innerHTML = `

        <span
            class="spinner-border spinner-border-sm"
            role="status">
        </span>

        Submitting...

    `;


    try {

        const response =
            await fetch(
                `${API_CONFIG.RATING_SERVICE}/api/ratings`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        cakeId: cakeId,

                        customerEmail: email,

                        rating: rating,

                        review: review

                    })

                }
            );


        if (!response.ok) {

            let message =
                "Unable to submit rating.";


            try {

                const errorData =
                    await response.json();


                if (
                    errorData &&
                    typeof errorData === "object"
                ) {

                    message =
                        Object.values(
                            errorData
                        ).join(" ");

                }

            } catch (error) {
            }


            throw new Error(message);

        }


        showToast(
            "Review submitted!",
            "Thank you for rating this cake."
        );


        const reviews =
            await loadCakeReviews(
                cakeId
            );


        displayReviews(reviews);


        const card =
            document.querySelector(
                `[data-cake-id="${CSS.escape(cakeId)}"] .cake-card`
            );


        if (card) {

            await updateCakeCardRating(
                card,
                cakeId
            );

        }


        localStorage.setItem(
            "cakeDelightCustomerEmail",
            email
        );


        document.getElementById(
            "selectedRating"
        ).value = "";


        document.getElementById(
            "ratingReview"
        ).value = "";


        resetRatingStars();


    } catch (error) {

        console.error(
            "Rating submission error:",
            error
        );


        showToast(
            "Rating failed",
            error.message ||
            "Unable to submit your review."
        );


    } finally {

        button.disabled = false;

        button.innerHTML =
            originalHTML;

    }

}


function setupRatingStars() {

    const stars =
        document.querySelectorAll(
            "#ratingStarSelector i"
        );


    stars.forEach(star => {

        star.addEventListener(
            "click",
            () => {

                const rating =
                    Number(
                        star.dataset.rating
                    );


                document.getElementById(
                    "selectedRating"
                ).value = rating;


                updateSelectedStars(
                    rating
                );

            }
        );


        star.addEventListener(
            "mouseenter",
            () => {

                const rating =
                    Number(
                        star.dataset.rating
                    );


                updateSelectedStars(
                    rating
                );

            }
        );

    });


    const selector =
        document.getElementById(
            "ratingStarSelector"
        );


    if (selector) {

        selector.addEventListener(
            "mouseleave",
            () => {

                const selected =
                    Number(
                        document.getElementById(
                            "selectedRating"
                        ).value
                    );


                updateSelectedStars(
                    selected
                );

            }
        );

    }

}


function updateSelectedStars(rating) {

    document
        .querySelectorAll(
            "#ratingStarSelector i"
        )
        .forEach(star => {

            const currentRating =
                Number(
                    star.dataset.rating
                );


            star.className =
                currentRating <= rating
                    ? "bi bi-star-fill"
                    : "bi bi-star";

        });

}


function resetRatingStars() {

    document
        .querySelectorAll(
            "#ratingStarSelector i"
        )
        .forEach(star => {

            star.className =
                "bi bi-star";

        });

}


function formatReviewDate(date) {

    if (!date) {
        return "";
    }


    return new Date(date)
        .toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );

}


function maskEmail(email) {

    if (
        !email ||
        !email.includes("@")
    ) {

        return "Customer";

    }


    const parts =
        email.split("@");


    const name =
        parts[0];


    if (name.length <= 2) {

        return `${name[0] || "*"}***@${parts[1]}`;

    }


    return (
        name.substring(0, 2) +
        "***@" +
        parts[1]
    );

}


function escapeHtml(value) {

    if (!value) {
        return "";
    }


    const div =
        document.createElement("div");


    div.textContent =
        value;


    return div.innerHTML;

}


async function setupReviewsNavigation() {

    const reviewsButton =
        document.getElementById(
            "myReviewsButton"
        );


    if (!reviewsButton) {
        return;
    }


    reviewsButton.addEventListener(
        "click",
        showCustomerReviews
    );

}


async function showCustomerReviews() {

    const email =
        localStorage.getItem(
            "cakeDelightCustomerEmail"
        );


    if (!email) {

        showToast(
            "No customer found",
            "Place an order first to review your cakes."
        );

        return;

    }


    const modalElement =
        document.getElementById(
            "reviewsModal"
        );


    const loading =
        document.getElementById(
            "reviewsPageLoading"
        );


    const empty =
        document.getElementById(
            "reviewsPageEmpty"
        );


    const container =
        document.getElementById(
            "reviewsPageContainer"
        );


    if (
        !modalElement ||
        !loading ||
        !empty ||
        !container
    ) {

        return;

    }


    loading.classList.remove("d-none");

    empty.classList.add("d-none");

    container.innerHTML = "";


    const modal =
        bootstrap.Modal.getOrCreateInstance(
            modalElement
        );


    modal.show();


    try {

        const response =
            await fetch(
                `${API_CONFIG.ORDER_SERVICE}/api/orders/customer/${encodeURIComponent(email)}`
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load purchased cakes"
            );

        }


        const orders =
            await response.json();


        loading.classList.add("d-none");


        if (
            !orders ||
            orders.length === 0
        ) {

            empty.classList.remove(
                "d-none"
            );

            return;

        }


        const cakes = [];


        orders.forEach(order => {

            (order.items || [])
                .forEach(item => {

                    const cakeId =
                        item.cakeId ||
                        item.id ||
                        item.cakeID;


                    if (!cakeId) {
                        return;
                    }


                    const exists =
                        cakes.some(
                            cake =>
                                String(
                                    cake.cakeId
                                ) ===
                                String(cakeId)
                        );


                    if (!exists) {

                        cakes.push({

                            cakeId: cakeId,

                            cakeName:
                                item.cakeName ||
                                "Cake",

                            price:
                                Number(
                                    item.price || 0
                                )

                        });

                    }

                });

        });


        if (cakes.length === 0) {

            empty.classList.remove(
                "d-none"
            );

            return;

        }


        for (const cake of cakes) {

            const result =
                await loadCakeRating(
                    cake.cakeId
                );


            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "customer-review-card";


            card.innerHTML = `

                <div class="customer-review-info">

                    <div class="customer-review-icon">

                        <i class="bi bi-cake2-fill"></i>

                    </div>

                    <div>

                        <h5>
                            ${escapeHtml(
                                cake.cakeName
                            )}
                        </h5>

                        <div class="customer-review-rating">

                            <span class="rating-stars">
                                ${createStarRating(
                                    result.rating
                                )}
                            </span>

                            ${
                                result.count > 0
                                    ? `
                                        <strong>
                                            ${Number(
                                                result.rating
                                            ).toFixed(1)}
                                        </strong>

                                        <span>
                                            (${result.count} reviews)
                                        </span>
                                    `
                                    : `
                                        <span>
                                            No reviews yet
                                        </span>
                                    `
                            }

                        </div>

                    </div>

                </div>


                <button
                    type="button"
                    class="review-button customer-review-action"
                    onclick="openRatingModal(
                        '${escapeOrderAttribute(cake.cakeId)}',
                        '${escapeOrderAttribute(cake.cakeName)}'
                    )">

                    <i class="bi bi-star-fill"></i>

                    Review Cake

                </button>

            `;


            container.appendChild(
                card
            );

        }


    } catch (error) {

        console.error(
            "Customer reviews error:",
            error
        );


        loading.classList.add(
            "d-none"
        );


        container.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    <i class="bi bi-exclamation-circle"></i>
                </div>

                <h5>
                    Unable to load reviews
                </h5>

                <p>
                    Please check that the Order Service is running.
                </p>

            </div>

        `;

    }

}


function escapeOrderAttribute(value) {

    return String(value ?? "")
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'");

}


document.addEventListener(
    "DOMContentLoaded",
    () => {

        setupRatingStars();

        setupReviewsNavigation();


        const ratingForm =
            document.getElementById(
                "ratingForm"
            );


        if (ratingForm) {

            ratingForm.addEventListener(
                "submit",
                submitRating
            );

        }

    }
);