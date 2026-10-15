/* =========================================================
   MISHRA DRY FRUIT MART - WISHLIST
   File: frontend/js/wishlist.js
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    // ---------------------------------------------------------
    // CONFIG
    // ---------------------------------------------------------

    const WISHLIST_KEY = "dryfruit_wishlist";
    const CART_KEY = "dryfruit_cart";

    const wishlistProducts = document.getElementById("wishlistProducts");
    const wishlistEmpty = document.getElementById("wishlistEmpty");

    if (!wishlistProducts) {
        return;
    }

    // ---------------------------------------------------------
    // STORAGE HELPERS
    // ---------------------------------------------------------

    function getWishlist() {
        try {
            const data = JSON.parse(
                localStorage.getItem(WISHLIST_KEY)
            );

            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error("Wishlist loading error:", error);
            return [];
        }
    }

    function saveWishlist(wishlist) {
        localStorage.setItem(
            WISHLIST_KEY,
            JSON.stringify(wishlist)
        );
    }

    function getCart() {
        try {
            const data = JSON.parse(
                localStorage.getItem(CART_KEY)
            );

            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error("Cart loading error:", error);
            return [];
        }
    }

    function saveCart(cart) {
        localStorage.setItem(
            CART_KEY,
            JSON.stringify(cart)
        );
    }

    // ---------------------------------------------------------
    // ID HELPERS
    // ---------------------------------------------------------

    function getWishlistId(item) {

        if (typeof item === "object" && item !== null) {
            return Number(
                item.id ??
                item.productId ??
                item.product_id
            );
        }

        return Number(item);
    }

    function getWishlistIds() {

        return getWishlist()
            .map(getWishlistId)
            .filter(id => !isNaN(id));
    }

    function isInWishlist(productId) {

        return getWishlistIds().includes(
            Number(productId)
        );
    }

    // ---------------------------------------------------------
    // HTML ESCAPE
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
    // PRICE
    // ---------------------------------------------------------

    function formatMoney(price) {

        if (
            typeof window.formatPrice === "function"
        ) {
            return window.formatPrice(price);
        }

        return "₹" + Number(price || 0).toLocaleString("en-IN");
    }

    // ---------------------------------------------------------
    // RATING STARS
    // ---------------------------------------------------------

    function getStars(rating) {

        const value = Number(rating || 0);

        let html = "";

        for (let i = 1; i <= 5; i++) {

            if (value >= i) {

                html += '<i class="fas fa-star"></i>';

            } else if (value >= i - 0.5) {

                html += '<i class="fas fa-star-half-alt"></i>';

            } else {

                html += '<i class="far fa-star"></i>';
            }
        }

        return html;
    }

    // ---------------------------------------------------------
    // DISCOUNT
    // ---------------------------------------------------------

    function calculateDiscount(product) {

        if (product.discount) {
            return Number(product.discount);
        }

        const price = Number(product.price || 0);
        const oldPrice = Number(product.oldPrice || 0);

        if (oldPrice > price && price > 0) {

            return Math.round(
                ((oldPrice - price) / oldPrice) * 100
            );
        }

        return 0;
    }

    // ---------------------------------------------------------
    // WISHLIST COUNT
    // ---------------------------------------------------------

    function updateWishlistCount() {

        const count = getWishlistIds().length;

        const elements = document.querySelectorAll(
            "#wishlistCount, .wishlist-count, [data-wishlist-count]"
        );

        elements.forEach(element => {
            element.textContent = count;
        });
    }

    // ---------------------------------------------------------
    // CART COUNT
    // ---------------------------------------------------------

    function updateCartCount() {

        const cart = getCart();

        const count = cart.reduce(
            (total, item) =>
                total + Number(item.quantity || 1),
            0
        );

        const elements = document.querySelectorAll(
            "#cartCount, .cart-count, [data-cart-count]"
        );

        elements.forEach(element => {
            element.textContent = count;
        });
    }

    // ---------------------------------------------------------
    // TOAST
    // ---------------------------------------------------------

    function showMessage(message, type = "success") {

        if (
            window.DryFruitApp &&
            typeof window.DryFruitApp.showToast === "function"
        ) {
            window.DryFruitApp.showToast(
                message,
                type
            );

            return;
        }

        const toast = document.getElementById("toast");

        if (!toast) {
            alert(message);
            return;
        }

        const toastMessage =
            document.getElementById("toastMessage");

        const toastIcon =
            document.getElementById("toastIcon");

        if (toastMessage) {
            toastMessage.textContent = message;
        }

        if (toastIcon) {

            if (type === "success") {
                toastIcon.className =
                    "fas fa-check-circle";
            } else if (type === "error") {
                toastIcon.className =
                    "fas fa-times-circle";
            } else {
                toastIcon.className =
                    "fas fa-info-circle";
            }
        }

        toast.classList.add("show");

        setTimeout(() => {
            toast.classList.remove("show");
        }, 2500);
    }

    // ---------------------------------------------------------
    // ADD TO WISHLIST
    // ---------------------------------------------------------

    function addToWishlist(productId) {

        const id = Number(productId);

        if (!id || isNaN(id)) {
            return;
        }

        const wishlist = getWishlist();

        const exists = wishlist.some(
            item => getWishlistId(item) === id
        );

        if (exists) {
            return;
        }

        wishlist.push(id);

        saveWishlist(wishlist);

        updateWishlistCount();

        renderWishlist();

        showMessage(
            "Product wishlist mein add ho gaya ❤️",
            "success"
        );
    }

    // ---------------------------------------------------------
    // REMOVE FROM WISHLIST
    // ---------------------------------------------------------

    function removeFromWishlist(productId) {

        const id = Number(productId);

        const wishlist = getWishlist();

        const updatedWishlist = wishlist.filter(
            item => getWishlistId(item) !== id
        );

        saveWishlist(updatedWishlist);

        updateWishlistCount();

        renderWishlist();

        showMessage(
            "Product wishlist se remove kar diya.",
            "success"
        );
    }

    // ---------------------------------------------------------
    // CLEAR WISHLIST
    // ---------------------------------------------------------

    function clearWishlist() {

        localStorage.removeItem(WISHLIST_KEY);

        updateWishlistCount();

        renderWishlist();

        showMessage(
            "Wishlist clear kar di gayi.",
            "success"
        );
    }

    // ---------------------------------------------------------
    // ADD PRODUCT TO CART
    // ---------------------------------------------------------

    function addProductToCart(productId, button = null) {

        const id = Number(productId);

        if (!id || isNaN(id)) {
            return;
        }

        // Existing App.js function use karne ki koshish
        if (
            window.DryFruitApp &&
            typeof window.DryFruitApp.addToCart === "function"
        ) {

            window.DryFruitApp.addToCart(id);

            updateCartCount();

            if (button) {
                showAddedButton(button);
            }

            return;
        }

        // -----------------------------------------------------
        // Fallback cart system
        // -----------------------------------------------------

        const product =
            typeof getProductById === "function"
                ? getProductById(id)
                : null;

        if (!product) {

            showMessage(
                "Product nahi mila.",
                "error"
            );

            return;
        }

        const cart = getCart();

        const existingIndex = cart.findIndex(
            item => Number(item.id) === id
        );

        if (existingIndex !== -1) {

            cart[existingIndex].quantity =
                Number(
                    cart[existingIndex].quantity || 1
                ) + 1;

        } else {

            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                oldPrice: product.oldPrice,
                image: product.image,
                category: product.category,
                categoryName: product.categoryName,
                weight: product.weight,
                quantity: 1
            });
        }

        saveCart(cart);

        updateCartCount();

        if (button) {
            showAddedButton(button);
        }

        showMessage(
            `${product.name} cart mein add ho gaya 🛒`,
            "success"
        );
    }

    // ---------------------------------------------------------
    // ADDED BUTTON ANIMATION
    // ---------------------------------------------------------

    function showAddedButton(button) {

        const originalHTML = button.innerHTML;

        button.innerHTML =
            '<i class="fas fa-check"></i> Added';

        button.classList.add("added");

        button.disabled = true;

        setTimeout(() => {

            button.innerHTML = originalHTML;

            button.classList.remove("added");

            button.disabled = false;

        }, 1500);
    }

    // ---------------------------------------------------------
    // CREATE WISHLIST CARD
    // ---------------------------------------------------------

    function createWishlistCard(product) {

        const discount =
            calculateDiscount(product);

        const rating =
            Number(product.rating || 0);

        const reviews =
            Number(product.reviews || 0);

        const badge =
            product.badge || "";

        return `
            <div class="col-lg-3 col-md-4 col-sm-6 mb-4">

                <div
                    class="wishlist-card h-100"
                    data-product-id="${product.id}"
                >

                    <div class="wishlist-image-box">

                        ${
                            badge
                                ? `
                                <span class="wishlist-product-badge">
                                    ${escapeHTML(badge)}
                                </span>
                                `
                                : ""
                        }

                        ${
                            discount > 0
                                ? `
                                <span class="wishlist-discount">
                                    ${discount}% OFF
                                </span>
                                `
                                : ""
                        }

                        <button
                            type="button"
                            class="wishlist-remove"
                            data-action="remove"
                            data-id="${product.id}"
                            title="Remove from wishlist"
                        >
                            <i class="fas fa-heart"></i>
                        </button>

                        <a
                            href="product-details.html?id=${encodeURIComponent(product.id)}"
                            class="wishlist-image-link"
                        >

                            <img
                                src="${escapeHTML(product.image)}"
                                alt="${escapeHTML(product.name)}"
                                class="wishlist-image"
                                loading="lazy"
                                onerror="this.src='https://images.unsplash.com/photo-1608797178974-15b35a64ede9?auto=format&fit=crop&w=700&q=80';"
                            >

                        </a>

                    </div>

                    <div class="wishlist-card-body">

                        <div class="wishlist-category">
                            ${escapeHTML(
                                product.categoryName ||
                                product.category ||
                                "Dry Fruits"
                            )}
                        </div>

                        <h5 class="wishlist-product-name">

                            <a
                                href="product-details.html?id=${encodeURIComponent(product.id)}"
                            >
                                ${escapeHTML(product.name)}
                            </a>

                        </h5>

                        <div class="wishlist-rating">

                            <span class="wishlist-stars">
                                ${getStars(rating)}
                            </span>

                            <span class="wishlist-review-count">
                                (${reviews})
                            </span>

                        </div>

                        <div class="wishlist-price">

                            <span class="wishlist-current-price">
                                ${formatMoney(product.price)}
                            </span>

                            ${
                                product.oldPrice
                                    ? `
                                    <span class="wishlist-old-price">
                                        ${formatMoney(product.oldPrice)}
                                    </span>
                                    `
                                    : ""
                            }

                        </div>

                        <div class="wishlist-actions">

                            <button
                                type="button"
                                class="btn btn-success wishlist-cart-btn"
                                data-action="cart"
                                data-id="${product.id}"
                            >
                                <i class="fas fa-shopping-cart"></i>
                                Add to Cart
                            </button>

                            <a
                                href="product-details.html?id=${encodeURIComponent(product.id)}"
                                class="btn btn-outline-success wishlist-view-btn"
                                title="View Product"
                            >
                                <i class="fas fa-eye"></i>
                            </a>

                        </div>

                    </div>

                </div>

            </div>
        `;
    }

    // ---------------------------------------------------------
    // RENDER WISHLIST
    // ---------------------------------------------------------

    function renderWishlist() {

        const ids = getWishlistIds();

        if (ids.length === 0) {

            wishlistProducts.innerHTML = "";

            wishlistProducts.style.display = "none";

            if (wishlistEmpty) {
                wishlistEmpty.style.display = "block";
            }

            updateWishlistCount();

            return;
        }

        wishlistProducts.style.display = "";

        if (wishlistEmpty) {
            wishlistEmpty.style.display = "none";
        }

        const products = [];

        ids.forEach(id => {

            if (
                typeof getProductById !== "function"
            ) {
                return;
            }

            const product = getProductById(id);

            if (product) {
                products.push(product);
            }
        });

        if (products.length === 0) {

            wishlistProducts.innerHTML = "";

            wishlistProducts.style.display = "none";

            if (wishlistEmpty) {
                wishlistEmpty.style.display = "block";
            }

            return;
        }

        wishlistProducts.innerHTML =
            products.map(createWishlistCard).join("");

        updateWishlistCount();
    }

    // ---------------------------------------------------------
    // EVENT DELEGATION
    // ---------------------------------------------------------

    wishlistProducts.addEventListener(
        "click",
        function (event) {

            const actionButton =
                event.target.closest(
                    "[data-action]"
                );

            if (!actionButton) {
                return;
            }

            const action =
                actionButton.dataset.action;

            const productId =
                Number(actionButton.dataset.id);

            if (!productId) {
                return;
            }

            // REMOVE
            if (action === "remove") {

                removeFromWishlist(productId);

                return;
            }

            // CART
            if (action === "cart") {

                addProductToCart(
                    productId,
                    actionButton
                );

                return;
            }
        }
    );

    // ---------------------------------------------------------
    // INITIALIZE
    // ---------------------------------------------------------

    renderWishlist();

    updateWishlistCount();

    updateCartCount();

    // ---------------------------------------------------------
    // PUBLIC API
    // ---------------------------------------------------------

    window.DryFruitWishlist = {

        getWishlist,
        getWishlistIds,
        isInWishlist,

        addToWishlist,
        removeFromWishlist,

        clearWishlist,

        addProductToCart,

        renderWishlist,

        updateWishlistCount
    };

});