/* =========================================================
   MISHRA DRY FRUIT MART - ORDER DETAILS
   File: frontend/js/order-details.js
========================================================= */

(function () {
    "use strict";

    const ORDERS_KEY = "dryfruit_orders";
    const USER_KEY = "dryfruit_current_user";

    document.addEventListener(
        "DOMContentLoaded",
        initOrderDetails
    );


    // ========================================================
    // INIT
    // ========================================================

    function initOrderDetails() {

        const content =
            document.getElementById(
                "orderDetailsContent"
            );

        if (!content) {
            return;
        }

        const user = getCurrentUser();

        if (!user) {
            showLoginRequired();
            return;
        }

        const orderId =
            getOrderIdFromURL();

        if (!orderId) {
            showOrderNotFound();
            return;
        }

        const order =
            findUserOrder(
                user,
                orderId
            );

        if (!order) {
            showOrderNotFound();
            return;
        }

        content.style.display = "block";

        renderOrder(order);
    }


    // ========================================================
    // CURRENT USER
    // ========================================================

    function getCurrentUser() {

        try {

            const data =
                localStorage.getItem(USER_KEY);

            return data
                ? JSON.parse(data)
                : null;

        } catch (error) {

            return null;
        }
    }


    // ========================================================
    // URL ORDER ID
    // ========================================================

    function getOrderIdFromURL() {

        const params =
            new URLSearchParams(
                window.location.search
            );

        return params.get("id");
    }


    // ========================================================
    // FIND ORDER
    // ========================================================

    function findUserOrder(
        user,
        orderId
    ) {

        let orders = [];

        try {

            orders =
                JSON.parse(
                    localStorage.getItem(
                        ORDERS_KEY
                    ) || "[]"
                );

        } catch (error) {

            orders = [];
        }

        if (!Array.isArray(orders)) {
            return null;
        }

        const userEmail =
            String(user.email || "")
                .trim()
                .toLowerCase();

        const userId =
            String(user.id || "")
                .trim();

        return orders.find(order => {

            const currentOrderId =
                String(
                    order.orderId ||
                    order.id ||
                    ""
                );

            if (
                currentOrderId !==
                String(orderId)
            ) {
                return false;
            }

            const orderEmail =
                String(
                    order.customer?.email ||
                    order.email ||
                    ""
                )
                .trim()
                .toLowerCase();

            const orderUserId =
                String(
                    order.customer?.userId ||
                    order.userId ||
                    ""
                )
                .trim();

            if (
                userId &&
                orderUserId &&
                userId === orderUserId
            ) {
                return true;
            }

            if (
                userEmail &&
                orderEmail &&
                userEmail === orderEmail
            ) {
                return true;
            }

            return false;
        });
    }


    // ========================================================
    // RENDER ORDER
    // ========================================================

    function renderOrder(order) {

        renderBasicInfo(order);

        renderTracking(order);

        renderItems(order);

        renderAddress(order);

        renderSummary(order);
    }


    // ========================================================
    // BASIC INFO
    // ========================================================

    function renderBasicInfo(order) {

        const orderId =
            order.orderId ||
            order.id ||
            "ORDER";

        const orderDate =
            formatDate(
                order.createdAt
            );

        const status =
            order.status ||
            "Placed";

        const idElement =
            document.getElementById(
                "detailOrderId"
            );

        const dateElement =
            document.getElementById(
                "detailOrderDate"
            );

        const statusElement =
            document.getElementById(
                "detailOrderStatus"
            );

        if (idElement) {
            idElement.textContent =
                orderId;
        }

        if (dateElement) {
            dateElement.textContent =
                "Ordered on " +
                orderDate;
        }

        if (statusElement) {

            statusElement.className =
                "detail-status " +
                getStatusClass(status);

            statusElement.innerHTML = `
                <i class="${getStatusIcon(status)}"></i>
                ${escapeHTML(status)}
            `;
        }
    }


    // ========================================================
    // TRACKING
    // ========================================================

    function renderTracking(order) {

        const status =
            String(
                order.status ||
                "Placed"
            )
            .toLowerCase();

        const steps = {
            placed:
                document.getElementById(
                    "trackingPlaced"
                ),

            processing:
                document.getElementById(
                    "trackingProcessing"
                ),

            shipped:
                document.getElementById(
                    "trackingShipped"
                ),

            delivered:
                document.getElementById(
                    "trackingDelivered"
                )
        };

        const lines = [
            document.getElementById(
                "trackingLine1"
            ),
            document.getElementById(
                "trackingLine2"
            ),
            document.getElementById(
                "trackingLine3"
            )
        ];

        Object.values(steps)
            .forEach(step => {

                if (step) {
                    step.classList.remove(
                        "active",
                        "completed"
                    );
                }
            });

        lines.forEach(line => {

            if (line) {
                line.classList.remove(
                    "active"
                );
            }
        });


        if (
            status.includes("cancel")
        ) {
            steps.placed?.classList.add(
                "active"
            );

            return;
        }


        let currentStep = 0;

        if (
            status.includes("process")
        ) {
            currentStep = 1;
        }

        if (
            status.includes("ship")
        ) {
            currentStep = 2;
        }

        if (
            status.includes("deliver")
        ) {
            currentStep = 3;
        }


        const stepList = [
            steps.placed,
            steps.processing,
            steps.shipped,
            steps.delivered
        ];

        stepList.forEach(
            (step, index) => {

                if (!step) {
                    return;
                }

                if (index <= currentStep) {

                    step.classList.add(
                        index === currentStep
                            ? "active"
                            : "completed"
                    );
                }
            }
        );


        lines.forEach(
            (line, index) => {

                if (
                    line &&
                    index < currentStep
                ) {
                    line.classList.add(
                        "active"
                    );
                }
            }
        );
    }


    // ========================================================
    // ITEMS
    // ========================================================

    function renderItems(order) {

        const container =
            document.getElementById(
                "detailOrderItems"
            );

        if (!container) {
            return;
        }

        const items =
            Array.isArray(order.items)
                ? order.items
                : [];

        if (!items.length) {

            container.innerHTML = `
                <p class="text-muted mb-0">
                    No item information available.
                </p>
            `;

            return;
        }

        container.innerHTML =
            items
                .map(createItem)
                .join("");
    }


    function createItem(item) {

        const product =
            getProduct(item);

        const name =
            item.name ||
            product?.name ||
            "Dry Fruit Product";

        const image =
            item.image ||
            product?.image ||
            "";

        const quantity =
            Number(
                item.quantity || 1
            );

        const weight =
            item.weight ||
            item.size ||
            item.selectedSize ||
            product?.weight ||
            "";

        const price =
            Number(
                item.price ??
                product?.price ??
                0
            );

        return `
            <div class="detail-order-item">

                <img
                    class="detail-order-image"
                    src="${escapeAttribute(image)}"
                    alt="${escapeAttribute(name)}"
                    onerror="this.style.display='none'"
                >

                <div class="detail-order-info">

                    <div class="detail-order-name">
                        ${escapeHTML(name)}
                    </div>

                    <div class="detail-order-meta">

                        ${
                            weight
                                ? escapeHTML(weight) +
                                  " × "
                                : ""
                        }

                        ${quantity}

                        ${
                            quantity > 1
                                ? " items"
                                : " item"
                        }

                    </div>

                </div>

                <div class="detail-order-price">
                    ${formatPrice(
                        price * quantity
                    )}
                </div>

            </div>
        `;
    }


    // ========================================================
    // ADDRESS
    // ========================================================

    function renderAddress(order) {

        const container =
            document.getElementById(
                "detailAddress"
            );

        if (!container) {
            return;
        }

        const customer =
            order.customer || {};

        const address =
            order.shippingAddress || {};

        const name =
            customer.name ||
            `${customer.firstName || ""} ${customer.lastName || ""}`
                .trim() ||
            "Customer";

        const phone =
            customer.phone ||
            "";

        const addressLine =
            address.address ||
            "";

        const city =
            address.city ||
            "";

        const state =
            address.state ||
            "";

        const pincode =
            address.pincode ||
            "";

        const type =
            order.addressType ||
            "Home";

        container.innerHTML = `

            <strong>
                ${escapeHTML(name)}
            </strong>

            <div>
                ${escapeHTML(addressLine)}
            </div>

            <div>
                ${escapeHTML(city)},
                ${escapeHTML(state)}
                - ${escapeHTML(pincode)}
            </div>

            ${
                phone
                    ? `
                        <div>
                            <i class="fas fa-phone me-1"></i>
                            ${escapeHTML(phone)}
                        </div>
                    `
                    : ""
            }

            <span class="address-type">
                <i class="fas fa-map-marker-alt me-1"></i>
                ${escapeHTML(type)}
            </span>
        `;
    }


    // ========================================================
    // SUMMARY
    // ========================================================

    function renderSummary(order) {

        const pricing =
            order.pricing || {};

        const subtotal =
            Number(
                pricing.subtotal ??
                order.subtotal ??
                0
            );

        const discount =
            Number(
                pricing.discount ??
                order.discount ??
                0
            );

        const delivery =
            Number(
                pricing.delivery ??
                order.delivery ??
                0
            );

        const total =
            Number(
                pricing.total ??
                order.total ??
                (
                    subtotal -
                    discount +
                    delivery
                )
            );

        setText(
            "detailSubtotal",
            formatPrice(subtotal)
        );

        setText(
            "detailDiscount",
            "-" + formatPrice(discount)
        );

        setText(
            "detailDelivery",
            delivery === 0
                ? "FREE"
                : formatPrice(delivery)
        );

        setText(
            "detailTotal",
            formatPrice(total)
        );


        const discountRow =
            document.getElementById(
                "detailDiscountRow"
            );

        if (discountRow) {

            discountRow.style.display =
                discount > 0
                    ? "flex"
                    : "none";
        }


        const payment =
            document.getElementById(
                "detailPayment"
            );

        if (payment) {

            payment.textContent =
                formatPayment(
                    order.paymentMethod
                );
        }
    }


    // ========================================================
    // PRODUCT
    // ========================================================

    function getProduct(item) {

        if (
            typeof window.getProductById !==
            "function"
        ) {
            return null;
        }

        const id =
            item.productId ||
            item.id;

        if (!id) {
            return null;
        }

        return window.getProductById(
            Number(id)
        );
    }


    // ========================================================
    // PAYMENT
    // ========================================================

    function formatPayment(method) {

        const value =
            String(method || "")
                .toLowerCase();

        if (
            value === "cod" ||
            value.includes("cash")
        ) {
            return "Cash on Delivery";
        }

        if (
            value === "online" ||
            value.includes("online")
        ) {
            return "Online Payment";
        }

        return method || "Cash on Delivery";
    }


    // ========================================================
    // STATUS
    // ========================================================

    function getStatusClass(status) {

        const value =
            String(status || "")
                .toLowerCase();

        if (value.includes("deliver")) {
            return "status-delivered";
        }

        if (value.includes("cancel")) {
            return "status-cancelled";
        }

        if (value.includes("ship")) {
            return "status-shipped";
        }

        if (value.includes("process")) {
            return "status-processing";
        }

        return "";
    }


    function getStatusIcon(status) {

        const value =
            String(status || "")
                .toLowerCase();

        if (value.includes("deliver")) {
            return "fas fa-check-circle";
        }

        if (value.includes("cancel")) {
            return "fas fa-times-circle";
        }

        if (value.includes("ship")) {
            return "fas fa-truck";
        }

        if (value.includes("process")) {
            return "fas fa-spinner";
        }

        return "fas fa-clock";
    }


    // ========================================================
    // DATE
    // ========================================================

    function formatDate(value) {

        if (!value) {
            return "Date unavailable";
        }

        const date =
            new Date(value);

        if (isNaN(date.getTime())) {
            return "Date unavailable";
        }

        return date.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );
    }


    // ========================================================
    // SHOW LOGIN
    // ========================================================

    function showLoginRequired() {

        const login =
            document.getElementById(
                "orderLoginRequired"
            );

        const notFound =
            document.getElementById(
                "orderNotFound"
            );

        const content =
            document.getElementById(
                "orderDetailsContent"
            );

        if (login) {
            login.style.display = "block";
        }

        if (notFound) {
            notFound.style.display = "none";
        }

        if (content) {
            content.style.display = "none";
        }
    }


    // ========================================================
    // NOT FOUND
    // ========================================================

    function showOrderNotFound() {

        const login =
            document.getElementById(
                "orderLoginRequired"
            );

        const notFound =
            document.getElementById(
                "orderNotFound"
            );

        const content =
            document.getElementById(
                "orderDetailsContent"
            );

        if (login) {
            login.style.display = "none";
        }

        if (notFound) {
            notFound.style.display = "block";
        }

        if (content) {
            content.style.display = "none";
        }
    }


    // ========================================================
    // SET TEXT
    // ========================================================

    function setText(id, value) {

        const element =
            document.getElementById(id);

        if (element) {
            element.textContent = value;
        }
    }


    // ========================================================
    // FORMAT PRICE
    // ========================================================

    function formatPrice(amount) {

        return "₹" +
            Number(amount || 0)
                .toLocaleString(
                    "en-IN",
                    {
                        maximumFractionDigits: 2
                    }
                );
    }


    // ========================================================
    // ESCAPE
    // ========================================================

    function escapeHTML(value) {

        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    function escapeAttribute(value) {
        return escapeHTML(value);
    }


    // ========================================================
    // PUBLIC API
    // ========================================================

    window.DryFruitOrderDetails = {
        getCurrentUser,
        findUserOrder,
        renderOrder
    };

})();