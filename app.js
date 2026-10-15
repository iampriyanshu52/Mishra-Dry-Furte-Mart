/* =========================================================
   MISHRA DRY FRUIT MART
   Main Application JavaScript
   File: frontend/js/app.js
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    initApp();
});


/* =========================================================
   GLOBAL STATE
   ========================================================= */

const AppState = {
    cart: JSON.parse(localStorage.getItem("dryfruit_cart")) || [],
    wishlist: JSON.parse(localStorage.getItem("dryfruit_wishlist")) || [],
    currentCategory: "all",
    currentSearch: "",
    currentSort: "default"
};


/* =========================================================
   INITIALIZE APP
   ========================================================= */

function initApp() {
    renderFeaturedProducts();
    updateCartCount();
    updateWishlistCount();
    setupCategoryTabs();
    setupSearch();
    setupCartButtons();
    setupWishlistButtons();
    setupNewsletter();
    setupBackToTop();
    setupNavbarScroll();
    setupMobileMenu();
    setupGeneralClicks();

    console.log("Mishra Dry Fruit Mart loaded successfully.");
}


/* =========================================================
   LOCAL STORAGE
   ========================================================= */

function saveCart() {
    localStorage.setItem(
        "dryfruit_cart",
        JSON.stringify(AppState.cart)
    );
}

function saveWishlist() {
    localStorage.setItem(
        "dryfruit_wishlist",
        JSON.stringify(AppState.wishlist)
    );
}


/* =========================================================
   FEATURED PRODUCTS
   ========================================================= */

function renderFeaturedProducts(category = "all") {

    const container = document.getElementById("featuredProducts");

    if (!container) return;

    AppState.currentCategory = category;

    let products = [...DryFruitStore.products];

    if (category !== "all") {
        products = products.filter(product =>
            product.category === category
        );
    }

    if (products.length === 0) {
        container.innerHTML = `
            <div class="col-12">
                <div class="empty-state">
                    <i class="fas fa-box-open"></i>
                    <h4>No products found</h4>
                    <p>Products will be added soon.</p>
                </div>
            </div>
        `;
        return;
    }

    /*
       Homepage par maximum 8 products show karenge.
    */

    products = products.slice(0, 8);

    container.innerHTML = products
        .map(product => createProductCard(product))
        .join("");

    updateWishlistButtons();
}


/* =========================================================
   PRODUCT CARD
   ========================================================= */

