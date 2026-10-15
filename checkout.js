/* =========================================================
   MISHRA DRY FRUIT MART - CHECKOUT JS
   File: frontend/js/checkout.js
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    // Run only on checkout page
    const checkoutForm = document.getElementById("checkoutForm");

    if (!checkoutForm) {
        return;
    }

    /* =====================================================
       DOM ELEMENTS
       ===================================================== */

    const checkoutEmpty = document.getElementById("checkoutEmpty");
    const checkoutContent = document.getElementById("checkoutContent");

    const checkoutItems = document.getElementById("checkoutItems");
    const checkoutSubtotal = document.getElementById("checkoutSubtotal");
    const checkoutDiscountRow = document.getElementById("checkoutDiscountRow");
    const checkoutDiscount = document.getElementById("checkoutDiscount");
    const checkoutDelivery = document.getElementById("checkoutDelivery");
    const checkoutTotal = document.getElementById("checkoutTotal");
    const checkoutSaving = document.getElementById("checkoutSaving");

    const placeOrderBtn = document.getElementById("placeOrderBtn");

    const onlinePaymentNotice =
        document.getElementById("onlinePaymentNotice");

    const orderSuccessModal =
        document.getElementById("orderSuccessModal");

    const successOrderNumber =
        document.getElementById("successOrderNumber");

    /* =====================================================
       CONSTANTS
       ===================================================== */

    const FREE_DELIVERY_LIMIT = 499;
    const DELIVERY_CHARGE = 49;

    const CART_KEY = "dryfruit_cart";
    const COUPON_KEY = "dryfruit_coupon";
    const ORDERS_KEY = "dryfruit_orders";
    const LAST_ORDER_KEY = "dryfruit_last_order";

    /* =====================================================
       LOAD CART
       ===================================================== */

    let cart = loadCart();
    let coupon = loadCoupon();

    /* =====================================================
       INIT
       ===================================================== */

    initCheckout();

    function initCheckout() {

        if (!cart || cart.length === 0) {
            showEmptyCheckout();
            return;
        }

        showCheckout();

        renderCheckoutItems();
        updateCheckoutSummary();
        setupPaymentOptions();
        setupFormValidation();
        setupFormSubmit();
        updateNavbarCartCount();
    }

    /* =====================================================
       LOCAL STORAGE
       ===================================================== */

    function loadCart() {

        try {

            const savedCart = localStorage.getItem(CART_KEY);

            if (!savedCart) {
                return [];
            }

            const parsedCart = JSON.parse(savedCart);

            return Array.isArray(parsedCart) ? parsedCart : [];

        } catch (error) {

            console.error("Cart loading error:", error);

            return [];
        }
    }

    function loadCoupon() {

        try {

            const savedCoupon = localStorage.getItem(COUPON_KEY);

            if (!savedCoupon) {
                return null;
            }

            return JSON.parse(savedCoupon);

        } catch (error) {

            console.error("Coupon loading error:", error);

            return null;
        }
    }

    function saveOrders(orders) {

        localStorage.setItem(
            ORDERS_KEY,
            JSON.stringify(orders)
        );
    }

    /* =====================================================
       EMPTY CHECKOUT
       ===================================================== */

    function showEmptyCheckout() {

        if (checkoutContent) {
            checkoutContent.style.display = "none";
        }

        if (checkoutEmpty) {
            checkoutEmpty.style.display = "block";
        }

    }

    /* =====================================================
       SHOW CHECKOUT
       ===================================================== */

    function showCheckout() {

        if (checkoutContent) {
            checkoutContent.style.display = "block";
        }

        if (checkoutEmpty) {
            checkoutEmpty.style.display = "none";
        }

    }

    /* =====================================================
       RENDER CHECKOUT ITEMS
       ===================================================== */

    function renderCheckoutItems() {

        if (!checkoutItems) {
            return;
        }

        checkoutItems.innerHTML = "";

        cart.forEach(function (item) {

            const product = getProduct(item);

            if (!product) {
                return;
            }

            const quantity =
                Number(item.quantity) > 0
                    ? Number(item.quantity)
                    : 1;

            const price =
                Number(item.price) > 0
                    ? Number(item.price)
                    : Number(product.price);

            const itemTotal = price * quantity;

            const weight =
                item.weight ||
                item.size ||
                product.weight ||
                "Standard";

            const div = document.createElement("div");

            div.className = "checkout-item";

            div.innerHTML = `
                <div class="checkout-item-image">
                    <img
                        src="${escapeHTML(product.image)}"
                        alt="${escapeHTML(product.name)}"
                        loading="lazy"
                        onerror="this.src='https://via.placeholder.com/100x100?text=Dry+Fruit'"
                    >

                    <span class="checkout-item-quantity">
                        ${quantity}
                    </span>
                </div>

                <div class="checkout-item-info">
                    <h6>${escapeHTML(product.name)}</h6>

                    <p>
                        ${escapeHTML(weight)}
                    </p>
                </div>

                <div class="checkout-item-price">
                    ${formatMoney(itemTotal)}
                </div>
            `;

            checkoutItems.appendChild(div);

        });

    }

    /* =====================================================
       FIND PRODUCT
       ===================================================== */

    function getProduct(item) {

        if (!item) {
            return null;
        }

        if (
            typeof getProductById === "function" &&
            item.id !== undefined
        ) {

            const product = getProductById(item.id);

            if (product) {
                return product;
            }
        }

        if (
            window.DryFruitStore &&
            typeof window.DryFruitStore.getProductById === "function"
        ) {

            return window.DryFruitStore.getProductById(item.id);

        }

        return null;
    }

    /* =====================================================
       SUBTOTAL
       ===================================================== */

    function getSubtotal() {

        return cart.reduce(function (total, item) {

            const product = getProduct(item);

            if (!product) {
                return total;
            }

            const quantity =
                Number(item.quantity) > 0
                    ? Number(item.quantity)
                    : 1;

            const price =
                Number(item.price) > 0
                    ? Number(item.price)
                    : Number(product.price);

            return total + (price * quantity);

        }, 0);

    }

    /* =====================================================
       COUPON DISCOUNT
       ===================================================== */

    function getCouponDiscount(subtotal) {

        if (!coupon || !coupon.code) {
            return 0;
        }

        const code =
            String(coupon.code)
                .trim()
                .toUpperCase();

        switch (code) {

            case "WELCOME20":

                if (subtotal >= 499) {
                    return Math.round(subtotal * 0.20);
                }

                return 0;

            case "SAVE100":

                if (subtotal >= 999) {
                    return 100;
                }

                return 0;

            case "DRYFRUIT10":

                if (subtotal >= 299) {
                    return Math.round(subtotal * 0.10);
                }

                return 0;

            default:
                return 0;
        }

    }

    /* =====================================================
       DELIVERY CHARGE
       ===================================================== */

    function getDeliveryCharge(amountAfterDiscount) {

        if (amountAfterDiscount >= FREE_DELIVERY_LIMIT) {
            return 0;
        }

        return DELIVERY_CHARGE;
    }

    /* =====================================================
       UPDATE SUMMARY
       ===================================================== */

    function updateCheckoutSummary() {

        const subtotal = getSubtotal();

        const discount = getCouponDiscount(subtotal);

        const amountAfterDiscount =
            Math.max(0, subtotal - discount);

        const delivery =
            getDeliveryCharge(amountAfterDiscount);

        const total =
            amountAfterDiscount + delivery;

        // Subtotal
        if (checkoutSubtotal) {
            checkoutSubtotal.textContent =
                formatMoney(subtotal);
        }

        // Discount
        if (checkoutDiscountRow) {

            if (discount > 0) {

                checkoutDiscountRow.style.display = "flex";

            } else {

                checkoutDiscountRow.style.display = "none";

            }
        }

        if (checkoutDiscount) {

            checkoutDiscount.textContent =
                "-" + formatMoney(discount);

        }

        // Delivery
        if (checkoutDelivery) {

            if (delivery === 0) {

                checkoutDelivery.textContent = "FREE";

                checkoutDelivery.classList.add("text-success");

            } else {

                checkoutDelivery.textContent =
                    formatMoney(delivery);

                checkoutDelivery.classList.remove(
                    "text-success"
                );

            }

        }

        // Total
        if (checkoutTotal) {

            checkoutTotal.textContent =
                formatMoney(total);

        }

        // Saving
        if (checkoutSaving) {

            let saving = discount;

            if (delivery === 0) {
                saving += DELIVERY_CHARGE;
            }

            checkoutSaving.textContent =
                `You're saving ${formatMoney(saving)} on this order`;

        }

    }

    /* =====================================================
       PAYMENT OPTIONS
       ===================================================== */

    function setupPaymentOptions() {

        const paymentOptions =
            document.querySelectorAll(
                'input[name="paymentMethod"]'
            );

        paymentOptions.forEach(function (input) {

            input.addEventListener("change", function () {

                updatePaymentUI();

            });

        });

        updatePaymentUI();

    }

    function updatePaymentUI() {

        const selectedPayment =
            document.querySelector(
                'input[name="paymentMethod"]:checked'
            );

        const paymentMethod =
            selectedPayment
                ? selectedPayment.value
                : "cod";

        if (onlinePaymentNotice) {

            if (paymentMethod === "online") {

                onlinePaymentNotice.style.display = "block";

            } else {

                onlinePaymentNotice.style.display = "none";

            }

        }

        // Active payment card
        document
            .querySelectorAll(".payment-option")
            .forEach(function (option) {

                const radio =
                    option.querySelector(
                        'input[name="paymentMethod"]'
                    );

                if (
                    radio &&
                    radio.checked
                ) {

                    option.classList.add("active");

                } else {

                    option.classList.remove("active");

                }

            });

    }

    /* =====================================================
       FORM VALIDATION
       ===================================================== */

    function setupFormValidation() {

        const fields = checkoutForm.querySelectorAll(
            "input, select, textarea"
        );

        fields.forEach(function (field) {

            field.addEventListener("input", function () {

                clearFieldError(field);

            });

            field.addEventListener("change", function () {

                clearFieldError(field);

            });

        });

    }

    /* =====================================================
       FORM SUBMIT
       ===================================================== */

    function setupFormSubmit() {

        checkoutForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();

                if (!validateForm()) {
                    return;
                }

                placeOrder();

            }
        );

    }

    /* =====================================================
       VALIDATE FORM
       ===================================================== */

    function validateForm() {

        let isValid = true;

        const firstName =
            document.getElementById("firstName");

        const lastName =
            document.getElementById("lastName");

        const email =
            document.getElementById("email");

        const phone =
            document.getElementById("phone");

        const address =
            document.getElementById("address");

        const city =
            document.getElementById("city");

        const state =
            document.getElementById("state");

        const pincode =
            document.getElementById("pincode");

        const terms =
            document.getElementById("terms");

        // First name
        if (
            !firstName ||
            firstName.value.trim().length < 2
        ) {

            showFieldError(
                firstName,
                "Please enter your first name."
            );

            isValid = false;

        }

        // Last name
        if (
            !lastName ||
            lastName.value.trim().length < 2
        ) {

            showFieldError(
                lastName,
                "Please enter your last name."
            );

            isValid = false;

        }

        // Email
        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (
            !email ||
            !emailRegex.test(email.value.trim())
        ) {

            showFieldError(
                email,
                "Please enter a valid email address."
            );

            isValid = false;

        }

        // Phone
        const phoneValue =
            phone
                ? phone.value.replace(/\D/g, "")
                : "";

        if (
            !/^[6-9][0-9]{9}$/.test(phoneValue)
        ) {

            showFieldError(
                phone,
                "Please enter a valid 10-digit mobile number."
            );

            isValid = false;

        }

        // Address
        if (
            !address ||
            address.value.trim().length < 10
        ) {

            showFieldError(
                address,
                "Please enter your complete address."
            );

            isValid = false;

        }

        // City
        if (
            !city ||
            city.value.trim().length < 2
        ) {

            showFieldError(
                city,
                "Please enter your city."
            );

            isValid = false;

        }

        // State
        if (
            !state ||
            !state.value
        ) {

            showFieldError(
                state,
                "Please select your state."
            );

            isValid = false;

        }

        // Pincode
        const pincodeValue =
            pincode
                ? pincode.value.replace(/\D/g, "")
                : "";

        if (
            !/^[1-9][0-9]{5}$/.test(pincodeValue)
        ) {

            showFieldError(
                pincode,
                "Please enter a valid 6-digit pincode."
            );

            isValid = false;

        }

        // Terms
        if (
            !terms ||
            !terms.checked
        ) {

            if (terms) {

                terms.classList.add("is-invalid");

            }

            showToastMessage(
                "Please accept the terms and conditions.",
                "warning"
            );

            isValid = false;

        }

        // Payment
        const selectedPayment =
            document.querySelector(
                'input[name="paymentMethod"]:checked'
            );

        if (
            selectedPayment &&
            selectedPayment.value === "online"
        ) {

            showToastMessage(
                "Online payment gateway is not connected yet. Please select Cash on Delivery.",
                "warning"
            );

            isValid = false;

        }

        return isValid;

    }

    /* =====================================================
       FIELD ERROR
       ===================================================== */

    function showFieldError(field, message) {

        if (!field) {
            return;
        }

        field.classList.add("is-invalid");

        let feedback =
            field.parentElement.querySelector(
                ".invalid-feedback"
            );

        if (!feedback) {

            feedback =
                document.createElement("div");

            feedback.className =
                "invalid-feedback";

            field.parentElement.appendChild(
                feedback
            );

        }

        feedback.textContent = message;

    }

    function clearFieldError(field) {

        if (!field) {
            return;
        }

        field.classList.remove("is-invalid");

        if (field.id === "terms") {
            field.classList.remove("is-invalid");
        }

        const feedback =
            field.parentElement.querySelector(
                ".invalid-feedback"
            );

        if (feedback) {
            feedback.textContent = "";
        }

    }

    /* =====================================================
       PLACE ORDER
       ===================================================== */

    function placeOrder() {

        if (!cart.length) {

            showEmptyCheckout();

            return;
        }

        // Prevent duplicate clicks
        if (placeOrderBtn) {

            placeOrderBtn.disabled = true;

            placeOrderBtn.innerHTML = `
                <span
                    class="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true">
                </span>
                Placing Order...
            `;

        }

        // Small delay for better UX
        setTimeout(function () {

            const order = createOrder();

            saveOrder(order);

            clearCartAfterOrder();

            showOrderSuccess(order);

        }, 700);

    }

    /* =====================================================
       CREATE ORDER
       ===================================================== */

    function createOrder() {

        const subtotal = getSubtotal();

        const discount =
            getCouponDiscount(subtotal);

        const amountAfterDiscount =
            Math.max(
                0,
                subtotal - discount
            );

        const delivery =
            getDeliveryCharge(
                amountAfterDiscount
            );

        const total =
            amountAfterDiscount + delivery;

        const selectedPayment =
            document.querySelector(
                'input[name="paymentMethod"]:checked'
            );

        const selectedAddress =
            document.querySelector(
                'input[name="addressType"]:checked'
            );

        const orderNumber =
            generateOrderNumber();

        const order = {
            customer: {
    userId: (() => {
        try {
            const currentUser =
                JSON.parse(
                    localStorage.getItem("dryfruit_current_user") || "null"
                );

            return currentUser?.id || "";
        } catch (error) {
            return "";
        }
    })(),

    firstName: firstName.value.trim(),
    lastName: lastName.value.trim(),
    name: `${firstName.value.trim()} ${lastName.value.trim()}`,
    email: email.value.trim(),
    phone: phone.value.trim()
},

            id: orderNumber,

            orderNumber: orderNumber,

            createdAt:
                new Date().toISOString(),

            status: "Placed",

            paymentMethod:
                selectedPayment
                    ? selectedPayment.value
                    : "cod",

            paymentStatus: "Pending",

            addressType:
                selectedAddress
                    ? selectedAddress.value
                    : "home",

            customer: {

                firstName:
                    getValue("firstName"),

                lastName:
                    getValue("lastName"),

                name:
                    `${getValue("firstName")} ${getValue("lastName")}`.trim(),

                email:
                    getValue("email"),

                phone:
                    getValue("phone")

            },

            shippingAddress: {

                address:
                    getValue("address"),

                city:
                    getValue("city"),

                state:
                    getValue("state"),

                pincode:
                    getValue("pincode")

            },

            items: cart.map(function (item) {

                const product =
                    getProduct(item);

                return {

                    id: item.id,

                    cartKey:
                        item.cartKey || null,

                    name:
                        product
                            ? product.name
                            : item.name,

                    image:
                        product
                            ? product.image
                            : item.image,

                    category:
                        product
                            ? product.category
                            : item.category,

                    weight:
                        item.weight ||
                        item.size ||
                        (
                            product
                                ? product.weight
                                : ""
                        ),

                    price:
                        Number(item.price) ||
                        (
                            product
                                ? Number(product.price)
                                : 0
                        ),

                    quantity:
                        Number(item.quantity) || 1

                };

            }),

            coupon: coupon
                ? {
                    code: coupon.code,
                    discount: discount
                }
                : null,

            pricing: {

                subtotal: subtotal,

                discount: discount,

                delivery: delivery,

                total: total

            },

            notes:
                getValue("orderNotes"),

        };

        return order;

    }

    /* =====================================================
       SAVE ORDER
       ===================================================== */

    function saveOrder(order) {

        let orders = [];

        try {

            const savedOrders =
                localStorage.getItem(
                    ORDERS_KEY
                );

            if (savedOrders) {

                const parsed =
                    JSON.parse(savedOrders);

                if (Array.isArray(parsed)) {
                    orders = parsed;
                }

            }

        } catch (error) {

            console.error(
                "Orders loading error:",
                error
            );

        }

        orders.unshift(order);

        saveOrders(orders);

        localStorage.setItem(
            LAST_ORDER_KEY,
            JSON.stringify(order)
        );

    }

    /* =====================================================
       CLEAR CART AFTER ORDER
       ===================================================== */

    function clearCartAfterOrder() {

        cart = [];

        localStorage.removeItem(CART_KEY);

        localStorage.removeItem(COUPON_KEY);

        coupon = null;

        updateNavbarCartCount();

    }

    /* =====================================================
       SHOW SUCCESS MODAL
       ===================================================== */

    function showOrderSuccess(order) {

        if (successOrderNumber) {

            successOrderNumber.textContent =
                order.orderNumber;

        }

        if (orderSuccessModal) {

            if (
                typeof bootstrap !== "undefined"
            ) {

                const modal =
                    bootstrap.Modal.getOrCreateInstance(
                        orderSuccessModal
                    );

                modal.show();

            } else {

                orderSuccessModal.style.display =
                    "block";

            }

        }

        // Reset button
        if (placeOrderBtn) {

            placeOrderBtn.disabled = false;

            placeOrderBtn.innerHTML = `
                <i class="fas fa-check-circle me-2"></i>
                Order Placed
            `;

        }

    }

    /* =====================================================
       ORDER NUMBER
       ===================================================== */

    function generateOrderNumber() {

        const now = new Date();

        const year =
            now.getFullYear();

        const month =
            String(
                now.getMonth() + 1
            ).padStart(2, "0");

        const day =
            String(
                now.getDate()
            ).padStart(2, "0");

        const random =
            Math.floor(
                1000 +
                Math.random() * 9000
            );

        return `DFM${year}${month}${day}${random}`;

    }

    /* =====================================================
       GET VALUE
       ===================================================== */

    function getValue(id) {

        const element =
            document.getElementById(id);

        return element
            ? element.value.trim()
            : "";

    }

    /* =====================================================
       FORMAT MONEY
       ===================================================== */

    function formatMoney(amount) {

        const number =
            Number(amount) || 0;

        if (
            typeof formatPrice === "function"
        ) {

            return formatPrice(number);

        }

        return "₹" +
            number.toLocaleString(
                "en-IN"
            );

    }

    /* =====================================================
       ESCAPE HTML
       ===================================================== */

    function escapeHTML(value) {

        if (value === null || value === undefined) {
            return "";
        }

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }

    /* =====================================================
       UPDATE NAVBAR CART COUNT
       ===================================================== */

    function updateNavbarCartCount() {

        const cartCountElements =
            document.querySelectorAll(
                "#cartCount"
            );

        cartCountElements.forEach(
            function (element) {

                const count =
                    cart.reduce(
                        function (total, item) {

                            return total +
                                (
                                    Number(
                                        item.quantity
                                    ) || 1
                                );

                        },
                        0
                    );

                element.textContent =
                    count;

            }
        );

        // Also support alternate cart count class
        const cartBadges =
            document.querySelectorAll(
                ".cart-count"
            );

        cartBadges.forEach(
            function (element) {

                const count =
                    cart.reduce(
                        function (total, item) {

                            return total +
                                (
                                    Number(
                                        item.quantity
                                    ) || 1
                                );

                        },
                        0
                    );

                element.textContent =
                    count;

            }
        );

    }

    /* =====================================================
       TOAST MESSAGE
       ===================================================== */

    function showToastMessage(
        message,
        type = "info"
    ) {

        // Use app.js toast if available
        if (
            typeof showToast === "function"
        ) {

            showToast(
                message,
                type
            );

            return;
        }

        // Fallback toast
        const toast =
            document.getElementById("toast");

        const toastMessage =
            document.getElementById(
                "toastMessage"
            );

        if (toastMessage) {
            toastMessage.textContent =
                message;
        }

        if (toast) {

            toast.classList.add("show");

            setTimeout(function () {

                toast.classList.remove(
                    "show"
                );

            }, 3000);

        } else {

            alert(message);

        }

    }

    /* =====================================================
       PUBLIC API
       ===================================================== */

    window.DryFruitCheckout = {

        getCart: function () {
            return cart;
        },

        getSubtotal: getSubtotal,

        getDiscount: function () {
            return getCouponDiscount(
                getSubtotal()
            );
        },

        getTotal: function () {

            const subtotal =
                getSubtotal();

            const discount =
                getCouponDiscount(
                    subtotal
                );

            const afterDiscount =
                subtotal - discount;

            const delivery =
                getDeliveryCharge(
                    afterDiscount
                );

            return afterDiscount + delivery;

        },

        getOrders: function () {

            try {

                return JSON.parse(
                    localStorage.getItem(
                        ORDERS_KEY
                    )
                ) || [];

            } catch (error) {

                return [];

            }

        }

    };

});