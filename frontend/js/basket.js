let basket = JSON.parse(localStorage.getItem("cakeDelightBasket")) || [];


/* ==============================
   BASKET INITIALIZATION
   ============================== */

document.addEventListener("DOMContentLoaded", () => {

    renderBasket();
    updateBasketCount();

});


/* ==============================
   ADD TO BASKET
   ============================== */

function addToBasket(cake) {

    if (!cake) {
        return;
    }

    const cakeId =
        cake.id ||
        cake._id ||
        cake.cakeId ||
        cake.name;

    const existingItem =
        basket.find(item => item.id === cakeId);

    if (existingItem) {

        existingItem.quantity += 1;

    } else {

        basket.push({

            id: cakeId,

            name: cake.name || "Delicious Cake",

            price: Number(cake.price || 0),

            image:
                cake.imageReference ||
                cake.image ||
                "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=700&q=80",

            category:
                cake.category || "Cake",

            quantity: 1

        });

    }

    saveBasket();

    renderBasket();

    updateBasketCount();

    showToast(
        "Added to basket",
        `${cake.name || "Cake"} has been added to your basket.`
    );

}


/* ==============================
   REMOVE ITEM
   ============================== */

function removeFromBasket(id) {

    basket =
        basket.filter(item => item.id !== id);

    saveBasket();

    renderBasket();

    updateBasketCount();

}


/* ==============================
   CHANGE QUANTITY
   ============================== */

function changeQuantity(id, change) {

    const item =
        basket.find(item => item.id === id);

    if (!item) {
        return;
    }

    item.quantity += change;

    if (item.quantity <= 0) {

        removeFromBasket(id);

        return;

    }

    saveBasket();

    renderBasket();

    updateBasketCount();

}


/* ==============================
   SAVE BASKET
   ============================== */

function saveBasket() {

    localStorage.setItem(
        "cakeDelightBasket",
        JSON.stringify(basket)
    );

}


/* ==============================
   BASKET COUNT
   ============================== */

function updateBasketCount() {

    const countElement =
        document.getElementById("basketCount");

    if (!countElement) {
        return;
    }

    const count =
        basket.reduce(
            (total, item) =>
                total + item.quantity,
            0
        );

    countElement.textContent = count;

}


/* ==============================
   RENDER BASKET
   ============================== */

function renderBasket() {

    const container =
        document.getElementById("basketItems");

    const emptyBasket =
        document.getElementById("emptyBasket");

    const summary =
        document.getElementById("basketSummary");

    if (!container) {
        return;
    }

    container.innerHTML = "";

    if (basket.length === 0) {

        emptyBasket.classList.remove("d-none");
        summary.classList.add("d-none");

        return;

    }

    emptyBasket.classList.add("d-none");
    summary.classList.remove("d-none");


    basket.forEach(item => {

        const itemElement =
            document.createElement("div");

        itemElement.className =
            "basket-item";


        itemElement.innerHTML = `

            <img
                src="${item.image}"
                alt="${item.name}"
                onerror="this.src='https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=700&q=80'"
            >

            <div class="basket-item-details">

                <h6>${item.name}</h6>

                <small>
                    ₹${Number(item.price).toLocaleString("en-IN")}
                </small>

                <div class="quantity-control">

                    <button
                        type="button"
                        onclick="changeQuantity('${escapeAttribute(item.id)}', -1)">
                        −
                    </button>

                    <strong>
                        ${item.quantity}
                    </strong>

                    <button
                        type="button"
                        onclick="changeQuantity('${escapeAttribute(item.id)}', 1)">
                        +
                    </button>

                </div>

                <button
                    type="button"
                    class="remove-item mt-2"
                    onclick="removeFromBasket('${escapeAttribute(item.id)}')">

                    <i class="bi bi-trash3"></i>
                    Remove

                </button>

            </div>

            <strong>
                ₹${(item.price * item.quantity).toLocaleString("en-IN")}
            </strong>

        `;

        container.appendChild(itemElement);

    });


    updateBasketSummary();

}


/* ==============================
   UPDATE SUMMARY
   ============================== */

function updateBasketSummary() {

    const subtotalElement =
        document.getElementById("basketSubtotal");

    const totalElement =
        document.getElementById("basketTotal");


    const subtotal =
        basket.reduce(
            (total, item) =>
                total +
                (Number(item.price) * item.quantity),
            0
        );


    subtotalElement.textContent =
        `₹${subtotal.toLocaleString("en-IN")}`;

    totalElement.textContent =
        `₹${subtotal.toLocaleString("en-IN")}`;

}


/* ==============================
   GET BASKET
   ============================== */

function getBasket() {

    return basket;

}


/* ==============================
   GET TOTAL
   ============================== */

function getBasketTotal() {

    return basket.reduce(
        (total, item) =>
            total +
            (Number(item.price) * item.quantity),
        0
    );

}


/* ==============================
   CLEAR BASKET
   ============================== */

function clearBasket() {

    basket = [];

    saveBasket();

    renderBasket();

    updateBasketCount();

}


/* ==============================
   ESCAPE ATTRIBUTE
   ============================== */

function escapeAttribute(value) {

    return String(value)
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'");

}