function createProductCard(product) {

    const isWishlisted =
        AppState.wishlist.includes(product.id);

    const discount =
        product.oldPrice && product.price
            ? Math.round(
                ((product.oldPrice - product.price) /
                    product.oldPrice) * 100
            )
            : product.discount || 0;

    return `
        <div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 mb-4">

            <div class="product-card">

                <div class="product-image-wrapper">

                    ${product.badge
                        ? `<span class="product-badge">
                            ${product.badge}
                           </span>`
                        : ""
                    }

                    ${discount > 0
                        ? `<span class="product-discount">
                            ${discount}% OFF
                           </span>`
                        : ""
                    }

                    <button
                        class="product-wishlist ${isWishlisted ? "active" : ""}"
                        data-wishlist-id="${product.id}"
                        aria-label="Add to wishlist"
                    >
                        <i class="${isWishlisted
                            ? "fas"
                            : "far"
                        } fa-heart"></i>
                    </button>

                    <a href="product-details.html?id=${product.id}"
                       class="product-image-link">

                        <img
                            src="${product.image}"
                            alt="${product.name}"
                            class="product-image"
                            loading="lazy"
                            onerror="this.src='https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=700&q=80'"
                        >

                    </a>

                </div>


                <div class="product-info">

                    <span class="product-category">
                        ${product.categoryName}
                    </span>

                    <h3 class="product-name">
                        <a href="product-details.html?id=${product.id}">
                            ${product.name}
                        </a>
                    </h3>


                    <div class="product-rating">

                        <span class="stars">
                            ${generateStars(product.rating)}
                        </span>

                        <span class="review-count">
                            (${product.reviews || 0})
                        </span>

                    </div>


                    <div class="product-price-row">

                        <div class="product-price">

                            <span class="current-price">
                                ${formatPrice(product.price)}
                            </span>

                            ${product.oldPrice
                                ? `<span class="old-price">
                                    ${formatPrice(product.oldPrice)}
                                   </span>`
                                : ""
                            }

                        </div>

                    </div>


                    <div class="product-actions">

                        <button
                            class="add-to-cart-btn"
                            data-product-id="${product.id}"
                        >
                            <i class="fas fa-shopping-cart"></i>
                            Add to Cart
                        </button>

                        <a
                            href="product-details.html?id=${product.id}"
                            class="view-product-btn"
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


/* =========================================================
   STAR RATING
   ========================================================= */

function generateStars(rating = 5) {

    let html = "";

    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= fullStars; i++) {
        html += `<i class="fas fa-star"></i>`;
    }

    if (hasHalfStar) {
        html += `<i class="fas fa-star-half-alt"></i>`;
    }

    const emptyStars =
        5 - fullStars - (hasHalfStar ? 1 : 0);

    for (let i = 0; i < emptyStars; i++) {
        html += `<i class="far fa-star"></i>`;
    }

    return html;
}


/* =========================================================
   CATEGORY TABS
   ========================================================= */

function setupCategoryTabs() {

    const tabs =
        document.querySelectorAll(".product-tabs button");

    if (!tabs.length) return;

    tabs.forEach(tab => {

        tab.addEventListener("click", () => {

            tabs.forEach(item =>
                item.classList.remove("active")
            );

            tab.classList.add("active");

            const category =
                tab.dataset.category || "all";

            renderFeaturedProducts(category);

        });

    });
}


/* =========================================================
   ADD TO CART
   ========================================================= */

function addToCart(productId, quantity = 1, size = null) {

    const product =
        getProductById(productId);

    if (!product) {
        showToast(
            "Product not found!",
            "error"
        );
        return;
    }

    const selectedSize =
        size || product.weight || "250g";

    const cartKey =
        `${productId}-${selectedSize}`;

    const existingItem =
        AppState.cart.find(
            item => item.cartKey === cartKey
        );

    if (existingItem) {

        existingItem.quantity += quantity;

    } else {

        AppState.cart.push({

            cartKey: cartKey,

            id: product.id,

            name: product.name,

            price: product.price,

            image: product.image,

            weight: selectedSize,

            quantity: quantity

        });

    }

    saveCart();

    updateCartCount();

    showToast(
        `${product.name} added to cart!`,
        "success"
    );
}


/* =========================================================
   CART BUTTONS
   ========================================================= */

function setupCartButtons() {

    document.addEventListener("click", event => {

        const button =
            event.target.closest(".add-to-cart-btn");

        if (!button) return;

        const productId =
            Number(button.dataset.productId);

        if (!productId) return;

        addToCart(productId);

        animateCartButton(button);

    });
}


/* =========================================================
   CART BUTTON ANIMATION
   ========================================================= */

function animateCartButton(button) {

    const originalHTML =
        button.innerHTML;

    button.innerHTML =
        `<i class="fas fa-check"></i> Added`;

    button.classList.add("added");

    setTimeout(() => {

        button.innerHTML =
            originalHTML;

        button.classList.remove("added");

    }, 1200);
}


/* =========================================================
   CART COUNT
   ========================================================= */

function updateCartCount() {

    const count =
        AppState.cart.reduce(
            (total, item) =>
                total + Number(item.quantity || 0),
            0
        );

    const counters =
        document.querySelectorAll(
            ".cart-count, #cartCount, [data-cart-count]"
        );

    counters.forEach(counter => {
        counter.textContent = count;
    });

    /*
       Hide badge if cart empty
    */

    counters.forEach(counter => {

        if (count === 0) {
            counter.classList.add("empty");
        } else {
            counter.classList.remove("empty");
        }

    });
}


/* =========================================================
   GET CART TOTAL
   ========================================================= */

function getCartTotal() {

    return AppState.cart.reduce(
        (total, item) =>
            total +
            (Number(item.price) *
                Number(item.quantity)),
        0
    );
}


/* =========================================================
   WISHLIST
   ========================================================= */

function setupWishlistButtons() {

    document.addEventListener("click", event => {

        const button =
            event.target.closest(
                "[data-wishlist-id]"
            );

        if (!button) return;

        const productId =
            Number(button.dataset.wishlistId);

        toggleWishlist(productId);

    });
}


function toggleWishlist(productId) {

    const product =
        getProductById(productId);

    if (!product) return;

    const index =
        AppState.wishlist.indexOf(productId);

    if (index === -1) {

        AppState.wishlist.push(productId);

        showToast(
            `${product.name} added to wishlist!`,
            "success"
        );

    } else {

        AppState.wishlist.splice(index, 1);

        showToast(
            `${product.name} removed from wishlist.`,
            "info"
        );
    }

    saveWishlist();

    updateWishlistCount();

    updateWishlistButtons();
}


function updateWishlistButtons() {

    document
        .querySelectorAll("[data-wishlist-id]")
        .forEach(button => {

            const productId =
                Number(button.dataset.wishlistId);

            const isActive =
                AppState.wishlist.includes(productId);

            button.classList.toggle(
                "active",
                isActive
            );

            const icon =
                button.querySelector("i");

            if (icon) {

                icon.className =
                    isActive
                        ? "fas fa-heart"
                        : "far fa-heart";
            }

        });
}


function updateWishlistCount() {

    const counters =
        document.querySelectorAll(
            ".wishlist-count, #wishlistCount, [data-wishlist-count]"
        );

    counters.forEach(counter => {

        counter.textContent =
            AppState.wishlist.length;

    });
}


/* =========================================================
   SEARCH
   ========================================================= */

function setupSearch() {

    const searchButtons =
        document.querySelectorAll(
            "[data-search-open], .search-btn"
        );

    const searchOverlay =
        document.getElementById("searchOverlay");

    const searchInput =
        document.getElementById("searchInput");

    const searchResults =
        document.getElementById("searchResults");


    /*
       Open search
    */

    searchButtons.forEach(button => {

        button.addEventListener("click", event => {

            event.preventDefault();

            if (!searchOverlay) return;

            searchOverlay.classList.add("active");

            setTimeout(() => {

                searchInput?.focus();

            }, 200);

        });

    });


    /*
       Close search
    */

    document.addEventListener("click", event => {

        if (
            event.target.matches(
                "[data-search-close], .search-overlay-close"
            )
        ) {

            closeSearch();

        }

    });


    /*
       ESC key
    */

    document.addEventListener("keydown", event => {

        if (event.key === "Escape") {

            closeSearch();

        }

    });


    /*
       Search typing
    */

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            () => {

                const query =
                    searchInput.value.trim();

                AppState.currentSearch =
                    query;

                if (!query) {

                    if (searchResults) {
                        searchResults.innerHTML = "";
                    }

                    return;
                }

                const results =
                    searchProducts(query);

                displaySearchResults(
                    results,
                    searchResults
                );

            }
        );

    }
}


function closeSearch() {

    const overlay =
        document.getElementById(
            "searchOverlay"
        );

    if (!overlay) return;

    overlay.classList.remove("active");

}


function displaySearchResults(
    results,
    container
) {

    if (!container) return;

    if (!results.length) {

        container.innerHTML = `
            <div class="search-empty">
                <i class="fas fa-search"></i>
                <h4>No products found</h4>
                <p>Try another dry fruit name.</p>
            </div>
        `;

        return;
    }


    container.innerHTML = results
        .slice(0, 8)
        .map(product => `
            <a
                href="product-details.html?id=${product.id}"
                class="search-result-item"
            >

                <img
                    src="${product.image}"
                    alt="${product.name}"
                >

                <div>

                    <h6>${product.name}</h6>

                    <span>
                        ${formatPrice(product.price)}
                    </span>

                </div>

            </a>
        `)
        .join("");
}


/* =========================================================
   NEWSLETTER
   ========================================================= */

function setupNewsletter() {

    const forms =
        document.querySelectorAll(
            "#newsletterForm, .newsletter-form"
        );

    forms.forEach(form => {

        form.addEventListener(
            "submit",
            event => {

                event.preventDefault();

                const input =
                    form.querySelector(
                        'input[type="email"]'
                    );

                if (!input) return;

                const email =
                    input.value.trim();

                if (!isValidEmail(email)) {

                    showToast(
                        "Please enter a valid email address.",
                        "error"
                    );

                    return;
                }

                /*
                   Demo newsletter subscription.
                   Later backend/API se connect kar sakte hain.
                */

                localStorage.setItem(
                    "newsletter_email",
                    email
                );

                input.value = "";

                showToast(
                    "Thank you for subscribing!",
                    "success"
                );

            }
        );

    });
}


function isValidEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(email);

}


/* =========================================================
   BACK TO TOP
   ========================================================= */

function setupBackToTop() {

    const button =
        document.getElementById(
            "backToTop"
        );

    if (!button) return;


    window.addEventListener(
        "scroll",
        () => {

            if (window.scrollY > 400) {

                button.classList.add(
                    "show"
                );

            } else {

                button.classList.remove(
                    "show"
                );

            }

        }
    );


    button.addEventListener(
        "click",
        () => {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }
    );
}


/* =========================================================
   NAVBAR SCROLL
   ========================================================= */

function setupNavbarScroll() {

    const navbar =
        document.querySelector(
            ".navbar"
        );

    if (!navbar) return;

    window.addEventListener(
        "scroll",
        () => {

            if (window.scrollY > 50) {

                navbar.classList.add(
                    "navbar-scrolled"
                );

            } else {

                navbar.classList.remove(
                    "navbar-scrolled"
                );

            }

        }
    );
}


/* =========================================================
   MOBILE MENU
   ========================================================= */

function setupMobileMenu() {

    const toggler =
        document.querySelector(
            ".navbar-toggler"
        );

    const menu =
        document.querySelector(
            ".navbar-collapse"
        );

    if (!toggler || !menu) return;

    document
        .querySelectorAll(
            ".navbar-collapse a"
        )
        .forEach(link => {

            link.addEventListener(
                "click",
                () => {

                    if (
                        window.innerWidth < 992
                    ) {

                        const bsCollapse =
                            bootstrap.Collapse
                                .getInstance(menu);

                        if (bsCollapse) {
                            bsCollapse.hide();
                        }

                    }

                }
            );

        });
}


/* =========================================================
   GENERAL CLICK EVENTS
   ========================================================= */

function setupGeneralClicks() {

    /*
       Category links
    */

    document
        .querySelectorAll(
            "[data-category-link]"
        )
        .forEach(link => {

            link.addEventListener(
                "click",
                event => {

                    const category =
                        link.dataset.categoryLink;

                    if (!category) return;

                    /*
                       Shop page par redirect
                    */

                    event.preventDefault();

                    window.location.href =
                        `shop.html?category=${encodeURIComponent(category)}`;

                }
            );

        });


    /*
       Smooth scrolling links
    */

    document
        .querySelectorAll(
            'a[href^="#"]'
        )
        .forEach(link => {

            link.addEventListener(
                "click",
                event => {

                    const targetId =
                        link.getAttribute("href");

                    if (
                        !targetId ||
                        targetId === "#"
                    ) {
                        return;
                    }

                    const target =
                        document.querySelector(
                            targetId
                        );

                    if (!target) return;

                    event.preventDefault();

                    target.scrollIntoView({
                        behavior: "smooth"
                    });

                }
            );

        });

}


/* =========================================================
   TOAST NOTIFICATION
   ========================================================= */

function showToast(
    message,
    type = "success"
) {

    const toast =
        document.getElementById(
            "toast"
        );

    if (!toast) {

        console.log(
            `[${type}] ${message}`
        );

        return;
    }


    let icon =
        "fas fa-check-circle";

    if (type === "error") {
        icon = "fas fa-exclamation-circle";
    }

    if (type === "info") {
        icon = "fas fa-info-circle";
    }


    toast.innerHTML = `
        <div class="toast-icon">
            <i class="${icon}"></i>
        </div>

        <div class="toast-message">
            ${message}
        </div>

        <button
            class="toast-close"
            onclick="this.parentElement.classList.remove('show')"
        >
            <i class="fas fa-times"></i>
        </button>
    `;


    toast.classList.add("show");


    clearTimeout(
        window.toastTimeout
    );


    window.toastTimeout =
        setTimeout(() => {

            toast.classList.remove(
                "show"
            );

        }, 3000);
}


/* =========================================================
   PRODUCT QUICK VIEW
   ========================================================= */

function quickView(productId) {

    const product =
        getProductById(productId);

    if (!product) return;

    showToast(
        `${product.name} selected`,
        "info"
    );

}


/* =========================================================
   REMOVE FROM CART
   ========================================================= */

function removeFromCart(cartKey) {

    const index =
        AppState.cart.findIndex(
            item => item.cartKey === cartKey
        );

    if (index === -1) return;

    const removed =
        AppState.cart[index];

    AppState.cart.splice(index, 1);

    saveCart();

    updateCartCount();

    showToast(
        `${removed.name} removed from cart.`,
        "info"
    );

}


/* =========================================================
   UPDATE CART QUANTITY
   ========================================================= */

function updateCartQuantity(
    cartKey,
    quantity
) {

    const item =
        AppState.cart.find(
            item => item.cartKey === cartKey
        );

    if (!item) return;

    quantity =
        parseInt(quantity);

    if (isNaN(quantity) || quantity < 1) {
        quantity = 1;
    }

    if (quantity > 20) {
        quantity = 20;
    }

    item.quantity =
        quantity;

    saveCart();

    updateCartCount();

}


/* =========================================================
   CLEAR CART
   ========================================================= */

function clearCart() {

    AppState.cart = [];

    saveCart();

    updateCartCount();

    showToast(
        "Cart cleared successfully.",
        "info"
    );

}


/* =========================================================
   GET CART ITEM COUNT
   ========================================================= */

function getCartItemCount() {

    return AppState.cart.reduce(
        (total, item) =>
            total + Number(item.quantity || 0),
        0
    );

}


/* =========================================================
   CHECKOUT VALIDATION
   ========================================================= */

function validateCart() {

    if (!AppState.cart.length) {

        showToast(
            "Your cart is empty.",
            "error"
        );

        return false;
    }

    return true;
}


/* =========================================================
   COUPON SYSTEM
   ========================================================= */

const Coupons = {

    WELCOME20: {
        type: "percentage",
        value: 20,
        minimum: 499
    },

    SAVE100: {
        type: "fixed",
        value: 100,
        minimum: 999
    },

    DRYFRUIT10: {
        type: "percentage",
        value: 10,
        minimum: 299
    }

};


function applyCoupon(code) {

    code =
        String(code)
            .trim()
            .toUpperCase();

    const coupon =
        Coupons[code];

    if (!coupon) {

        return {
            success: false,
            message: "Invalid coupon code."
        };

    }

    const subtotal =
        getCartTotal();

    if (subtotal < coupon.minimum) {

        return {
            success: false,
            message:
                `Minimum order value is ${formatPrice(coupon.minimum)}`
        };

    }

    let discount = 0;

    if (coupon.type === "percentage") {

        discount =
            subtotal *
            coupon.value /
            100;

    } else {

        discount =
            coupon.value;

    }

    return {

        success: true,

        code: code,

        discount: Math.min(
            discount,
            subtotal
        ),

        message:
            "Coupon applied successfully!"

    };

}


/* =========================================================
   UTILITY
   ========================================================= */

function formatPrice(price) {

    if (
        typeof window.DryFruitStore !==
        "undefined" &&
        typeof DryFruitStore.formatPrice ===
        "function"
    ) {

        return DryFruitStore.formatPrice(
            price
        );

    }

    return new Intl.NumberFormat(
        "en-IN",
        {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0
        }
    ).format(price);

}


function getProductById(id) {

    if (
        typeof window.DryFruitStore ===
        "undefined"
    ) {
        return null;
    }

    return DryFruitStore.getProductById(
        Number(id)
    );

}


function searchProducts(query) {

    if (
        !query ||
        typeof window.DryFruitStore ===
        "undefined"
    ) {
        return [];
    }

    return DryFruitStore.searchProducts(
        query
    );

}


/* =========================================================
   GLOBAL EXPORTS
   ========================================================= */

window.DryFruitApp = {

    state: AppState,

    addToCart,

    removeFromCart,

    updateCartQuantity,

    clearCart,

    getCartTotal,

    getCartItemCount,

    toggleWishlist,

    applyCoupon,

    showToast,

    renderFeaturedProducts,

    createProductCard,

    quickView

};


/* =========================================================
   DEBUG
   ========================================================= */

console.log(
    "Mishra Mishra Dry Fruit Mart App initialized."
);

console.log(
    "Cart items:",
    AppState.cart
);

console.log(
    "Wishlist items:",
    AppState.wishlist
);