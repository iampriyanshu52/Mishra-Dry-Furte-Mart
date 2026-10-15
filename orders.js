/* =========================================================
   MISHRA DRY FRUIT MART - MY ORDERS
   File: frontend/js/orders.js
========================================================= */

(function () {
    "use strict";

    const ORDERS_KEY = "dryfruit_orders";
    const USER_KEY = "dryfruit_current_user";

    // ---------------------------------------------------------
    // DOM Ready
    // ---------------------------------------------------------
    document.addEventListener("DOMContentLoaded", initOrders);

    // ---------------------------------------------------------
    // Initialize
    // ---------------------------------------------------------
    function initOrders() {

        const ordersList = document.getElementById("ordersList");

        if (!ordersList) {
            return;
        }

        const user = getCurrentUser();

        if (!user) {
            showLoginRequired();
            return;
        }

        showOrdersContent(user);

        renderOrders(user);
    }

    // ---------------------------------------------------------
    // Get Current User
    // ---------------------------------------------------------
    function getCurrentUser() {

        try {

            const user = localStorage.getItem(USER_KEY);

            if (!user) {
                return null;
            }

            return JSON.parse(user);

        } catch (error) {

            console.error(
                "Error reading current user:",
                error
            );

            return null;
        }
    }

    // ---------------------------------------------------------
    // Get All Orders
    // ---------------------------------------------------------
    function getAllOrders() {

        try {

            const orders =
                localStorage.getItem(ORDERS_KEY);

            if (!orders) {
                return [];
            }

            const parsed = JSON.parse(orders);

            return Array.isArray(parsed)
                ? parsed
                : [];

        } catch (error) {

            console.error(
                "Error reading orders:",
                error
            );

            return [];
        }
    }

    // ---------------------------------------------------------
    // Show Login Required
    // ---------------------------------------------------------
    function showLoginRequired() {

        const loginBox =
            document.getElementById(
                "ordersLoginRequired"
            );

        const content =
            document.getElementById(
                "ordersContent"
            );

        if (loginBox) {
            loginBox.style.display = "block";
        }

        if (content) {
            content.style.display = "none";
        }
    }

    // ---------------------------------------------------------
    // Show Orders Content
    // ---------------------------------------------------------
    function showOrdersContent(user) {

        const loginBox =
            document.getElementById(
                "ordersLoginRequired"
            );

        const content =
            document.getElementById(
                "ordersContent"
            );

        if (loginBox) {
            loginBox.style.display = "none";
        }

        if (content) {
            content.style.display = "block";
        }

        const userName =
            document.getElementById(
                "ordersUserName"
            );

        const userEmail =
            document.getElementById(
                "ordersUserEmail"
            );

        if (userName) {

            userName.textContent =
                user.name ||
                `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
                "Customer";
        }

        if (userEmail) {
            userEmail.textContent =
                user.email || "";
        }
    }

    // ---------------------------------------------------------
    // Filter Orders For Current User
    // ---------------------------------------------------------
    function getUserOrders(user) {

        const allOrders = getAllOrders();

        if (!user) {
            return [];
        }

        const userEmail =
            String(user.email || "")
                .trim()
                .toLowerCase();

        const userId =
            String(user.id || "")
                .trim();

        return allOrders.filter(order => {

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

            // Match by user ID if available
            if (
                userId &&
                orderUserId &&
                userId === orderUserId
            ) {
                return true;
            }

            // Match by email
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

    // ---------------------------------------------------------
    // Render Orders
    // ---------------------------------------------------------
    function renderOrders(user) {

        const ordersList =
            document.getElementById(
                "ordersList"
            );

        const ordersEmpty =
            document.getElementById(
                "ordersEmpty"
            );

        if (!ordersList) {
            return;
        }

        let orders = getUserOrders(user);

        // Latest order first
        orders.sort(
            (a, b) =>
                new Date(b.createdAt || 0) -
                new Date(a.createdAt || 0)
        );

        if (!orders.length) {

            ordersList.innerHTML = "";

            if (ordersEmpty) {
                ordersEmpty.style.display = "block";
            }

            return;
        }

        if (ordersEmpty) {
            ordersEmpty.style.display = "none";
        }

        ordersList.innerHTML =
            orders.map(createOrderCard).join("");
    }

    // ---------------------------------------------------------
    // Create Order Card
    // ---------------------------------------------------------
    function createOrderCard(order) {

        const orderId =
            escapeHTML(
                order.orderId ||
                order.id ||
                "ORDER"
            );

        const orderDate =
            formatDate(
                order.createdAt
            );

        const status =
            order.status ||
            "Placed";

        const paymentMethod =
            order.paymentMethod ||
            "COD";

        const total =
            Number(
                order.pricing?.total ??
                order.total ??
                0
            );

        const items =
            Array.isArray(order.items)
                ? order.items
                : [];

        const statusClass =
            getStatusClass(status);

        return `
            <div class="order-card">

                <div class="order-card-header">

                    <div>
                        <div class="order-id">
                            <i class="fas fa-receipt me-1"></i>
                            ${orderId}
                        </div>

                        <div class="order-date">
                            <i class="far fa-calendar-alt me-1"></i>
                            Ordered on ${orderDate}
                        </div>
                    </div>

                    <span class="order-status ${statusClass}">
                        <i class="${getStatusIcon(status)}"></i>
                        ${escapeHTML(status)}
                    </span>

                </div>


                <div class="order-items">

                    ${
                        items.length
                            ? items
                                .map(createOrderItem)
                                .join("")
                            : `
                                <div class="order-item">
                                    <div class="order-item-info">
                                        <div class="order-item-name">
                                            Order information unavailable
                                        </div>
                                    </div>
                                </div>
                            `
                    }

                </div>


                <div class="order-card-footer">

                    <div class="order-payment">

                        Payment:
                        <strong>
                            ${formatPaymentMethod(paymentMethod)}
                        </strong>

                    </div>

                    <div class="order-total">

                        Total:
                        <span>
                            ${formatPrice(total)}
                        </span>

                    </div>

                </div>

            </div>
        `;
    }

    // ---------------------------------------------------------
    // Create Order Item
    // ---------------------------------------------------------
    function createOrderItem(item) {

        const product =
            getProductFromItem(item);

        const name =
            item.name ||
            product?.name ||
            "Dry Fruit Product";

        const image =
            item.image ||
            product?.image ||
            "https://images.unsplash.com/photo-1599599810694-b5ac5a0a4c9f?auto=format&fit=crop&w=300&q=80";

        const quantity =
            Number(item.quantity || 1);

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
            <div class="order-item">

                <img
                    src="${escapeAttribute(image)}"
                    alt="${escapeAttribute(name)}"
                    class="order-item-image"
                    onerror="this.src='https://images.unsplash.com/photo-1599599810694-b5ac5a0a4c9f?auto=format&fit=crop&w=300&q=80'"
                >

                <div class="order-item-info">

                    <div class="order-item-name">
                        ${escapeHTML(name)}
                    </div>

                    <div class="order-item-meta">

                        ${
                            weight
                                ? `${escapeHTML(weight)} × `
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

                <div class="order-item-price">
                    ${formatPrice(price * quantity)}
                </div>

            </div>
        `;
    }

    // ---------------------------------------------------------
    // Find Product
    // ---------------------------------------------------------
    function getProductFromItem(item) {

        if (
            !item ||
            typeof window.getProductById !== "function"
        ) {
            return null;
        }

        return window.getProductById(
            Number(item.productId || item.id)
        );
    }

    // ---------------------------------------------------------
    // Format Price
    // ---------------------------------------------------------
    function formatPrice(amount) {

        const number =
            Number(amount || 0);

        return "₹" +
            number.toLocaleString(
                "en-IN",
                {
                    maximumFractionDigits: 2
                }
            );
    }

    // ---------------------------------------------------------
    // Format Date
    // ---------------------------------------------------------
    function formatDate(dateValue) {

        if (!dateValue) {
            return "Date unavailable";
        }

        const date =
            new Date(dateValue);

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

    // ---------------------------------------------------------
    // Payment Method
    // ---------------------------------------------------------
    function formatPaymentMethod(method) {

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

        return escapeHTML(method || "COD");
    }

    // ---------------------------------------------------------
    // Status Class
    // ---------------------------------------------------------
    function getStatusClass(status) {

        const value =
            String(status || "")
                .toLowerCase();

        if (
            value.includes("deliver")
        ) {
            return "status-delivered";
        }

        if (
            value.includes("cancel")
        ) {
            return "status-cancelled";
        }

        if (
            value.includes("ship")
        ) {
            return "status-shipped";
        }

        if (
            value.includes("process")
        ) {
            return "status-processing";
        }

        return "status-placed";
    }

    // ---------------------------------------------------------
    // Status Icon
    // ---------------------------------------------------------
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

    // ---------------------------------------------------------
    // Escape HTML
    // ---------------------------------------------------------
    function escapeHTML(value) {

        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // ---------------------------------------------------------
    // Escape Attribute
    // ---------------------------------------------------------
    function escapeAttribute(value) {
        return escapeHTML(value);
    }

    // ---------------------------------------------------------
    // Public API
    // ---------------------------------------------------------
    window.DryFruitOrders = {

        getAllOrders,

        getUserOrders,

        renderOrders,

    };

})();

