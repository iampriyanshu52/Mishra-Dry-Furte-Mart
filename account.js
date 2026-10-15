/* =========================================================
   MISHRA DRY FRUIT MART - ACCOUNT UI
   File: frontend/js/account.js
========================================================= */

(function () {
    "use strict";

    const USER_KEY = "dryfruit_current_user";

    // ---------------------------------------------------------
    // Get current logged-in user
    // ---------------------------------------------------------
    function getCurrentUser() {
        try {
            const user = localStorage.getItem(USER_KEY);

            if (!user) {
                return null;
            }

            return JSON.parse(user);
        } catch (error) {
            console.error("Unable to read current user:", error);
            return null;
        }
    }

    // ---------------------------------------------------------
    // Check login status
    // ---------------------------------------------------------
    function isLoggedIn() {
        return !!getCurrentUser();
    }

    // ---------------------------------------------------------
    // Escape HTML
    // ---------------------------------------------------------
    function escapeHTML(value) {
        return String(value || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // ---------------------------------------------------------
    // Show toast
    // ---------------------------------------------------------
    function showAccountToast(message, type = "success") {

        if (typeof window.showToast === "function") {
            window.showToast(message, type);
            return;
        }

        const toast = document.getElementById("toast");

        if (!toast) {
            alert(message);
            return;
        }

        const toastMessage = document.getElementById("toastMessage");
        const toastIcon = document.getElementById("toastIcon");

        if (toastMessage) {
            toastMessage.textContent = message;
        }

        if (toastIcon) {

            if (type === "error") {
                toastIcon.className = "fas fa-times-circle text-danger";
            } else {
                toastIcon.className = "fas fa-check-circle text-success";
            }
        }

        toast.classList.add("show");

        setTimeout(() => {
            toast.classList.remove("show");
        }, 2500);
    }

    // ---------------------------------------------------------
    // Logout
    // ---------------------------------------------------------
    function logout() {

        localStorage.removeItem(USER_KEY);

        // Remove remember-me session
        localStorage.removeItem("dryfruit_remember_me");

        // Clear temporary login redirect
        sessionStorage.removeItem("dryfruit_login_redirect");

        showAccountToast("You have been logged out.");

        setTimeout(() => {
            window.location.href = "index.html";
        }, 700);
    }

    // ---------------------------------------------------------
    // Create Account Dropdown
    // ---------------------------------------------------------
    function createAccountDropdown() {

        const navbarActions = document.querySelector(".navbar-actions");

        if (!navbarActions) {
            return;
        }

        // Prevent duplicate account UI
        if (document.getElementById("accountDropdown")) {
            return;
        }

        const user = getCurrentUser();

        const accountWrapper = document.createElement("div");

        accountWrapper.className = "account-wrapper dropdown";
        accountWrapper.id = "accountDropdown";

        // -----------------------------------------------------
        // Logged in user
        // -----------------------------------------------------
        if (user) {

            const firstName =
                user.firstName ||
                (user.name ? user.name.split(" ")[0] : "Account");

            const safeName = escapeHTML(firstName);

            accountWrapper.innerHTML = `
                <button
                    class="account-btn dropdown-toggle"
                    type="button"
                    id="accountMenuButton"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                >
                    <span class="account-avatar">
                        ${safeName.charAt(0).toUpperCase()}
                    </span>

                    <span class="account-name">
                        ${safeName}
                    </span>
                </button>

                <ul
                    class="dropdown-menu dropdown-menu-end account-menu"
                    aria-labelledby="accountMenuButton"
                >

                    <li class="account-user-info">
                        <div class="account-user-icon">
                            <i class="fas fa-user"></i>
                        </div>

                        <div>
                            <strong>${escapeHTML(user.name || firstName)}</strong>
                            <small>${escapeHTML(user.email || "")}</small>
                        </div>
                    </li>

                    <li>
                        <hr class="dropdown-divider">
                    </li>

                    <li>
                        <a class="dropdown-item" href="index.html">
                            <i class="fas fa-home"></i>
                            Home
                        </a>
                    </li>

                    <li>
                        <a class="dropdown-item" href="orders.html">
                            <i class="fas fa-box"></i>
                            My Orders
                        </a>
                    </li>

                    <li>
                        <a class="dropdown-item" href="shop.html">
                            <i class="fas fa-shopping-bag"></i>
                            Continue Shopping
                        </a>
                    </li>

                    <li>
                        <hr class="dropdown-divider">
                    </li>

                    <li>
                        <button
                            type="button"
                            class="dropdown-item account-logout-btn"
                            id="accountLogoutBtn"
                        >
                            <i class="fas fa-sign-out-alt"></i>
                            Logout
                        </button>
                    </li>

                </ul>
            `;

        }

        // -----------------------------------------------------
        // Guest user
        // -----------------------------------------------------
        else {

            accountWrapper.innerHTML = `
                <a
                    href="login.html"
                    class="account-btn account-login-btn"
                    title="Login / Register"
                >
                    <span class="account-avatar">
                        <i class="fas fa-user"></i>
                    </span>

                    <span class="account-name">
                        Login
                    </span>
                </a>
            `;
        }

        // Insert account UI before cart button
        const cartButton =
            navbarActions.querySelector(".cart-btn") ||
            navbarActions.querySelector("[href*='cart']");

        if (cartButton) {
            navbarActions.insertBefore(accountWrapper, cartButton);
        } else {
            navbarActions.appendChild(accountWrapper);
        }

        // Logout event
        const logoutButton =
            document.getElementById("accountLogoutBtn");

        if (logoutButton) {

            logoutButton.addEventListener("click", function () {

                logoutButton.disabled = true;

                logout();

            });
        }
    }

    // ---------------------------------------------------------
    // Add Account CSS
    // ---------------------------------------------------------
    function addAccountStyles() {

        if (document.getElementById("accountDynamicStyles")) {
            return;
        }

        const style = document.createElement("style");

        style.id = "accountDynamicStyles";

        style.textContent = `
            /* ==========================================
               ACCOUNT BUTTON
            ========================================== */

            .account-wrapper {
                position: relative;
            }

            .account-btn {
                display: inline-flex;
                align-items: center;
                gap: 8px;
                border: none;
                background: transparent;
                color: #333;
                text-decoration: none;
                font-weight: 600;
                padding: 5px 8px;
                cursor: pointer;
            }

            .account-btn:hover {
                color: #198754;
            }

            .account-btn::after {
                margin-left: 3px;
            }

            .account-avatar {
                width: 38px;
                height: 38px;
                border-radius: 50%;
                background: #198754;
                color: #fff;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                font-size: 14px;
                font-weight: 700;
                flex-shrink: 0;
            }

            .account-login-btn .account-avatar {
                background: #f1f8f4;
                color: #198754;
            }

            .account-name {
                max-width: 100px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            /* ==========================================
               ACCOUNT DROPDOWN
            ========================================== */

            .account-menu {
                min-width: 250px;
                padding: 8px;
                border: none;
                border-radius: 14px;
                box-shadow: 0 10px 35px rgba(0, 0, 0, 0.12);
            }

            .account-menu .dropdown-item {
                display: flex;
                align-items: center;
                gap: 10px;
                border-radius: 8px;
                padding: 10px 12px;
                font-size: 14px;
            }

            .account-menu .dropdown-item i {
                width: 20px;
                color: #198754;
            }

            .account-menu .dropdown-item:hover {
                background: #f1f8f4;
                color: #198754;
            }

            .account-user-info {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 10px;
            }

            .account-user-icon {
                width: 42px;
                height: 42px;
                border-radius: 50%;
                background: #198754;
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
            }

            .account-user-info strong {
                display: block;
                font-size: 14px;
                color: #222;
            }

            .account-user-info small {
                display: block;
                color: #777;
                font-size: 11px;
                margin-top: 3px;
                max-width: 170px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            .account-logout-btn {
                width: 100%;
                border: none;
                background: transparent;
                text-align: left;
                cursor: pointer;
            }

            .account-logout-btn:hover {
                background: #fff1f1 !important;
                color: #dc3545 !important;
            }

            .account-logout-btn:hover i {
                color: #dc3545 !important;
            }

            /* ==========================================
               MOBILE
            ========================================== */

            @media (max-width: 768px) {

                .account-name {
                    display: none;
                }

                .account-btn {
                    padding: 4px;
                }

                .account-avatar {
                    width: 36px;
                    height: 36px;
                }

                .account-menu {
                    min-width: 230px;
                }
            }
        `;

        document.head.appendChild(style);
    }

    // ---------------------------------------------------------
    // Protect checkout page
    // ---------------------------------------------------------
    function protectCheckout() {

        const checkoutForm =
            document.getElementById("checkoutForm");

        if (!checkoutForm) {
            return;
        }

        // If cart is empty, checkout.js will handle it
        const cart = JSON.parse(
            localStorage.getItem("dryfruit_cart") || "[]"
        );

        if (!cart.length) {
            return;
        }

        // Already logged in
        if (isLoggedIn()) {
            return;
        }

        // Save current page
        sessionStorage.setItem(
            "dryfruit_login_redirect",
            "checkout.html"
        );

        // Show message before redirect
        showAccountToast(
            "Please login before placing your order.",
            "error"
        );

        setTimeout(() => {
            window.location.href = "login.html";
        }, 1000);
    }

    // ---------------------------------------------------------
    // Initialize
    // ---------------------------------------------------------
    function initAccountSystem() {

        addAccountStyles();

        createAccountDropdown();

        // Checkout protection
        protectCheckout();
    }

    // ---------------------------------------------------------
    // Run after DOM loaded
    // ---------------------------------------------------------
    if (document.readyState === "loading") {

        document.addEventListener(
            "DOMContentLoaded",
            initAccountSystem
        );

    } else {

        initAccountSystem();

    }

    // ---------------------------------------------------------
    // Public API
    // ---------------------------------------------------------
    window.DryFruitAccount = {
        getCurrentUser,
        isLoggedIn,
        logout,
        refresh: function () {

            const oldAccount =
                document.getElementById("accountDropdown");

            if (oldAccount) {
                oldAccount.remove();
            }

            createAccountDropdown();
        }
    };

})();