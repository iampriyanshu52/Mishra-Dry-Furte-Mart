/* =========================================================
   MISHRA DRY FRUIT MART - ADMIN DASHBOARD JS
   File: frontend/js/admin.js

   Frontend demo/admin panel
   Data:
   - Products: products.js + localStorage
   - Orders: dryfruit_orders
   - Users: dryfruit_users
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    "use strict";

    /* =====================================================
       CONFIG
    ===================================================== */

    const ORDERS_KEY = "dryfruit_orders";
    const USERS_KEY = "dryfruit_users";
    const ADMIN_PRODUCTS_KEY = "dryfruit_admin_products";

    let currentProductId = null;

    /* =====================================================
       DOM HELPERS
    ===================================================== */

    const $ = (selector) =>
        document.querySelector(selector);

    const $$ = (selector) =>
        document.querySelectorAll(selector);


    /* =====================================================
       STORAGE HELPERS
    ===================================================== */

    function readStorage(key, fallback = []) {

        try {

            const data =
                JSON.parse(localStorage.getItem(key));

            return Array.isArray(data)
                ? data
                : fallback;

        } catch (error) {

            console.error(
                `Storage read error: ${key}`,
                error
            );

            return fallback;
        }
    }


    function writeStorage(key, data) {

        localStorage.setItem(
            key,
            JSON.stringify(data)
        );
    }


    /* =====================================================
       DATA
    ===================================================== */

    function getOrders() {

        return readStorage(
            ORDERS_KEY,
            []
        );
    }


    function saveOrders(orders) {

        writeStorage(
            ORDERS_KEY,
            orders
        );
    }


    function getUsers() {

        return readStorage(
            USERS_KEY,
            []
        );
    }


    function getAdminProducts() {

        return readStorage(
            ADMIN_PRODUCTS_KEY,
            []
        );
    }


    function saveAdminProducts(products) {

        writeStorage(
            ADMIN_PRODUCTS_KEY,
            products
        );
    }


    /*
       Original products.js products + admin-added products
    */

    function getAllProducts() {

        let originalProducts = [];

        if (
            typeof products !== "undefined" &&
            Array.isArray(products)
        ) {

            originalProducts = products;

        } else if (
            window.DryFruitStore &&
            Array.isArray(
                window.DryFruitStore.products
            )
        ) {

            originalProducts =
                window.DryFruitStore.products;
        }


        const adminProducts =
            getAdminProducts();


        const originalIds =
            new Set(
                originalProducts.map(
                    product => Number(product.id)
                )
            );


        const customProducts =
            adminProducts.filter(
                product =>
                    !originalIds.has(
                        Number(product.id)
                    )
            );


        return [
            ...originalProducts,
            ...customProducts
        ];
    }


    /* =====================================================
       HTML ESCAPE
    ===================================================== */

    function escapeHTML(value) {

        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    /* =====================================================
       PRICE
    ===================================================== */

    function money(value) {

        const price =
            Number(value || 0);

        return "₹" +
            price.toLocaleString("en-IN");
    }


    /* =====================================================
       DATE
    ===================================================== */

    function formatDate(dateValue) {

        if (!dateValue) {
            return "-";
        }

        const date =
            new Date(dateValue);

        if (isNaN(date.getTime())) {
            return "-";
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


    /* =====================================================
       TOAST
    ===================================================== */

    function showAdminToast(
        message,
        type = "success"
    ) {

        const toast =
            $("#adminToast");

        const messageElement =
            $("#adminToastMessage");

        const icon =
            $("#adminToastIcon");


        if (!toast) {
            return;
        }


        if (messageElement) {

            messageElement.textContent =
                message;
        }


        if (icon) {

            if (type === "error") {

                icon.className =
                    "fas fa-times-circle";

            } else if (type === "warning") {

                icon.className =
                    "fas fa-exclamation-circle";

            } else {

                icon.className =
                    "fas fa-check-circle";
            }
        }


        toast.classList.add("show");


        clearTimeout(
            window.adminToastTimer
        );


        window.adminToastTimer =
            setTimeout(() => {

                toast.classList.remove(
                    "show"
                );

            }, 2500);
    }


    /* =====================================================
       DASHBOARD STATS
    ===================================================== */

    function updateDashboardStats() {

        const products =
            getAllProducts();

        const orders =
            getOrders();

        const users =
            getUsers();


        const revenue =
            orders.reduce(
                (total, order) => {

                    const status =
                        String(
                            order.status ||
                            ""
                        ).toLowerCase();


                    if (
                        status ===
                        "cancelled"
                    ) {
                        return total;
                    }


                    const orderTotal =
                        Number(
                            order.pricing?.total ??
                            order.total ??
                            0
                        );


                    return total +
                        orderTotal;

                },
                0
            );


        if ($("#statProducts")) {

            $("#statProducts")
                .textContent =
                products.length;
        }


        if ($("#statOrders")) {

            $("#statOrders")
                .textContent =
                orders.length;
        }


        if ($("#statUsers")) {

            $("#statUsers")
                .textContent =
                users.length;
        }


        if ($("#statRevenue")) {

            $("#statRevenue")
                .textContent =
                money(revenue);
        }
    }


    /* =====================================================
       ORDER STATUS CLASS
    ===================================================== */

    function getStatusClass(status) {

        const value =
            String(
                status || "Placed"
            ).toLowerCase();


        if (value === "processing") {
            return "processing";
        }

        if (value === "shipped") {
            return "shipped";
        }

        if (value === "delivered") {
            return "delivered";
        }

        if (value === "cancelled") {
            return "cancelled";
        }

        return "placed";
    }


    /* =====================================================
       RECENT ORDERS
    ===================================================== */

    function renderRecentOrders() {

        const container =
            $("#dashboardRecentOrders");

        if (!container) {
            return;
        }


        const orders =
            getOrders()
                .slice()
                .sort(
                    (a, b) =>
                        new Date(
                            b.createdAt || 0
                        ) -
                        new Date(
                            a.createdAt || 0
                        )
                )
                .slice(0, 5);


        if (orders.length === 0) {

            container.innerHTML = `
                <div class="admin-empty">

                    <i class="fas fa-shopping-bag"></i>

                    <h5>No Orders Yet</h5>

                    <p>
                        Customer orders will appear here.
                    </p>

                </div>
            `;

            return;
        }


        container.innerHTML = `

            <table class="admin-table">

                <thead>

                    <tr>
                        <th>Order</th>
                        <th>Customer</th>
                        <th>Date</th>
                        <th>Total</th>
                        <th>Status</th>
                    </tr>

                </thead>

                <tbody>

                    ${orders.map(order => {

                        const customer =
                            order.customer || {};

                        const name =
                            customer.name ||
                            [
                                customer.firstName,
                                customer.lastName
                            ]
                                .filter(Boolean)
                                .join(" ") ||
                            "Customer";


                        const total =
                            Number(
                                order.pricing?.total ??
                                order.total ??
                                0
                            );


                        const status =
                            order.status ||
                            "Placed";


                        return `

                            <tr>

                                <td>
                                    <strong>
                                        ${escapeHTML(
                                            order.orderId ||
                                            order.id ||
                                            "-"
                                        )}
                                    </strong>
                                </td>

                                <td>
                                    ${escapeHTML(name)}
                                </td>

                                <td>
                                    ${formatDate(
                                        order.createdAt
                                    )}
                                </td>

                                <td>
                                    <span class="admin-price">
                                        ${money(total)}
                                    </span>
                                </td>

                                <td>

                                    <span
                                        class="admin-status ${getStatusClass(status)}"
                                    >
                                        ${escapeHTML(status)}
                                    </span>

                                </td>

                            </tr>

                        `;

                    }).join("")}

                </tbody>

            </table>
        `;
    }


    /* =====================================================
       PRODUCT TABLE
    ===================================================== */

    function renderProducts() {

        const container =
            $("#adminProductsTable");

        if (!container) {
            return;
        }


        let products =
            getAllProducts();


        const search =
            String(
                $("#productSearch")?.value ||
                ""
            )
                .trim()
                .toLowerCase();


        const category =
            $("#productCategoryFilter")
                ?.value ||
            "all";


        if (search) {

            products =
                products.filter(product => {

                    return (

                        String(
                            product.name || ""
                        )
                            .toLowerCase()
                            .includes(search)

                        ||

                        String(
                            product.categoryName ||
                            product.category ||
                            ""
                        )
                            .toLowerCase()
                            .includes(search)

                    );

                });
        }


        if (category !== "all") {

            products =
                products.filter(
                    product =>
                        String(
                            product.category ||
                            ""
                        ).toLowerCase() ===
                        category
                );
        }


        if (products.length === 0) {

            container.innerHTML = `

                <div class="admin-empty">

                    <i class="fas fa-box-open"></i>

                    <h5>
                        No Products Found
                    </h5>

                    <p>
                        Try another search or category.
                    </p>

                </div>

            `;

            return;
        }


        container.innerHTML = `

            <table class="admin-table">

                <thead>

                    <tr>

                        <th>
                            Product
                        </th>

                        <th>
                            Category
                        </th>

                        <th>
                            Price
                        </th>

                        <th>
                            Rating
                        </th>

                        <th>
                            Badge
                        </th>

                        <th>
                            Actions
                        </th>

                    </tr>

                </thead>

                <tbody>

                    ${products.map(product => {

                        const price =
                            Number(
                                product.price || 0
                            );

                        const oldPrice =
                            Number(
                                product.oldPrice || 0
                            );

                        const isCustom =
                            getAdminProducts()
                                .some(
                                    item =>
                                        Number(
                                            item.id
                                        ) ===
                                        Number(
                                            product.id
                                        )
                                );


                        return `

                            <tr>

                                <td>

                                    <div class="admin-product-cell">

                                        <img
                                            src="${escapeHTML(
                                                product.image || ""
                                            )}"
                                            alt="${escapeHTML(
                                                product.name
                                            )}"
                                            class="admin-product-image"
                                            onerror="this.style.display='none'"
                                        >

                                        <div>

                                            <div class="admin-product-name">
                                                ${escapeHTML(
                                                    product.name
                                                )}
                                            </div>

                                            <div class="admin-product-category">
                                                ${escapeHTML(
                                                    product.weight ||
                                                    ""
                                                )}
                                            </div>

                                        </div>

                                    </div>

                                </td>


                                <td>

                                    ${escapeHTML(
                                        product.categoryName ||
                                        product.category ||
                                        "Dry Fruits"
                                    )}

                                </td>


                                <td>

                                    <span class="admin-price">
                                        ${money(price)}
                                    </span>

                                    ${
                                        oldPrice > price
                                            ? `
                                                <span class="admin-old-price">
                                                    ${money(oldPrice)}
                                                </span>
                                            `
                                            : ""
                                    }

                                </td>


                                <td>

                                    <span class="admin-rating">
                                        ★
                                    </span>

                                    ${Number(
                                        product.rating || 0
                                    ).toFixed(1)}

                                </td>


                                <td>

                                    ${
                                        product.badge
                                            ? `
                                                <span class="admin-badge">
                                                    ${escapeHTML(
                                                        product.badge
                                                    )}
                                                </span>
                                            `
                                            : "-"
                                    }

                                </td>


                                <td>

                                    <div class="admin-actions">

                                        <button
                                            type="button"
                                            class="admin-action-btn view"
                                            title="View Product"
                                            data-product-action="view"
                                            data-id="${product.id}"
                                        >
                                            <i class="fas fa-eye"></i>
                                        </button>


                                        <button
                                            type="button"
                                            class="admin-action-btn edit"
                                            title="Edit Product"
                                            data-product-action="edit"
                                            data-id="${product.id}"
                                            ${
                                                isCustom
                                                    ? ""
                                                    : "disabled"
                                            }
                                        >
                                            <i class="fas fa-pen"></i>
                                        </button>


                                        <button
                                            type="button"
                                            class="admin-action-btn delete"
                                            title="Delete Product"
                                            data-product-action="delete"
                                            data-id="${product.id}"
                                            ${
                                                isCustom
                                                    ? ""
                                                    : "disabled"
                                            }
                                        >
                                            <i class="fas fa-trash"></i>
                                        </button>

                                    </div>

                                </td>

                            </tr>

                        `;

                    }).join("")}

                </tbody>

            </table>
        `;
    }


    /* =====================================================
       ORDER TABLE
    ===================================================== */

    function renderOrders() {

        const container =
            $("#adminOrdersTable");

        if (!container) {
            return;
        }


        let orders =
            getOrders()
                .slice()
                .sort(
                    (a, b) =>
                        new Date(
                            b.createdAt || 0
                        ) -
                        new Date(
                            a.createdAt || 0
                        )
                );


        const search =
            String(
                $("#orderSearch")?.value ||
                ""
            )
                .trim()
                .toLowerCase();


        const statusFilter =
            $("#orderStatusFilter")
                ?.value ||
            "all";


        if (search) {

            orders =
                orders.filter(order => {

                    const customer =
                        order.customer || {};


                    const name =
                        customer.name ||
                        [
                            customer.firstName,
                            customer.lastName
                        ]
                            .filter(Boolean)
                            .join(" ");


                    const orderId =
                        order.orderId ||
                        order.id ||
                        "";


                    return (

                        String(orderId)
                            .toLowerCase()
                            .includes(search)

                        ||

                        String(name)
                            .toLowerCase()
                            .includes(search)

                        ||

                        String(
                            customer.email ||
                            ""
                        )
                            .toLowerCase()
                            .includes(search)

                    );
                });
        }


        if (statusFilter !== "all") {

            orders =
                orders.filter(
                    order =>
                        String(
                            order.status ||
                            "Placed"
                        ).toLowerCase() ===
                        statusFilter.toLowerCase()
                );
        }


        if (orders.length === 0) {

            container.innerHTML = `

                <div class="admin-empty">

                    <i class="fas fa-shopping-bag"></i>

                    <h5>
                        No Orders Found
                    </h5>

                    <p>
                        Orders will appear here after checkout.
                    </p>

                </div>

            `;

            return;
        }


        container.innerHTML = `

            <table class="admin-table">

                <thead>

                    <tr>

                        <th>
                            Order ID
                        </th>

                        <th>
                            Customer
                        </th>

                        <th>
                            Date
                        </th>

                        <th>
                            Amount
                        </th>

                        <th>
                            Payment
                        </th>

                        <th>
                            Status
                        </th>

                        <th>
                            Actions
                        </th>

                    </tr>

                </thead>

                <tbody>

                    ${orders.map(order => {

                        const customer =
                            order.customer || {};


                        const customerName =
                            customer.name ||
                            [
                                customer.firstName,
                                customer.lastName
                            ]
                                .filter(Boolean)
                                .join(" ") ||
                            "Customer";


                        const total =
                            Number(
                                order.pricing?.total ??
                                order.total ??
                                0
                            );


                        const payment =
                            order.paymentMethod ||
                            "COD";


                        const status =
                            order.status ||
                            "Placed";


                        return `

                            <tr>

                                <td>

                                    <strong>
                                        ${escapeHTML(
                                            order.orderId ||
                                            order.id ||
                                            "-"
                                        )}
                                    </strong>

                                </td>


                                <td>

                                    <div class="admin-user-cell">

                                        <div class="admin-user-avatar">

                                            ${escapeHTML(
                                                customerName
                                                    .charAt(0)
                                                    .toUpperCase()
                                            )}

                                        </div>

                                        <div>

                                            <div class="admin-user-name">
                                                ${escapeHTML(
                                                    customerName
                                                )}
                                            </div>

                                            <div class="admin-user-email">
                                                ${escapeHTML(
                                                    customer.email ||
                                                    ""
                                                )}
                                            </div>

                                        </div>

                                    </div>

                                </td>


                                <td>
                                    ${formatDate(
                                        order.createdAt
                                    )}
                                </td>


                                <td>

                                    <span class="admin-price">
                                        ${money(total)}
                                    </span>

                                </td>


                                <td>
                                    ${escapeHTML(
                                        payment
                                    )}
                                </td>


                                <td>

                                    <select
                                        class="form-select form-select-sm admin-order-status-select"
                                        data-order-status-id="${escapeHTML(
                                            order.orderId ||
                                            order.id ||
                                            ""
                                        )}"
                                    >

                                        <option
                                            value="Placed"
                                            ${
                                                status ===
                                                "Placed"
                                                    ? "selected"
                                                    : ""
                                            }
                                        >
                                            Placed
                                        </option>

                                        <option
                                            value="Processing"
                                            ${
                                                status ===
                                                "Processing"
                                                    ? "selected"
                                                    : ""
                                            }
                                        >
                                            Processing
                                        </option>

                                        <option
                                            value="Shipped"
                                            ${
                                                status ===
                                                "Shipped"
                                                    ? "selected"
                                                    : ""
                                            }
                                        >
                                            Shipped
                                        </option>

                                        <option
                                            value="Delivered"
                                            ${
                                                status ===
                                                "Delivered"
                                                    ? "selected"
                                                    : ""
                                            }
                                        >
                                            Delivered
                                        </option>

                                        <option
                                            value="Cancelled"
                                            ${
                                                status ===
                                                "Cancelled"
                                                    ? "selected"
                                                    : ""
                                            }
                                        >
                                            Cancelled
                                        </option>

                                    </select>

                                </td>


                                <td>

                                    <div class="admin-actions">

                                        <button
                                            type="button"
                                            class="admin-action-btn view"
                                            title="View Order"
                                            data-order-action="view"
                                            data-id="${escapeHTML(
                                                order.orderId ||
                                                order.id ||
                                                ""
                                            )}"
                                        >
                                            <i class="fas fa-eye"></i>
                                        </button>

                                    </div>

                                </td>

                            </tr>

                        `;

                    }).join("")}

                </tbody>

            </table>
        `;
    }


    /* =====================================================
       USERS TABLE
    ===================================================== */

    function renderUsers() {

        const container =
            $("#adminUsersTable");

        if (!container) {
            return;
        }


        let users =
            getUsers();


        const search =
            String(
                $("#userSearch")?.value ||
                ""
            )
                .trim()
                .toLowerCase();


        if (search) {

            users =
                users.filter(user => {

                    const fullName =
                        user.name ||
                        [
                            user.firstName,
                            user.lastName
                        ]
                            .filter(Boolean)
                            .join(" ");


                    return (

                        String(fullName)
                            .toLowerCase()
                            .includes(search)

                        ||

                        String(
                            user.email ||
                            ""
                        )
                            .toLowerCase()
                            .includes(search)

                        ||

                        String(
                            user.phone ||
                            ""
                        )
                            .includes(search)

                    );

                });
        }


        if (users.length === 0) {

            container.innerHTML = `

                <div class="admin-empty">

                    <i class="fas fa-users"></i>

                    <h5>
                        No Users Found
                    </h5>

                    <p>
                        Registered customers will appear here.
                    </p>

                </div>

            `;

            return;
        }


        container.innerHTML = `

            <table class="admin-table">

                <thead>

                    <tr>

                        <th>
                            Customer
                        </th>

                        <th>
                            Phone
                        </th>

                        <th>
                            Registered
                        </th>

                        <th>
                            Orders
                        </th>

                    </tr>

                </thead>

                <tbody>

                    ${users.map(user => {

                        const name =
                            user.name ||
                            [
                                user.firstName,
                                user.lastName
                            ]
                                .filter(Boolean)
                                .join(" ") ||
                            "Customer";


                        const email =
                            user.email ||
                            "";


                        const orderCount =
                            getOrders().filter(
                                order => {

                                    const customer =
                                        order.customer ||
                                        {};

                                    return (

                                        (
                                            user.id &&
                                            customer.userId &&
                                            String(
                                                user.id
                                            ) ===
                                            String(
                                                customer.userId
                                            )
                                        )

                                        ||

                                        (
                                            user.email &&
                                            customer.email &&
                                            String(
                                                user.email
                                            ).toLowerCase() ===
                                            String(
                                                customer.email
                                            ).toLowerCase()
                                        )

                                    );

                                }
                            ).length;


                        return `

                            <tr>

                                <td>

                                    <div class="admin-user-cell">

                                        <div class="admin-user-avatar">

                                            ${escapeHTML(
                                                name
                                                    .charAt(0)
                                                    .toUpperCase()
                                            )}

                                        </div>

                                        <div>

                                            <div class="admin-user-name">
                                                ${escapeHTML(
                                                    name
                                                )}
                                            </div>

                                            <div class="admin-user-email">
                                                ${escapeHTML(
                                                    email
                                                )}
                                            </div>

                                        </div>

                                    </div>

                                </td>


                                <td>
                                    ${escapeHTML(
                                        user.phone ||
                                        "-"
                                    )}
                                </td>


                                <td>
                                    ${formatDate(
                                        user.createdAt
                                    )}
                                </td>


                                <td>

                                    <span class="admin-badge">
                                        ${orderCount}
                                    </span>

                                </td>

                            </tr>

                        `;

                    }).join("")}

                </tbody>

            </table>

        `;
    }


    /* =====================================================
       PRODUCT MODAL
    ===================================================== */

    function getProductModal() {

        const modalElement =
            $("#productModal");

        if (!modalElement) {
            return null;
        }


        if (
            typeof bootstrap === "undefined"
        ) {
            return null;
        }


        return bootstrap.Modal.getOrCreateInstance(
            modalElement
        );
    }


    function clearProductForm() {

        currentProductId = null;


        if ($("#productForm")) {
            $("#productForm").reset();
        }


        if ($("#productId")) {
            $("#productId").value = "";
        }


        if ($("#productModalTitle")) {

            $("#productModalTitle")
                .textContent =
                "Add Product";
        }


        if ($("#adminProductRating")) {

            $("#adminProductRating")
                .value = "4.5";
        }
    }


    function openAddProductModal() {

        clearProductForm();


        const modal =
            getProductModal();


        if (modal) {
            modal.show();
        }
    }


    function openEditProductModal(id) {

        const products =
            getAdminProducts();


        const product =
            products.find(
                item =>
                    Number(item.id) ===
                    Number(id)
            );


        if (!product) {

            showAdminToast(
                "Built-in products ko directly edit nahi kar sakte. Pehle backend version connect karenge.",
                "warning"
            );

            return;
        }


        currentProductId =
            Number(id);


        $("#productId").value =
            product.id;


        $("#adminProductName").value =
            product.name || "";


        $("#adminProductCategory").value =
            product.category || "";


        $("#adminProductPrice").value =
            product.price || "";


        $("#adminProductOldPrice").value =
            product.oldPrice || "";


        $("#adminProductWeight").value =
            product.weight || "";


        $("#adminProductRating").value =
            product.rating || 4.5;


        $("#adminProductBadge").value =
            product.badge || "";


        $("#adminProductImage").value =
            product.image || "";


        $("#adminProductDescription").value =
            product.shortDescription ||
            product.description ||
            "";


        $("#productModalTitle")
            .textContent =
            "Edit Product";


        const modal =
            getProductModal();


        if (modal) {
            modal.show();
        }
    }


    /* =====================================================
       SAVE PRODUCT
    ===================================================== */

    function handleProductSubmit(event) {

        event.preventDefault();


        const name =
            $("#adminProductName")
                ?.value.trim();


        const category =
            $("#adminProductCategory")
                ?.value;


        const price =
            Number(
                $("#adminProductPrice")
                    ?.value || 0
            );


        const oldPrice =
            Number(
                $("#adminProductOldPrice")
                    ?.value || 0
            );


        const weight =
            $("#adminProductWeight")
                ?.value.trim() ||
            "250g";


        const rating =
            Number(
                $("#adminProductRating")
                    ?.value || 4.5
            );


        const badge =
            $("#adminProductBadge")
                ?.value.trim() ||
            "";


        const image =
            $("#adminProductImage")
                ?.value.trim() ||
            "https://images.unsplash.com/photo-1608797178974-15b35a64ede9?auto=format&fit=crop&w=700&q=80";


        const description =
            $("#adminProductDescription")
                ?.value.trim() ||
            "Premium quality dry fruits from Mishra Dry Fruit Mart.";


        if (!name) {

            showAdminToast(
                "Product name enter karo.",
                "error"
            );

            return;
        }


        if (!category) {

            showAdminToast(
                "Category select karo.",
                "error"
            );

            return;
        }


        if (price <= 0) {

            showAdminToast(
                "Valid price enter karo.",
                "error"
            );

            return;
        }


        if (
            oldPrice > 0 &&
            oldPrice < price
        ) {

            showAdminToast(
                "Old price current price se kam nahi ho sakta.",
                "error"
            );

            return;
        }


        let adminProducts =
            getAdminProducts();


        const categoryNames = {

            almonds: "Almonds",
            cashew: "Cashews",
            pista: "Pista",
            walnut: "Walnuts",
            raisins: "Raisins",
            dates: "Dates",
            makhana: "Makhana",
            mix: "Dry Fruit Mix"

        };


        if (currentProductId) {

            const index =
                adminProducts.findIndex(
                    product =>
                        Number(product.id) ===
                        Number(currentProductId)
                );


            if (index === -1) {
                return;
            }


            const oldProduct =
                adminProducts[index];


            adminProducts[index] = {

                ...oldProduct,

                name,

                slug:
                    name
                        .toLowerCase()
                        .replace(
                            /[^a-z0-9]+/g,
                            "-"
                        )
                        .replace(
                            /^-|-$|/g,
                            ""
                        ),

                category,

                categoryName:
                    categoryNames[category] ||
                    category,

                price,

                oldPrice,

                weight,

                rating,

                reviews:
                    oldProduct.reviews || 0,

                badge,

                image,

                shortDescription:
                    description,

                description,

                updatedAt:
                    new Date().toISOString()
            };


            showAdminToast(
                "Product update ho gaya."
            );

        } else {

            const existingIds =
                getAllProducts()
                    .map(
                        product =>
                            Number(product.id)
                    )
                    .filter(
                        id => !isNaN(id)
                    );


            const newId =
                existingIds.length
                    ? Math.max(
                        ...existingIds
                    ) + 1
                    : 1;


            const newProduct = {

                id: newId,

                name,

                slug:
                    name
                        .toLowerCase()
                        .replace(
                            /[^a-z0-9]+/g,
                            "-"
                        )
                        .replace(
                            /^-|-$/g,
                            ""
                        ),

                category,

                categoryName:
                    categoryNames[category] ||
                    category,

                price,

                oldPrice,

                discount:
                    oldPrice > price
                        ? Math.round(
                            (
                                (
                                    oldPrice -
                                    price
                                ) /
                                oldPrice
                            ) * 100
                        )
                        : 0,

                weight,

                rating,

                reviews: 0,

                badge,

                image,

                shortDescription:
                    description,

                description,

                features: [],

                sizes: [
                    {
                        weight,
                        price
                    }
                ],

                createdAt:
                    new Date().toISOString()
            };


            adminProducts.push(
                newProduct
            );


            showAdminToast(
                "New product add ho gaya."
            );
        }


        saveAdminProducts(
            adminProducts
        );


        const modal =
            getProductModal();


        if (modal) {
            modal.hide();
        }


        renderProducts();
        updateDashboardStats();
    }


    /* =====================================================
       DELETE PRODUCT
    ===================================================== */

    function deleteProduct(id) {

        const adminProducts =
            getAdminProducts();


        const exists =
            adminProducts.some(
                product =>
                    Number(product.id) ===
                    Number(id)
            );


        if (!exists) {

            showAdminToast(
                "Built-in product ko delete nahi kar sakte.",
                "warning"
            );

            return;
        }


        const product =
            adminProducts.find(
                item =>
                    Number(item.id) ===
                    Number(id)
            );


        const confirmed =
            confirm(
                `Kya aap "${product?.name || "product"}" ko delete karna chahte hain?`
            );


        if (!confirmed) {
            return;
        }


        const updated =
            adminProducts.filter(
                item =>
                    Number(item.id) !==
                    Number(id)
            );


        saveAdminProducts(updated);


        renderProducts();

        updateDashboardStats();


        showAdminToast(
            "Product delete ho gaya."
        );
    }


    /* =====================================================
       VIEW PRODUCT
    ===================================================== */

    function viewProduct(id) {

        window.open(
            `product-details.html?id=${encodeURIComponent(id)}`,
            "_blank"
        );
    }


    /* =====================================================
       ORDER DETAILS
    ===================================================== */

    function openOrderDetails(orderId) {

        const orders =
            getOrders();


        const order =
            orders.find(
                item =>
                    String(
                        item.orderId ||
                        item.id ||
                        ""
                    ) ===
                    String(orderId)
            );


        if (!order) {

            showAdminToast(
                "Order nahi mila.",
                "error"
            );

            return;
        }


        const customer =
            order.customer || {};


        const name =
            customer.name ||
            [
                customer.firstName,
                customer.lastName
            ]
                .filter(Boolean)
                .join(" ") ||
            "Customer";


        const address =
            order.shippingAddress ||
            {};


        const addressText = [

            address.address,
            address.city,
            address.state,
            address.pincode

        ]
            .filter(Boolean)
            .map(escapeHTML)
            .join(", ");


        const items =
            Array.isArray(order.items)
                ? order.items
                : [];


        const total =
            Number(
                order.pricing?.total ??
                order.total ??
                0
            );


        const subtotal =
            Number(
                order.pricing?.subtotal ??
                order.subtotal ??
                0
            );


        const discount =
            Number(
                order.pricing?.discount ??
                order.discount ??
                0
            );


        const delivery =
            Number(
                order.pricing?.delivery ??
                order.delivery ??
                0
            );


        const container =
            $("#adminOrderDetails");


        if (!container) {
            return;
        }


        container.innerHTML = `

            <div class="admin-order-info">

                <div class="admin-order-info-box">

                    <span>
                        Order ID
                    </span>

                    <strong>
                        ${escapeHTML(
                            order.orderId ||
                            order.id ||
                            "-"
                        )}
                    </strong>

                </div>


                <div class="admin-order-info-box">

                    <span>
                        Customer
                    </span>

                    <strong>
                        ${escapeHTML(name)}
                    </strong>

                </div>


                <div class="admin-order-info-box">

                    <span>
                        Date
                    </span>

                    <strong>
                        ${formatDate(
                            order.createdAt
                        )}
                    </strong>

                </div>

            </div>


            <div class="admin-order-address">

                <h6>
                    <i class="fas fa-location-dot"></i>
                    Delivery Address
                </h6>

                <p>
                    ${addressText || "Address not available"}
                </p>

                ${
                    customer.phone
                        ? `
                            <p class="mt-1">
                                <i class="fas fa-phone"></i>
                                ${escapeHTML(
                                    customer.phone
                                )}
                            </p>
                        `
                        : ""
                }

                ${
                    customer.email
                        ? `
                            <p>
                                <i class="fas fa-envelope"></i>
                                ${escapeHTML(
                                    customer.email
                                )}
                            </p>
                        `
                        : ""
                }

            </div>


            <div class="admin-order-items">

                <h6 class="mb-2">
                    Order Items
                </h6>


                ${
                    items.length
                        ? items.map(item => {

                            const itemTotal =
                                Number(
                                    item.price || 0
                                ) *
                                Number(
                                    item.quantity || 1
                                );


                            return `

                                <div class="admin-order-item">

                                    <img
                                        src="${escapeHTML(
                                            item.image || ""
                                        )}"
                                        alt="${escapeHTML(
                                            item.name ||
                                            "Product"
                                        )}"
                                        onerror="this.style.display='none'"
                                    >

                                    <div class="admin-order-item-info">

                                        <strong>
                                            ${escapeHTML(
                                                item.name ||
                                                "Product"
                                            )}
                                        </strong>

                                        <span>
                                            Qty:
                                            ${Number(
                                                item.quantity || 1
                                            )}

                                            ${
                                                item.weight
                                                    ? ` · ${escapeHTML(
                                                        item.weight
                                                    )}`
                                                    : ""
                                            }
                                        </span>

                                    </div>

                                    <div class="admin-order-item-price">
                                        ${money(itemTotal)}
                                    </div>

                                </div>

                            `;

                        }).join("")
                        : `
                            <p class="text-muted small">
                                No item information.
                            </p>
                        `
                }

            </div>


            <div class="admin-order-summary">

                <div class="d-flex justify-content-between mb-2">

                    <span>
                        Subtotal
                    </span>

                    <strong>
                        ${money(subtotal)}
                    </strong>

                </div>


                ${
                    discount > 0
                        ? `
                            <div class="d-flex justify-content-between mb-2">

                                <span>
                                    Discount
                                </span>

                                <strong class="text-success">
                                    -${money(discount)}
                                </strong>

                            </div>
                        `
                        : ""
                }


                <div class="d-flex justify-content-between mb-2">

                    <span>
                        Delivery
                    </span>

                    <strong>
                        ${
                            delivery === 0
                                ? "FREE"
                                : money(delivery)
                        }
                    </strong>

                </div>


                <div class="admin-order-total">

                    <span>
                        Total
                    </span>

                    <strong>
                        ${money(total)}
                    </strong>

                </div>

            </div>


            <div class="mt-3">

                <label class="form-label">
                    Order Status
                </label>

                <select
                    class="form-select"
                    id="modalOrderStatus"
                    data-modal-order-id="${escapeHTML(
                        order.orderId ||
                        order.id ||
                        ""
                    )}"
                >

                    <option
                        value="Placed"
                        ${
                            order.status === "Placed"
                                ? "selected"
                                : ""
                        }
                    >
                        Placed
                    </option>

                    <option
                        value="Processing"
                        ${
                            order.status === "Processing"
                                ? "selected"
                                : ""
                        }
                    >
                        Processing
                    </option>

                    <option
                        value="Shipped"
                        ${
                            order.status === "Shipped"
                                ? "selected"
                                : ""
                        }
                    >
                        Shipped
                    </option>

                    <option
                        value="Delivered"
                        ${
                            order.status === "Delivered"
                                ? "selected"
                                : ""
                        }
                    >
                        Delivered
                    </option>

                    <option
                        value="Cancelled"
                        ${
                            order.status === "Cancelled"
                                ? "selected"
                                : ""
                        }
                    >
                        Cancelled
                    </option>

                </select>

            </div>

        `;


        const modalElement =
            $("#orderModal");


        if (
            modalElement &&
            typeof bootstrap !== "undefined"
        ) {

            bootstrap.Modal
                .getOrCreateInstance(
                    modalElement
                )
                .show();
        }
    }


    /* =====================================================
       UPDATE ORDER STATUS
    ===================================================== */

    function updateOrderStatus(
        orderId,
        newStatus
    ) {

        const orders =
            getOrders();


        const index =
            orders.findIndex(
                order =>
                    String(
                        order.orderId ||
                        order.id ||
                        ""
                    ) ===
                    String(orderId)
            );


        if (index === -1) {

            showAdminToast(
                "Order nahi mila.",
                "error"
            );

            return;
        }


        orders[index].status =
            newStatus;


        /*
           Tracking pages status ko directly
           order.status se read karti hain.
        */

        orders[index].updatedAt =
            new Date().toISOString();


        saveOrders(orders);


        renderOrders();

        renderRecentOrders();

        updateDashboardStats();


        showAdminToast(
            `Order status "${newStatus}" ho gaya.`
        );
    }


    /* =====================================================
       NAVIGATION
    ===================================================== */

    function showSection(sectionName) {

        const sections =
            $$(".admin-section");


        sections.forEach(section => {

            section.classList.remove(
                "active"
            );
        });


        const target =
            document.getElementById(
                `${sectionName}Section`
            );


        if (target) {

            target.classList.add(
                "active"
            );
        }


        const menuLinks =
            $$(".admin-menu-link");


        menuLinks.forEach(link => {

            link.classList.remove(
                "active"
            );


            if (
                link.dataset.section ===
                sectionName
            ) {

                link.classList.add(
                    "active"
                );
            }
        });


        /*
           Mobile sidebar close
        */

        $("#adminSidebar")
            ?.classList.remove("show");


        /*
           Update URL hash
        */

        if (
            history.replaceState
        ) {

            history.replaceState(
                null,
                "",
                `#${sectionName}`
            );
        }


        /*
           Refresh relevant data
        */

        if (sectionName === "dashboard") {

            updateDashboardStats();
            renderRecentOrders();

        } else if (
            sectionName === "products"
        ) {

            renderProducts();

        } else if (
            sectionName === "orders"
        ) {

            renderOrders();

        } else if (
            sectionName === "users"
        ) {

            renderUsers();
        }
    }


    /* =====================================================
       SIDEBAR EVENTS
    ===================================================== */

    $$(".admin-menu-link")
        .forEach(link => {

            link.addEventListener(
                "click",
                function (event) {

                    const section =
                        this.dataset.section;


                    if (!section) {
                        return;
                    }


                    event.preventDefault();

                    showSection(section);
                }
            );
        });


    /* =====================================================
       QUICK ACTION EVENTS
    ===================================================== */

    $$("[data-section-target]")
        .forEach(button => {

            button.addEventListener(
                "click",
                function () {

                    const section =
                        this.dataset.sectionTarget;


                    if (section) {

                        showSection(
                            section
                        );
                    }
                }
            );
        });


    /* =====================================================
       MOBILE SIDEBAR
    ===================================================== */

    $("#adminMobileToggle")
        ?.addEventListener(
            "click",
            function () {

                $("#adminSidebar")
                    ?.classList.toggle(
                        "show"
                    );
            }
        );


    /* =====================================================
       PRODUCT SEARCH
    ===================================================== */

    $("#productSearch")
        ?.addEventListener(
            "input",
            renderProducts
        );


    $("#productCategoryFilter")
        ?.addEventListener(
            "change",
            renderProducts
        );


    /* =====================================================
       ORDER SEARCH/FILTER
    ===================================================== */

    $("#orderSearch")
        ?.addEventListener(
            "input",
            renderOrders
        );


    $("#orderStatusFilter")
        ?.addEventListener(
            "change",
            renderOrders
        );


    /* =====================================================
       USER SEARCH
    ===================================================== */

    $("#userSearch")
        ?.addEventListener(
            "input",
            renderUsers
        );


    /* =====================================================
       ADD PRODUCT
    ===================================================== */

    $("#addProductBtn")
        ?.addEventListener(
            "click",
            openAddProductModal
        );


    /* =====================================================
       PRODUCT FORM
    ===================================================== */

    $("#productForm")
        ?.addEventListener(
            "submit",
            handleProductSubmit
        );slug:
    name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, ""),


    /* =====================================================
       PRODUCT ACTIONS
    ===================================================== */

    $("#adminProductsTable")
        ?.addEventListener(
            "click",
            function (event) {

                const button =
                    event.target.closest(
                        "[data-product-action]"
                    );


                if (!button) {
                    return;
                }


                const action =
                    button.dataset.productAction;


                const id =
                    Number(
                        button.dataset.id
                    );


                if (!id) {
                    return;
                }


                if (
                    action === "view"
                ) {

                    viewProduct(id);

                } else if (
                    action === "edit"
                ) {

                    openEditProductModal(id);

                } else if (
                    action === "delete"
                ) {

                    deleteProduct(id);
                }

            }
        );


    /* =====================================================
       ORDER ACTIONS
    ===================================================== */

    $("#adminOrdersTable")
        ?.addEventListener(
            "click",
            function (event) {

                const button =
                    event.target.closest(
                        "[data-order-action]"
                    );


                if (!button) {
                    return;
                }


                const action =
                    button.dataset.orderAction;


                const id =
                    button.dataset.id;


                if (
                    action === "view"
                ) {

                    openOrderDetails(id);
                }

            }
        );


    /* =====================================================
       ORDER STATUS SELECT
    ===================================================== */

    $("#adminOrdersTable")
        ?.addEventListener(
            "change",
            function (event) {

                const select =
                    event.target.closest(
                        "[data-order-status-id]"
                    );


                if (!select) {
                    return;
                }


                const orderId =
                    select.dataset.orderStatusId;


                const status =
                    select.value;


                updateOrderStatus(
                    orderId,
                    status
                );
            }
        );


    /* =====================================================
       MODAL ORDER STATUS
    ===================================================== */

    $("#adminOrderDetails")
        ?.addEventListener(
            "change",
            function (event) {

                const select =
                    event.target.closest(
                        "#modalOrderStatus"
                    );


                if (!select) {
                    return;
                }


                const orderId =
                    select.dataset.modalOrderId;


                const status =
                    select.value;


                updateOrderStatus(
                    orderId,
                    status
                );
            }
        );


    /* =====================================================
       LOGOUT
    ===================================================== */

    $("#adminLogoutBtn")
        ?.addEventListener(
            "click",
            function () {

                const confirmed =
                    confirm(
                        "Kya aap Admin Dashboard se logout karna chahte hain?"
                    );


                if (!confirmed) {
                    return;
                }


                /*
                   Current frontend demo authentication
                */

                localStorage.removeItem(
                    "dryfruit_current_user"
                );

                localStorage.removeItem(
                    "dryfruit_remember_me"
                );


                sessionStorage.removeItem(
                    "dryfruit_login_redirect"
                );


                window.location.href =
                    "login.html";
            }
        );


    /* =====================================================
       HASH NAVIGATION
    ===================================================== */

    function loadHashSection() {

        const hash =
            window.location.hash
                .replace("#", "")
                .trim();


        const allowed = [

            "dashboard",
            "products",
            "orders",
            "users",
            "coupons"

        ];


        if (
            allowed.includes(hash)
        ) {

            showSection(hash);

        } else {

            showSection("dashboard");
        }
    }


    /* =====================================================
       INITIAL LOAD
    ===================================================== */

    updateDashboardStats();

    renderRecentOrders();

    renderProducts();

    renderOrders();

    renderUsers();

    loadHashSection();


    /* =====================================================
       PUBLIC ADMIN API
    ===================================================== */

    window.DryFruitAdmin = {

        getOrders,
        getUsers,
        getAllProducts,

        renderProducts,
        renderOrders,
        renderUsers,

        updateDashboardStats,

        updateOrderStatus,

        showSection,

        showAdminToast

    };

});