/* =========================================================
   MISHRA DRY FRUIT MART - PRODUCT DETAILS
   File: frontend/js/product-details.js
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const productDetails = document.getElementById("productDetails");

    if (!productDetails) return;

    /* ---------------------------------------------------------
       GET PRODUCT ID FROM URL
       Example:
       product-details.html?id=1
       --------------------------------------------------------- */

    const params = new URLSearchParams(window.location.search);
    const productId = params.get("id");

    let product = null;

    if (productId && typeof getProductById === "function") {
        product = getProductById(productId);
    }

    /* ---------------------------------------------------------
       PRODUCT NOT FOUND
       --------------------------------------------------------- */

    if (!product) {
        showProductNotFound();
        return;
    }

    /* ---------------------------------------------------------
       STATE
       --------------------------------------------------------- */

    let selectedSize = null;
    let selectedQuantity = 1;

    /* ---------------------------------------------------------
       HELPERS
       --------------------------------------------------------- */

    function escapeHTML(value) {
        if (value === null || value === undefined) return "";

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function getSizes() {
        if (!Array.isArray(product.sizes)) {
            return [];
        }

        return product.sizes;
    }

    function getSizeName(size) {
        if (!size) return "";

        return (
            size.weight ||
            size.name ||
            size.size ||
            size.label ||
            ""
        );
    }

    function getSizePrice(size) {
        if (!size) return product.price;

        return Number(
            size.price ??
            size.amount ??
            product.price
        );
    }

    function getDefaultSize() {
        const sizes = getSizes();

        if (sizes.length > 0) {
            return getSizeName(sizes[0]);
        }

        return product.weight || "250g";
    }

    function getSelectedSizeObject() {
        const sizes = getSizes();

        return sizes.find(function (size) {
            return getSizeName(size) === selectedSize;
        });
    }

    function getCurrentPrice() {
        const selected = getSelectedSizeObject();

        if (selected) {
            return getSizePrice(selected);
        }

        return Number(product.price);
    }

    function calculateDiscount(price, oldPrice) {
        if (!oldPrice || oldPrice <= price) return product.discount || 0;

        return Math.round(
            ((oldPrice - price) / oldPrice) * 100
        );
    }

    function createStars(rating) {
        let html = "";

        const fullStars = Math.floor(rating);
        const hasHalf = rating % 1 >= 0.5;

        for (let i = 1; i <= 5; i++) {

            if (i <= fullStars) {
                html += '<i class="fas fa-star"></i>';
            } else if (i === fullStars + 1 && hasHalf) {
                html += '<i class="fas fa-star-half-alt"></i>';
            } else {
                html += '<i class="far fa-star"></i>';
            }
        }

        return html;
    }

    /* ---------------------------------------------------------
       UPDATE BREADCRUMB
       --------------------------------------------------------- */

    function updateBreadcrumb() {

        const breadcrumb = document.getElementById(
            "breadcrumbProduct"
        );

        if (breadcrumb) {
            breadcrumb.textContent = product.name;
        }

        document.title = `${product.name} | Mishra Dry Fruit Mart`;
    }

    /* ---------------------------------------------------------
       RENDER PRODUCT
       --------------------------------------------------------- */

    function renderProduct() {

        const sizes = getSizes();

        selectedSize = getDefaultSize();

        const selectedSizeObj = getSelectedSizeObject();

        const currentPrice = selectedSizeObj
            ? getSizePrice(selectedSizeObj)
            : Number(product.price);

        const oldPrice = Number(product.oldPrice || 0);

        const discount = calculateDiscount(
            currentPrice,
            oldPrice
        );

        let sizesHTML = "";

        if (sizes.length > 0) {

            sizesHTML = `
                <div class="product-size-section mt-4">
                    <h6 class="fw-bold mb-3">
                        Select Weight
                    </h6>

                    <div class="product-size-options">
                        ${sizes.map(function (size, index) {

                            const sizeName = getSizeName(size);
                            const sizePrice = getSizePrice(size);

                            return `
                                <button
                                    type="button"
                                    class="size-option ${index === 0 ? "active" : ""}"
                                    data-size="${escapeHTML(sizeName)}"
                                    data-price="${sizePrice}"
                                >
                                    <span>
                                        ${escapeHTML(sizeName)}
                                    </span>

                                    <strong>
                                        ${formatPrice(sizePrice)}
                                    </strong>
                                </button>
                            `;

                        }).join("")}
                    </div>
                </div>
            `;

        } else {

            sizesHTML = `
                <div class="product-size-section mt-4">
                    <h6 class="fw-bold mb-2">
                        Weight
                    </h6>

                    <span class="badge bg-light text-dark border px-3 py-2">
                        ${escapeHTML(product.weight || "250g")}
                    </span>
                </div>
            `;
        }

        productDetails.innerHTML = `

            <div class="row g-4 g-lg-5">

                <!-- PRODUCT IMAGE -->

                <div class="col-lg-6">

                    <div class="product-detail-image-box">

                        ${product.badge ? `
                            <span class="product-detail-badge">
                                ${escapeHTML(product.badge)}
                            </span>
                        ` : ""}

                        ${discount > 0 ? `
                            <span class="product-detail-discount">
                                ${discount}% OFF
                            </span>
                        ` : ""}

                        <button
                            type="button"
                            class="product-detail-wishlist"
                            id="detailWishlistBtn"
                            aria-label="Add to wishlist"
                        >
                            <i class="far fa-heart"></i>
                        </button>

                        <img
                            src="${escapeHTML(product.image)}"
                            alt="${escapeHTML(product.name)}"
                            class="product-detail-image"
                            onerror="this.src='https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=900&q=80'"
                        >

                    </div>

                </div>


                <!-- PRODUCT INFORMATION -->

                <div class="col-lg-6">

                    <div class="product-detail-info">

                        <div class="product-detail-category">
                            ${escapeHTML(product.categoryName || product.category)}
                        </div>

                        <h1 class="product-detail-title">
                            ${escapeHTML(product.name)}
                        </h1>

                        <div class="product-detail-rating">

                            <span class="stars">
                                ${createStars(Number(product.rating || 0))}
                            </span>

                            <strong>
                                ${Number(product.rating || 0).toFixed(1)}
                            </strong>

                            <span class="review-count">
                                (${Number(product.reviews || 0)} Reviews)
                            </span>

                        </div>


                        <div class="product-detail-price">

                            <span
                                id="detailCurrentPrice"
                                class="current-price"
                            >
                                ${formatPrice(currentPrice)}
                            </span>

                            ${oldPrice > currentPrice ? `
                                <span
                                    id="detailOldPrice"
                                    class="old-price"
                                >
                                    ${formatPrice(oldPrice)}
                                </span>
                            ` : ""}

                        </div>


                        ${product.shortDescription ? `
                            <p class="product-detail-short-description">
                                ${escapeHTML(product.shortDescription)}
                            </p>
                        ` : ""}


                        ${sizesHTML}


                        <!-- QUANTITY -->

                        <div class="product-quantity-section mt-4">

                            <h6 class="fw-bold mb-3">
                                Quantity
                            </h6>

                            <div class="quantity-control">

                                <button
                                    type="button"
                                    id="decreaseQty"
                                    class="quantity-btn"
                                >
                                    <i class="fas fa-minus"></i>
                                </button>

                                <span
                                    id="productQuantity"
                                    class="quantity-number"
                                >
                                    1
                                </span>

                                <button
                                    type="button"
                                    id="increaseQty"
                                    class="quantity-btn"
                                >
                                    <i class="fas fa-plus"></i>
                                </button>

                            </div>

                        </div>


                        <!-- ACTION BUTTONS -->

                        <div class="product-detail-actions mt-4">

                            <button
                                type="button"
                                id="detailAddToCart"
                                class="btn btn-success product-detail-cart-btn"
                            >
                                <i class="fas fa-shopping-cart me-2"></i>
                                Add to Cart
                            </button>

                            <button
                                type="button"
                                id="detailWishlistAction"
                                class="btn btn-outline-success product-detail-wishlist-btn"
                            >
                                <i class="far fa-heart me-2"></i>
                                Wishlist
                            </button>

                        </div>


                        <!-- SERVICE FEATURES -->

                        <div class="product-service-features mt-4">

                            <div class="service-feature">

                                <i class="fas fa-truck"></i>

                                <div>
                                    <strong>Free Delivery</strong>
                                    <small>
                                        On orders above ₹499
                                    </small>
                                </div>

                            </div>

                            <div class="service-feature">

                                <i class="fas fa-shield-alt"></i>

                                <div>
                                    <strong>Quality Assured</strong>
                                    <small>
                                        100% premium quality
                                    </small>
                                </div>

                            </div>

                            <div class="service-feature">

                                <i class="fas fa-undo"></i>

                                <div>
                                    <strong>Easy Returns</strong>
                                    <small>
                                        Hassle-free returns
                                    </small>
                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>
        `;

        updateBreadcrumb();

        updateWishlistUI();

        setupSizeButtons();

        setupQuantityButtons();

        setupCartButton();

        setupWishlistButtons();
    }


    /* ---------------------------------------------------------
       SIZE BUTTONS
       --------------------------------------------------------- */

    function setupSizeButtons() {

        const buttons = document.querySelectorAll(
            ".size-option"
        );

        buttons.forEach(function (button) {

            button.addEventListener("click", function () {

                buttons.forEach(function (btn) {
                    btn.classList.remove("active");
                });

                button.classList.add("active");

                selectedSize = button.dataset.size;

                const price = Number(
                    button.dataset.price
                );

                const currentPriceElement =
                    document.getElementById(
                        "detailCurrentPrice"
                    );

                if (currentPriceElement) {
                    currentPriceElement.textContent =
                        formatPrice(price);
                }

                updateSelectedPrice();
            });
        });
    }


    /* ---------------------------------------------------------
       UPDATE PRICE
       --------------------------------------------------------- */

    function updateSelectedPrice() {

        const selected = getSelectedSizeObject();

        if (!selected) return;

        const price = getSizePrice(selected);

        const currentPriceElement =
            document.getElementById(
                "detailCurrentPrice"
            );

        if (currentPriceElement) {
            currentPriceElement.textContent =
                formatPrice(price);
        }
    }


    /* ---------------------------------------------------------
       QUANTITY
       --------------------------------------------------------- */

    function setupQuantityButtons() {

        const decreaseBtn =
            document.getElementById("decreaseQty");

        const increaseBtn =
            document.getElementById("increaseQty");

        const quantityElement =
            document.getElementById("productQuantity");


        if (decreaseBtn) {

            decreaseBtn.addEventListener(
                "click",
                function () {

                    if (selectedQuantity > 1) {
                        selectedQuantity--;

                        quantityElement.textContent =
                            selectedQuantity;
                    }

                }
            );
        }


        if (increaseBtn) {

            increaseBtn.addEventListener(
                "click",
                function () {

                    if (selectedQuantity < 20) {
                        selectedQuantity++;

                        quantityElement.textContent =
                            selectedQuantity;
                    }

                }
            );
        }
    }


    /* ---------------------------------------------------------
       SIZE-AWARE CART
       --------------------------------------------------------- */

    function addProductToCart() {

        const sizeObject =
            getSelectedSizeObject();

        const price = sizeObject
            ? getSizePrice(sizeObject)
            : Number(product.price);

        const weight = selectedSize ||
            product.weight ||
            "250g";

        const cartKey =
            `${product.id}-${weight}`;

        const existingItem =
            AppState.cart.find(function (item) {

                return item.cartKey === cartKey;

            });


        if (existingItem) {

            existingItem.quantity +=
                selectedQuantity;

        } else {

            AppState.cart.push({

                cartKey: cartKey,

                id: product.id,

                name: product.name,

                slug: product.slug,

                image: product.image,

                price: price,

                oldPrice: product.oldPrice,

                quantity: selectedQuantity,

                weight: weight,

                category: product.category

            });
        }


        localStorage.setItem(
            "dryfruit_cart",
            JSON.stringify(AppState.cart)
        );


        if (typeof updateCartCount === "function") {
            updateCartCount();
        }


        if (typeof showToast === "function") {

            showToast(
                `${product.name} added to cart!`,
                "success"
            );

        }


        const button =
            document.getElementById(
                "detailAddToCart"
            );

        if (button) {

            const originalHTML =
                button.innerHTML;

            button.innerHTML =
                `<i class="fas fa-check me-2"></i> Added`;

            button.classList.add("added");

            setTimeout(function () {

                button.innerHTML =
                    originalHTML;

                button.classList.remove("added");

            }, 1500);
        }
    }


    /* ---------------------------------------------------------
       CART BUTTON
       --------------------------------------------------------- */

    function setupCartButton() {

        const button =
            document.getElementById(
                "detailAddToCart"
            );

        if (!button) return;

        button.addEventListener(
            "click",
            addProductToCart
        );
    }


    /* ---------------------------------------------------------
       WISHLIST
       --------------------------------------------------------- */

    function isInWishlist() {

        return AppState.wishlist.some(
            function (id) {

                return String(id) ===
                    String(product.id);

            }
        );
    }


    function toggleProductWishlist() {

        const index =
            AppState.wishlist.findIndex(
                function (id) {

                    return String(id) ===
                        String(product.id);

                }
            );


        if (index === -1) {

            AppState.wishlist.push(
                product.id
            );

            showToast(
                "Added to wishlist ❤️",
                "success"
            );

        } else {

            AppState.wishlist.splice(
                index,
                1
            );

            showToast(
                "Removed from wishlist",
                "info"
            );
        }


        localStorage.setItem(
            "dryfruit_wishlist",
            JSON.stringify(
                AppState.wishlist
            )
        );


        updateWishlistUI();


        if (
            typeof updateWishlistCount ===
            "function"
        ) {
            updateWishlistCount();
        }
    }


    function updateWishlistUI() {

        const active =
            isInWishlist();


        const topButton =
            document.getElementById(
                "detailWishlistBtn"
            );

        const actionButton =
            document.getElementById(
                "detailWishlistAction"
            );


        if (topButton) {

            topButton.classList.toggle(
                "active",
                active
            );

            topButton.innerHTML = active
                ? '<i class="fas fa-heart"></i>'
                : '<i class="far fa-heart"></i>';
        }


        if (actionButton) {

            actionButton.classList.toggle(
                "active",
                active
            );

            actionButton.innerHTML = active
                ? '<i class="fas fa-heart me-2"></i>Remove Wishlist'
                : '<i class="far fa-heart me-2"></i>Wishlist';
        }
    }


    function setupWishlistButtons() {

        const topButton =
            document.getElementById(
                "detailWishlistBtn"
            );

        const actionButton =
            document.getElementById(
                "detailWishlistAction"
            );


        if (topButton) {

            topButton.addEventListener(
                "click",
                toggleProductWishlist
            );
        }


        if (actionButton) {

            actionButton.addEventListener(
                "click",
                toggleProductWishlist
            );
        }
    }


    /* ---------------------------------------------------------
       DESCRIPTION
       --------------------------------------------------------- */

    function renderDescription() {

        const description =
            document.getElementById(
                "productDescription"
            );

        if (!description) return;

        description.innerHTML = `
            <p>
                ${escapeHTML(
                    product.description ||
                    product.shortDescription ||
                    "Premium quality dry fruits carefully selected for freshness, taste and nutrition."
                )}
            </p>

            <p>
                Our dry fruits are packed hygienically to
                preserve their natural taste, crunch and
                freshness. Perfect for everyday snacking,
                gifting and special occasions.
            </p>
        `;
    }


    /* ---------------------------------------------------------
       FEATURES
       --------------------------------------------------------- */

    function renderFeatures() {

        const features =
            document.getElementById(
                "productFeatures"
            );

        if (!features) return;


        const productFeatures =
            Array.isArray(product.features)
                ? product.features
                : [
                    "Premium quality dry fruits",
                    "Fresh and hygienically packed",
                    "Rich in essential nutrients",
                    "Perfect for daily snacking",
                    "Suitable for gifting"
                ];


        features.innerHTML = `
            <ul class="product-feature-list">

                ${productFeatures.map(function (feature) {

                    return `
                        <li>
                            <i class="fas fa-check-circle"></i>
                            <span>
                                ${escapeHTML(feature)}
                            </span>
                        </li>
                    `;

                }).join("")}

            </ul>
        `;
    }


    /* ---------------------------------------------------------
       REVIEWS
       --------------------------------------------------------- */

    function renderReviews() {

        const reviewsContainer =
            document.getElementById(
                "productReviews"
            );

        if (!reviewsContainer) return;


        const rating =
            Number(product.rating || 0);

        const totalReviews =
            Number(product.reviews || 0);


        reviewsContainer.innerHTML = `

            <div class="review-summary">

                <div class="review-score">

                    <strong>
                        ${rating.toFixed(1)}
                    </strong>

                    <div class="review-stars">
                        ${createStars(rating)}
                    </div>

                    <small>
                        Based on ${totalReviews} reviews
                    </small>

                </div>


                <div class="review-summary-text">

                    <h5>
                        Customers love this product
                    </h5>

                    <p>
                        Freshness, taste and quality are
                        some of the most appreciated features
                        of this product.
                    </p>

                </div>

            </div>


            <div class="customer-review-list">

                <div class="customer-review">

                    <div class="customer-review-header">

                        <strong>
                            Rahul
                        </strong>

                        <span>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                        </span>

                    </div>

                    <p>
                        Excellent quality and very fresh.
                        Packaging was also very good.
                    </p>

                </div>


                <div class="customer-review">

                    <div class="customer-review-header">

                        <strong>
                            Priya
                        </strong>

                        <span>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="far fa-star"></i>
                        </span>

                    </div>

                    <p>
                        Good taste and value for money.
                        Will order again.
                    </p>

                </div>

            </div>
        `;
    }


    /* ---------------------------------------------------------
       RELATED PRODUCTS
       --------------------------------------------------------- */

    function renderRelatedProducts() {

        const container =
            document.getElementById(
                "relatedProducts"
            );

        if (!container) return;


        let related = [];


        if (
            typeof getProductsByCategory ===
            "function"
        ) {

            related =
                getProductsByCategory(
                    product.category
                ).filter(function (item) {

                    return String(item.id) !==
                        String(product.id);

                }).slice(0, 4);
        }


        if (related.length === 0) {

            related =
                DryFruitStore.products
                    .filter(function (item) {

                        return String(item.id) !==
                            String(product.id);

                    })
                    .slice(0, 4);
        }


        if (
            typeof createProductCard ===
            "function"
        ) {

            container.innerHTML =
                related.map(function (item) {

                    return createProductCard(item);

                }).join("");

        } else {

            container.innerHTML =
                related.map(function (item) {

                    return `
                        <div class="col-lg-3 col-md-6">

                            <div class="card h-100">

                                <img
                                    src="${escapeHTML(item.image)}"
                                    class="card-img-top"
                                    alt="${escapeHTML(item.name)}"
                                >

                                <div class="card-body">

                                    <h5>
                                        ${escapeHTML(item.name)}
                                    </h5>

                                    <strong>
                                        ${formatPrice(item.price)}
                                    </strong>

                                    <a
                                        href="product-details.html?id=${item.id}"
                                        class="btn btn-success w-100 mt-3"
                                    >
                                        View Product
                                    </a>

                                </div>

                            </div>

                        </div>
                    `;

                }).join("");
        }
    }


    /* ---------------------------------------------------------
       PRODUCT NOT FOUND
       --------------------------------------------------------- */

    function showProductNotFound() {

        productDetails.innerHTML = `

            <div class="product-not-found">

                <div class="empty-state">

                    <i class="fas fa-box-open"></i>

                    <h3>
                        Product Not Found
                    </h3>

                    <p>
                        Sorry, the product you are looking
                        for does not exist or has been removed.
                    </p>

                    <a
                        href="shop.html"
                        class="btn btn-success"
                    >
                        <i class="fas fa-store me-2"></i>
                        Continue Shopping
                    </a>

                </div>

            </div>
        `;
    }


    /* ---------------------------------------------------------
       INITIALIZE
       --------------------------------------------------------- */

    renderProduct();

    renderDescription();

    renderFeatures();

    renderReviews();

    renderRelatedProducts();


    /* ---------------------------------------------------------
       EXPOSE FOR DEBUGGING
       --------------------------------------------------------- */

    window.DryFruitProductDetails = {

        product: product,

        getSelectedSize: function () {
            return selectedSize;
        },

        getQuantity: function () {
            return selectedQuantity;
        },

        getPrice: function () {
            return getCurrentPrice();
        }

    };

});