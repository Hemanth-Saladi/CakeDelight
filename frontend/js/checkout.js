document.addEventListener("DOMContentLoaded", () => {

    setupCheckout();

});


function setupCheckout() {

    const checkoutButton =
        document.getElementById("checkoutButton");

    const checkoutForm =
        document.getElementById("checkoutForm");


    if (checkoutButton) {

        checkoutButton.addEventListener(
            "click",
            openCheckout
        );

    }


    if (checkoutForm) {

        checkoutForm.addEventListener(
            "submit",
            placeOrder
        );

    }

}


function openCheckout() {

    const basket = getBasket();

    if (!basket || basket.length === 0) {

        showToast(
            "Basket is empty",
            "Please add a cake before checking out."
        );

        return;

    }


    const savedName =
        localStorage.getItem(
            "cakeDelightCustomerName"
        );

    const savedEmail =
        localStorage.getItem(
            "cakeDelightCustomerEmail"
        );

    const savedPhone =
        localStorage.getItem(
            "cakeDelightCustomerPhone"
        );


    const nameInput =
        document.getElementById("customerName");

    const emailInput =
        document.getElementById("customerEmail");

    const phoneInput =
        document.getElementById("phoneNumber");


    if (nameInput && savedName) {
        nameInput.value = savedName;
    }

    if (emailInput && savedEmail) {
        emailInput.value = savedEmail;
    }

    if (phoneInput && savedPhone) {
        phoneInput.value = savedPhone;
    }


    const modalElement =
        document.getElementById("checkoutModal");

    const modal =
        bootstrap.Modal.getOrCreateInstance(
            modalElement
        );

    modal.show();

}


async function placeOrder(event) {

    event.preventDefault();


    const basket = getBasket();

    if (!basket || basket.length === 0) {

        showToast(
            "Basket is empty",
            "Please add a cake before placing an order."
        );

        return;

    }


    const name =
        document
            .getElementById("customerName")
            .value
            .trim();


    const email =
        document
            .getElementById("customerEmail")
            .value
            .trim();


    const phone =
        document
            .getElementById("phoneNumber")
            .value
            .trim();


    if (!name || !email || !phone) {

        showToast(
            "Missing information",
            "Please complete all checkout fields."
        );

        return;

    }


    localStorage.setItem(
        "cakeDelightCustomerName",
        name
    );

    localStorage.setItem(
        "cakeDelightCustomerEmail",
        email
    );

    localStorage.setItem(
        "cakeDelightCustomerPhone",
        phone
    );


    const button =
        document.getElementById(
            "placeOrderButton"
        );


    const originalButtonHTML =
        button.innerHTML;


    button.disabled = true;

    button.innerHTML = `
        <span
            class="spinner-border spinner-border-sm"
            role="status">
        </span>
        Placing order...
    `;


    try {

        for (const item of basket) {

            const cartResponse =
                await fetch(
                    `${API_CONFIG.ORDER_SERVICE}/api/orders/cart?customerEmail=${encodeURIComponent(email)}`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            cakeId: item.id,

                            cakeName: item.name,

                            price: Number(item.price),

                            quantity: Number(item.quantity)

                        })
                    }
                );


            if (!cartResponse.ok) {

                const errorText =
                    await cartResponse.text();

                throw new Error(
                    errorText ||
                    "Unable to sync basket"
                );

            }

        }


        const response =
            await fetch(
                `${API_CONFIG.ORDER_SERVICE}/api/orders/checkout`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        customerName: name,

                        email: email,

                        phoneNumber: phone

                    })
                }
            );


        if (!response.ok) {

            const errorText =
                await response.text();

            throw new Error(
                errorText ||
                "Unable to place order"
            );

        }


        const createdOrder =
            await response.json();


        clearBasket();


        const modalElement =
            document.getElementById(
                "checkoutModal"
            );

        const modal =
            bootstrap.Modal.getInstance(
                modalElement
            );

        if (modal) {
            modal.hide();
        }


        document
            .getElementById("checkoutForm")
            .reset();


        showToast(
            "Order Successful!",
            `Order #${createdOrder.orderId} has been placed successfully.`
        );


        if (
            typeof loadCustomerOrders ===
            "function"
        ) {

            loadCustomerOrders();

        }


    } catch (error) {

        console.error(
            "Order Service error:",
            error
        );


        showToast(
            "Order Failed",
            "Unable to place your order. Please check that the Order Service is running."
        );


    } finally {

        button.disabled = false;

        button.innerHTML =
            originalButtonHTML;

    }

}


function showToast(title, message) {

    const toastElement =
        document.getElementById(
            "notificationToast"
        );

    if (!toastElement) {
        return;
    }


    document.getElementById(
        "toastTitle"
    ).textContent = title;


    document.getElementById(
        "toastMessage"
    ).textContent = message;


    const toast =
        bootstrap.Toast.getOrCreateInstance(
            toastElement,
            {
                delay: 3500
            }
        );


    toast.show();

}