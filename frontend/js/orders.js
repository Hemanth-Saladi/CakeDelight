document.addEventListener("DOMContentLoaded", () => {

    setupOrders();

});


function setupOrders() {

    const ordersButton =
        document.getElementById("myOrdersButton");

    if (ordersButton) {

        ordersButton.addEventListener(
            "click",
            showOrders
        );

    }

}


async function showOrders() {

    const email =
        localStorage.getItem(
            "cakeDelightCustomerEmail"
        );


    if (!email) {

        showToast(
            "No customer found",
            "Place an order first to view your orders."
        );

        return;

    }


    const modalElement =
        document.getElementById("ordersModal");

    const loading =
        document.getElementById("ordersLoading");

    const empty =
        document.getElementById("ordersEmpty");

    const container =
        document.getElementById("ordersContainer");


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
                "Unable to load orders"
            );

        }


        const orders =
            await response.json();


        loading.classList.add("d-none");


        if (!orders || orders.length === 0) {

            empty.classList.remove("d-none");

            return;

        }


        orders
            .sort(
                (a, b) =>
                    new Date(b.orderDate) -
                    new Date(a.orderDate)
            )
            .forEach(order => {

                container.appendChild(
                    createOrderCard(order)
                );

            });


    } catch (error) {

        console.error(
            "Order history error:",
            error
        );


        loading.classList.add("d-none");


        showToast(
            "Unable to load orders",
            "Please check that the Order Service is running."
        );

    }

}


function createOrderCard(order) {

    const card =
        document.createElement("div");


    card.className =
        "order-card mb-4";


    const items =
        (order.items || [])
            .map(item => {

                const cakeId =
                    item.cakeId ||
                    item.id ||
                    item.cakeID;

                const cakeName =
                    item.cakeName ||
                    "Cake";


                const subtotal =
                    Number(
                        item.subtotal ??
                        (
                            Number(item.price || 0) *
                            Number(item.quantity || 0)
                        )
                    );


                return `

                    <div class="order-item">

                        <div class="order-item-info">

                            <strong>
                                ${escapeOrderHtml(cakeName)}
                            </strong>

                            <small>
                                ₹${Number(
                                    item.price || 0
                                ).toLocaleString("en-IN")}
                                × ${item.quantity}
                            </small>

                        </div>

                        <div class="order-item-actions">

                            <strong>
                                ₹${subtotal.toLocaleString("en-IN")}
                            </strong>

                            <button
                                type="button"
                                class="review-order-button"
                                onclick="openRatingModal(
                                    '${escapeOrderAttribute(cakeId)}',
                                    '${escapeOrderAttribute(cakeName)}'
                                )">

                                <i class="bi bi-star-fill"></i>
                                Review

                            </button>

                        </div>

                    </div>

                `;

            })
            .join("");


    const date =
        new Date(order.orderDate)
            .toLocaleString(
                "en-IN",
                {
                    dateStyle: "medium",
                    timeStyle: "short"
                }
            );


    card.innerHTML = `

        <div class="order-card-header">

            <div>

                <span class="section-label">
                    ORDER
                </span>

                <h5>
                    #${order.orderId}
                </h5>

            </div>

            <span class="order-status">
                ${order.status}
            </span>

        </div>


        <div class="order-date">

            <i class="bi bi-calendar3"></i>

            ${date}

        </div>


        <div class="order-items">

            ${items}

        </div>


        <div class="order-total">

            <span>
                Total
            </span>

            <strong>
                ₹${Number(
                    order.totalAmount || 0
                ).toLocaleString("en-IN")}
            </strong>

        </div>

    `;


    return card;

}


function escapeOrderHtml(value) {

    const div =
        document.createElement("div");

    div.textContent =
        value ?? "";

    return div.innerHTML;

}


function escapeOrderAttribute(value) {

    return String(value ?? "")
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'");

}