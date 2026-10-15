/* =========================================================
   MISHRA DRY FRUIT MART - CART PAGE
   File: frontend/js/cart.js
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const cartItemsContainer =
        document.getElementById("cartItems");

    if (!cartItemsContainer) return;


    /* =====================================================
       CART STATE
    ===================================================== */

    let cart = JSON.parse(
        localStorage.getItem("dryfruit_cart")
    ) || [];

    let appliedCoupon = JSON.parse(
        localStorage.getItem("dryfruit_coupon")
    ) || null;


    const FREE_DELIVERY_LIMIT = 499;
    const DELIVERY_CHARGE = 49;


    /* =====================================================
       HELPERS
    ===================================================== */

    function saveCart() {

        localStorage.setItem(
            "dryfruit_cart",
            JSON.stringify(cart)
        );

    }


    function saveCoupon() {

        if (appliedCoupon) {

            localStorage.setItem(
                "dryfruit_coupon",
                JSON.stringify(appliedCoupon)
            );

        } else {

            localStorage.removeItem(
                "dryfruit_coupon"
            );

        }

    }


    function escapeHTML(value) {

        if (
            value === null ||
            value === undefined
        ) {
            return "";
        }

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    function getCartSubtotal() {

        return cart.reduce(
            function (total, item) {

                return total +
                    (Number(item.price) *
                    Number(item.quantity));

            },
            0
        );

    }


    function getTotalItems() {

        return cart.reduce(
            function (total, item) {

                return total +
                    Number(item.quantity);

            },
            0
        );

    }


    function calculateCouponDiscount(
        subtotal
    ) {

        if (!appliedCoupon) {
            return 0;
        }

        if (
            subtotal <
            Number(appliedCoupon.minAmount)
        ) {
            return 0;
        }

        if (
            appliedCoupon.type === "percent"
        ) {

            return Math.round(
                subtotal *
                Number(appliedCoupon.value) /
                100
            );

        }

        if (
            appliedCoupon.type === "fixed"
        ) {

            return Math.min(
                Number(appliedCoupon.value),
                subtotal
            );

        }

        return 0;
    }


    function getDeliveryCharge(
        subtotalAfterDiscount
    ) {

        if (
            subtotalAfterDiscount <= 0
        ) {
            return 0;
        }

        if (
            subtotalAfterDiscount >=
            FREE_DELIVERY_LIMIT
        ) {
            return 0;
        }

        return DELIVERY_CHARGE;
    }


    function formatMoney(amount) {

        if (
            typeof formatPrice ===
            "function"
        ) {

            return formatPrice(amount);

        }

        return "₹" +
            Number(amount).toLocaleString(
                "en-IN"
            );

    }


    /* =====================================================
       RENDER CART
    ===================================================== */

    function renderCart() {

        cart = JSON.parse(
            localStorage.getItem(
                "dryfruit_cart"
            )
        ) || [];


        const cartContent =
            document.getElementById(
                "cartContent"
            );

        const emptyCart =
            document.getElementById(
                "emptyCart"
            );


        if (cart.length === 0) {

            if (cartContent) {
                cartContent.style.display =
                    "none";
            }

            if (emptyCart) {
                emptyCart.style.display =
                    "block";
            }

            resetSummary();

            return;
        }


        if (cartContent) {
            cartContent.style.display =
                "";
        }

        if (emptyCart) {
            emptyCart.style.display =
                "none";
        }


        cartItemsContainer.innerHTML =
            cart.map(
                createCartItem
            ).join("");


        attachCartEvents();

        updateCartSummary();

    }


    /* =====================================================
       CREATE CART ITEM
    ===================================================== */

    function createCartItem(
        item,
        index
    ) {

        const quantity =
            Number(item.quantity) || 1;

        const price =
            Number(item.price) || 0;

        const itemTotal =
            price * quantity;


        return `

            <div
                class="cart-item"
                data-index="${index}"
            >

                <!-- IMAGE -->

                <div class="cart-item-image">

                    <img
                        src="${escapeHTML(item.image)}"
                        alt="${escapeHTML(item.name)}"
                        onerror="
                            this.src='https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=500&q=80'
                        "
                    >

                </div>


                <!-- INFORMATION -->

                <div class="cart-item-info">

                    <div class="cart-item-category">
                        ${escapeHTML(
                            item.category ||
                            "Dry Fruits"
                        )}
                    </div>

                    <div class="cart-item-name">
                        ${escapeHTML(item.name)}
                    </div>

                    <div class="cart-item-weight">
                        Weight:
                        ${escapeHTML(
                            item.weight ||
                            "250g"
                        )}
                    </div>

                    <div class="cart-item-price">

                        ${formatMoney(price)}

                        ${
                            item.oldPrice &&
                            Number(item.oldPrice) > price
                                ? `
                                    <span class="cart-item-old-price">
                                        ${formatMoney(
                                            item.oldPrice
                                        )}
                                    </span>
                                  `
                                : ""
                        }

                    </div>

                </div>


                <!-- QUANTITY -->

                <div class="cart-item-quantity">

                    <button
                        type="button"
                        class="cart-quantity-btn decrease-cart"
                        data-index="${index}"
                        aria-label="Decrease quantity"
                    >
                        <i class="fas fa-minus"></i>
                    </button>

                    <span
                        class="cart-quantity-number"
                    >
                        ${quantity}
                    </span>

                    <button
                        type="button"
                        class="cart-quantity-btn increase-cart"
                        data-index="${index}"
                        aria-label="Increase quantity"
                    >
                        <i class="fas fa-plus"></i>
                    </button>

                </div>


                <!-- ITEM TOTAL -->

                <div class="cart-item-total">

                    ${formatMoney(itemTotal)}

                </div>


                <!-- REMOVE -->

                <button
                    type="button"
                    class="cart-remove-btn remove-cart"
                    data-index="${index}"
                    title="Remove item"
                    aria-label="Remove item"
                >
                    <i class="fas fa-trash"></i>
                </button>

            </div>

        `;

    }


    /* =====================================================
       CART EVENTS
    ===================================================== */

    function attachCartEvents() {


        /* ---------------------------------------------
           INCREASE
        --------------------------------------------- */

        document
            .querySelectorAll(
                ".increase-cart"
            )
            .forEach(
                function (button) {

                    button.addEventListener(
                        "click",
                        function () {

                            const index =
                                Number(
                                    button.dataset.index
                                );

                            increaseQuantity(
                                index
                            );

                        }
                    );

                }
            );


        /* ---------------------------------------------
           DECREASE
        --------------------------------------------- */

        document
            .querySelectorAll(
                ".decrease-cart"
            )
            .forEach(
                function (button) {

                    button.addEventListener(
                        "click",
                        function () {

                            const index =
                                Number(
                                    button.dataset.index
                                );

                            decreaseQuantity(
                                index
                            );

                        }
                    );

                }
            );


        /* ---------------------------------------------
           REMOVE
        --------------------------------------------- */

        document
            .querySelectorAll(
                ".remove-cart"
            )
            .forEach(
                function (button) {

                    button.addEventListener(
                        "click",
                        function () {

                            const index =
                                Number(
                                    button.dataset.index
                                );

                            removeItem(index);

                        }
                    );

                }
            );

    }


    /* =====================================================
       INCREASE QUANTITY
    ===================================================== */

    function increaseQuantity(index) {

        if (!cart[index]) return;


        const currentQuantity =
            Number(
                cart[index].quantity
            );


        if (currentQuantity >= 20) {

            showCartMessage(
                "Maximum quantity is 20.",
                "error"
            );

            return;
        }


        cart[index].quantity =
            currentQuantity + 1;


        saveCart();

        renderCart();

        updateGlobalCartCount();

    }


    /* =====================================================
       DECREASE QUANTITY
    ===================================================== */

    function decreaseQuantity(index) {

        if (!cart[index]) return;


        const currentQuantity =
            Number(
                cart[index].quantity
            );


        if (currentQuantity <= 1) {

            removeItem(index);

            return;
        }


        cart[index].quantity =
            currentQuantity - 1;


        saveCart();

        renderCart();

        updateGlobalCartCount();

    }


    /* =====================================================
       REMOVE ITEM
    ===================================================== */

    function removeItem(index) {

        if (!cart[index]) return;


        const removedItem =
            cart[index];


        cart.splice(index, 1);


        saveCart();


        /*
         * If cart becomes empty,
         * remove coupon too.
         */

        if (cart.length === 0) {

            appliedCoupon = null;

            saveCoupon();

        }


        renderCart();

        updateGlobalCartCount();


        showCartMessage(
            `${removedItem.name} removed from cart.`,
            "info"
        );

    }


    /* =====================================================
       CLEAR CART
    ===================================================== */

    function clearCart() {

        if (cart.length === 0) {
            return;
        }


        const confirmed =
            window.confirm(
                "Are you sure you want to clear your cart?"
            );


        if (!confirmed) {
            return;
        }


        cart = [];

        appliedCoupon = null;


        saveCart();

        saveCoupon();


        renderCart();

        updateGlobalCartCount();


        showCartMessage(
            "Your cart has been cleared.",
            "success"
        );

    }


    /* =====================================================
       UPDATE CART SUMMARY
    ===================================================== */

    function updateCartSummary() {

        const subtotal =
            getCartSubtotal();


        let couponDiscount =
            calculateCouponDiscount(
                subtotal
            );


        /*
         * If coupon is no longer valid,
         * remove it automatically.
         */

        if (
            appliedCoupon &&
            subtotal <
            Number(appliedCoupon.minAmount)
        ) {

            appliedCoupon = null;

            saveCoupon();

            couponDiscount = 0;

            showCouponMessage(
                "Coupon removed because the minimum order value is no longer met.",
                "error"
            );

        }


        const afterDiscount =
            Math.max(
                0,
                subtotal - couponDiscount
            );


        const delivery =
            getDeliveryCharge(
                afterDiscount
            );


        const total =
            afterDiscount + delivery;


        /* ---------------------------------------------
           SUBTOTAL
        --------------------------------------------- */

        const subtotalElement =
            document.getElementById(
                "cartSubtotal"
            );

        if (subtotalElement) {

            subtotalElement.textContent =
                formatMoney(subtotal);

        }


        /* ---------------------------------------------
           DISCOUNT
        --------------------------------------------- */

        const discountRow =
            document.getElementById(
                "discountRow"
            );

        const discountElement =
            document.getElementById(
                "cartDiscount"
            );


        if (
            couponDiscount > 0 &&
            appliedCoupon
        ) {

            if (discountRow) {
                discountRow.style.display =
                    "flex";
            }

            if (discountElement) {

                discountElement.textContent =
                    "-" +
                    formatMoney(
                        couponDiscount
                    );

            }

        } else {

            if (discountRow) {
                discountRow.style.display =
                    "none";
            }

        }


        /* ---------------------------------------------
           DELIVERY
        --------------------------------------------- */

        const deliveryElement =
            document.getElementById(
                "cartDelivery"
            );


        if (deliveryElement) {

            deliveryElement.textContent =
                delivery === 0
                    ? "FREE"
                    : formatMoney(delivery);

        }


        /* ---------------------------------------------
           DELIVERY MESSAGE
        --------------------------------------------- */

        const deliveryMessage =
            document.getElementById(
                "deliveryMessage"
            );


        if (deliveryMessage) {

            if (afterDiscount >=
                FREE_DELIVERY_LIMIT
            ) {

                deliveryMessage.textContent =
                    "Congratulations! You got FREE delivery.";

            } else {

                const remaining =
                    FREE_DELIVERY_LIMIT -
                    afterDiscount;

                deliveryMessage.textContent =
                    `Add ${formatMoney(
                        remaining
                    )} more for FREE delivery.`;

            }

        }


        /* ---------------------------------------------
           TOTAL
        --------------------------------------------- */

        const totalElement =
            document.getElementById(
                "cartTotal"
            );


        if (totalElement) {

            totalElement.textContent =
                formatMoney(total);

        }


        /* ---------------------------------------------
           ITEM COUNT
        --------------------------------------------- */

        const cartItemsText =
            document.getElementById(
                "cartItemsText"
            );


        if (cartItemsText) {

            const count =
                getTotalItems();

            cartItemsText.textContent =
                `${count} ${
                    count === 1
                        ? "item"
                        : "items"
                }`;

        }


        updateCouponUI();

    }


    /* =====================================================
       RESET SUMMARY
    ===================================================== */

    function resetSummary() {

        const elements = {

            subtotal:
                document.getElementById(
                    "cartSubtotal"
                ),

            discount:
                document.getElementById(
                    "cartDiscount"
                ),

            delivery:
                document.getElementById(
                    "cartDelivery"
                ),

            total:
                document.getElementById(
                    "cartTotal"
                ),

            discountRow:
                document.getElementById(
                    "discountRow"
                ),

            itemsText:
                document.getElementById(
                    "cartItemsText"
                )

        };


        if (elements.subtotal) {
            elements.subtotal.textContent =
                "₹0";
        }

        if (elements.discount) {
            elements.discount.textContent =
                "-₹0";
        }

        if (elements.delivery) {
            elements.delivery.textContent =
                "₹0";
        }

        if (elements.total) {
            elements.total.textContent =
                "₹0";
        }

        if (elements.discountRow) {
            elements.discountRow.style.display =
                "none";
        }

        if (elements.itemsText) {
            elements.itemsText.textContent =
                "0 items";
        }


        const deliveryMessage =
            document.getElementById(
                "deliveryMessage"
            );

        if (deliveryMessage) {

            deliveryMessage.textContent =
                "Free delivery on orders above ₹499";

        }


        updateCouponUI();

    }


    /* =====================================================
       COUPON SYSTEM
    ===================================================== */

    const COUPONS = {

        WELCOME20: {

            code: "WELCOME20",

            type: "percent",

            value: 20,

            minAmount: 499,

            description:
                "20% OFF on orders above ₹499"

        },


        SAVE100: {

            code: "SAVE100",

            type: "fixed",

            value: 100,

            minAmount: 999,

            description:
                "₹100 OFF on orders above ₹999"

        },


        DRYFRUIT10: {

            code: "DRYFRUIT10",

            type: "percent",

            value: 10,

            minAmount: 299,

            description:
                "10% OFF on orders above ₹299"

        }

    };


    function applyCoupon() {

        const input =
            document.getElementById(
                "couponInput"
            );


        if (!input) return;


        const code =
            input.value
                .trim()
                .toUpperCase();


        if (!code) {

            showCouponMessage(
                "Please enter a coupon code.",
                "error"
            );

            return;
        }


        const coupon =
            COUPONS[code];


        if (!coupon) {

            showCouponMessage(
                "Invalid coupon code.",
                "error"
            );

            return;
        }


        const subtotal =
            getCartSubtotal();


        if (
            subtotal <
            coupon.minAmount
        ) {

            showCouponMessage(
                `Minimum order value for ${code} is ${formatMoney(coupon.minAmount)}.`,
                "error"
            );

            return;
        }


        appliedCoupon = {
            code: coupon.code,
            type: coupon.type,
            value: coupon.value,
            minAmount: coupon.minAmount
        };


        saveCoupon();


        input.value = coupon.code;


        showCouponMessage(
            `${coupon.code} applied successfully — ${coupon.description}.`,
            "success"
        );


        updateCartSummary();

    }


    function removeCoupon() {

        appliedCoupon = null;

        saveCoupon();


        const input =
            document.getElementById(
                "couponInput"
            );


        if (input) {
            input.value = "";
        }


        showCouponMessage(
            "Coupon removed.",
            "error"
        );


        updateCartSummary();

    }


    function updateCouponUI() {

        const input =
            document.getElementById(
                "couponInput"
            );


        const button =
            document.getElementById(
                "applyCouponBtn"
            );


        if (
            appliedCoupon &&
            input &&
            button
        ) {

            input.value =
                appliedCoupon.code;


            button.textContent =
                "Remove";


            button.classList.add(
                "coupon-remove-mode"
            );

        } else {

            if (button) {

                button.textContent =
                    "Apply";

                button.classList.remove(
                    "coupon-remove-mode"
                );

            }

        }

    }


    function showCouponMessage(
        message,
        type
    ) {

        const element =
            document.getElementById(
                "couponMessage"
            );


        if (!element) return;


        element.textContent =
            message;


        element.className =
            "coupon-message " +
            type;

    }


    /* =====================================================
       CHECKOUT
    ===================================================== */

    function goToCheckout() {

        if (cart.length === 0) {

            showCartMessage(
                "Your cart is empty.",
                "error"
            );

            return;
        }


        const subtotal =
            getCartSubtotal();


        if (subtotal <= 0) {

            showCartMessage(
                "Please add a valid product to continue.",
                "error"
            );

            return;
        }


        window.location.href =
            "checkout.html";

    }


    /* =====================================================
       GLOBAL CART COUNT
    ===================================================== */

    function updateGlobalCartCount() {

        const count =
            getTotalItems();


        const elements =
            document.querySelectorAll(
                "#cartCount"
            );


        elements.forEach(
            function (element) {

                element.textContent =
                    count;

            }
        );

    }


    /* =====================================================
       MESSAGE
    ===================================================== */

    function showCartMessage(
        message,
        type = "success"
    ) {

        if (
            typeof showToast ===
            "function"
        ) {

            showToast(
                message,
                type
            );

            return;
        }


        /*
         * Fallback if app.js toast
         * is not available.
         */

        console.log(
            `[${type}] ${message}`
        );

    }


    /* =====================================================
       BUTTON EVENTS
    ===================================================== */

    const clearCartBtn =
        document.getElementById(
            "clearCartBtn"
        );


    if (clearCartBtn) {

        clearCartBtn.addEventListener(
            "click",
            clearCart
        );

    }


    const applyCouponBtn =
        document.getElementById(
            "applyCouponBtn"
        );


    if (applyCouponBtn) {

        applyCouponBtn.addEventListener(
            "click",
            function () {

                if (appliedCoupon) {

                    removeCoupon();

                } else {

                    applyCoupon();

                }

            }
        );

    }


    const couponInput =
        document.getElementById(
            "couponInput"
        );


    if (couponInput) {

        couponInput.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key === "Enter"
                ) {

                    event.preventDefault();

                    if (appliedCoupon) {

                        removeCoupon();

                    } else {

                        applyCoupon();

                    }

                }

            }
        );

    }


    const checkoutBtn =
        document.getElementById(
            "checkoutBtn"
        );


    if (checkoutBtn) {

        checkoutBtn.addEventListener(
            "click",
            goToCheckout
        );

    }


    /* =====================================================
       INITIALIZE
    ===================================================== */

    /*
     * Restore coupon from localStorage
     */

    if (appliedCoupon) {

        const subtotal =
            getCartSubtotal();


        if (
            subtotal <
            Number(appliedCoupon.minAmount)
        ) {

            appliedCoupon = null;

            saveCoupon();

        }

    }


    renderCart();

    updateGlobalCartCount();


    /* =====================================================
       EXPORT
    ===================================================== */

    window.DryFruitCart = {

        getCart: function () {
            return cart;
        },

        getSubtotal: function () {
            return getCartSubtotal();
        },

        getTotalItems: function () {
            return getTotalItems();
        },

        clearCart: clearCart,

        removeItem: removeItem,

        increaseQuantity:
            increaseQuantity,

        decreaseQuantity:
            decreaseQuantity,

        applyCoupon:
            applyCoupon,

        removeCoupon:
            removeCoupon

    };

});