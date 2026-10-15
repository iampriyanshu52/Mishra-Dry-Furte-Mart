/* =========================================================
   MISHRA DRY FRUIT MART
   SHOP PAGE JAVASCRIPT
   File: frontend/js/shop.js
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /*
       Check whether we are actually on shop page
    */

    const shopProducts =
        document.getElementById("shopProducts");

    if (!shopProducts) return;

    initShopPage();

});


/* =========================================================
   SHOP STATE
========================================================= */

const ShopState = {

    allProducts: [],

    filteredProducts: [],

    category: "all",

    maxPrice: 1000,

    rating: 0,

    sort: "default",

    currentPage: 1,

    productsPerPage: 8

};


/* =========================================================
   INITIALIZE SHOP
========================================================= */

function initShopPage() {

    /*
       Get all products
    */

    ShopState.allProducts =
        [...DryFruitStore.products];


    /*
       Read category from URL
    */

    readCategoryFromURL();


    /*
       Set price range according to products
    */

    setupPriceRange();


    /*
       Show category counts
    */

    updateCategoryCounts();


    /*
       Setup all filters
    */

    setupCategoryFilter();

    setupPriceFilter();

    setupRatingFilter();

    setupSorting();

    setupClearFilters();


    /*
       First product render
    */

    applyShopFilters();

}


/* =========================================================
   READ CATEGORY FROM URL
========================================================= */

function readCategoryFromURL() {

    const params =
        new URLSearchParams(
            window.location.search
        );

    const category =
        params.get("category");

    if (!category) return;


    const exists =
        ShopState.allProducts.some(
            product =>
                product.category === category
        );


    if (exists) {

        ShopState.category =
            category;


        const radio =
            document.querySelector(
                `input[name="category"][value="${category}"]`
            );


        if (radio) {
            radio.checked = true;
        }

    }

}


/* =========================================================
   PRICE RANGE
========================================================= */

function setupPriceRange() {

    if (!ShopState.allProducts.length) {
        return;
    }


    const prices =
        ShopState.allProducts.map(
            product =>
                Number(product.price)
        );


    const highestPrice =
        Math.ceil(
            Math.max(...prices) / 100
        ) * 100;


    ShopState.maxPrice =
        highestPrice;


    const priceRange =
        document.getElementById(
            "priceRange"
        );


    const maxPriceValue =
        document.getElementById(
            "maxPriceValue"
        );


    if (priceRange) {

        priceRange.max =
            highestPrice;

        priceRange.value =
            highestPrice;

    }


    if (maxPriceValue) {

        maxPriceValue.textContent =
            highestPrice;

    }


    const minPriceValue =
        document.getElementById(
            "minPriceValue"
        );


    if (minPriceValue) {

        minPriceValue.textContent =
            "0";

    }

}


/* =========================================================
   CATEGORY COUNTS
========================================================= */

function updateCategoryCounts() {

    const categories = [
        "all",
        "almonds",
        "cashew",
        "pista",
        "walnut",
        "raisins",
        "dates",
        "makhana",
        "mix"
    ];


    categories.forEach(category => {

        let count = 0;


        if (category === "all") {

            count =
                ShopState.allProducts.length;

        } else {

            count =
                ShopState.allProducts.filter(
                    product =>
                        product.category === category
                ).length;

        }


        const element =
            document.getElementById(
                `count-${category}`
            );


        if (element) {

            element.textContent =
                count;

        }

    });

}


/* =========================================================
   CATEGORY FILTER
========================================================= */

function setupCategoryFilter() {

    const radios =
        document.querySelectorAll(
            'input[name="category"]'
        );


    radios.forEach(radio => {

        radio.addEventListener(
            "change",
            () => {

                ShopState.category =
                    radio.value;

                ShopState.currentPage =
                    1;

                updateURL();

                applyShopFilters();

            }
        );

    });

}


/* =========================================================
   PRICE FILTER
========================================================= */

function setupPriceFilter() {

    const range =
        document.getElementById(
            "priceRange"
        );


    const maxValue =
        document.getElementById(
            "maxPriceValue"
        );


    if (!range) return;


    range.addEventListener(
        "input",
        () => {

            ShopState.maxPrice =
                Number(range.value);


            if (maxValue) {

                maxValue.textContent =
                    range.value;

            }

        }
    );


    const applyButton =
        document.getElementById(
            "applyPriceFilter"
        );


    if (applyButton) {

        applyButton.addEventListener(
            "click",
            () => {

                ShopState.currentPage =
                    1;

                applyShopFilters();

                showShopToast(
                    "Price filter applied.",
                    "success"
                );

            }
        );

    }

}


/* =========================================================
   RATING FILTER
========================================================= */

function setupRatingFilter() {

    const radios =
        document.querySelectorAll(
            'input[name="rating"]'
        );


    radios.forEach(radio => {

        radio.addEventListener(
            "change",
            () => {

                ShopState.rating =
                    Number(radio.value);

                ShopState.currentPage =
                    1;

                applyShopFilters();

            }
        );

    });

}


/* =========================================================
   SORTING
========================================================= */

function setupSorting() {

    const sortSelect =
        document.getElementById(
            "sortProducts"
        );


    if (!sortSelect) return;


    sortSelect.addEventListener(
        "change",
        () => {

            ShopState.sort =
                sortSelect.value;

            ShopState.currentPage =
                1;

            applyShopFilters();

        }
    );

}


/* =========================================================
   APPLY ALL FILTERS
========================================================= */

function applyShopFilters() {

    let products =
        [...ShopState.allProducts];


    /*
       CATEGORY
    */

    if (
        ShopState.category !==
        "all"
    ) {

        products =
            products.filter(
                product =>
                    product.category ===
                    ShopState.category
            );

    }


    /*
       PRICE
    */

    products =
        products.filter(
            product =>
                Number(product.price) <=
                ShopState.maxPrice
        );


    /*
       RATING
    */

    if (ShopState.rating > 0) {

        products =
            products.filter(
                product =>
                    Number(product.rating) >=
                    ShopState.rating
            );

    }


    /*
       SORTING
    */

    products =
        sortShopProducts(
            products,
            ShopState.sort
        );


    ShopState.filteredProducts =
        products;


    /*
       Make sure current page
       doesn't exceed total pages
    */

    const totalPages =
        Math.ceil(
            products.length /
            ShopState.productsPerPage
        );


    if (
        ShopState.currentPage >
        totalPages &&
        totalPages > 0
    ) {

        ShopState.currentPage =
            totalPages;

    }


    renderShopProducts();

    renderPagination();

    updateShopToolbar();

}


/* =========================================================
   SORT PRODUCTS
========================================================= */

function sortShopProducts(
    products,
    sort
) {

    switch (sort) {


        case "price-low":

            return products.sort(
                (a, b) =>
                    Number(a.price) -
                    Number(b.price)
            );


        case "price-high":

            return products.sort(
                (a, b) =>
                    Number(b.price) -
                    Number(a.price)
            );


        case "rating":

            return products.sort(
                (a, b) =>
                    Number(b.rating) -
                    Number(a.rating)
            );


        case "discount":

            return products.sort(
                (a, b) =>
                    Number(b.discount || 0) -
                    Number(a.discount || 0)
            );


        case "name":

            return products.sort(
                (a, b) =>
                    a.name.localeCompare(
                        b.name
                    )
            );


        default:

            return products;

    }

}


/* =========================================================
   RENDER PRODUCTS
========================================================= */

function renderShopProducts() {

    const container =
        document.getElementById(
            "shopProducts"
        );


    const emptyState =
        document.getElementById(
            "shopEmpty"
        );


    if (!container) return;


    /*
       No products
    */

    if (
        ShopState.filteredProducts.length ===
        0
    ) {

        container.innerHTML = "";

        if (emptyState) {

            emptyState.style.display =
                "block";

        }

        renderPagination();

        return;

    }


    if (emptyState) {

        emptyState.style.display =
            "none";

    }


    /*
       Calculate pagination
    */

    const startIndex =
        (
            ShopState.currentPage -
            1
        ) *
        ShopState.productsPerPage;


    const endIndex =
        startIndex +
        ShopState.productsPerPage;


    const products =
        ShopState.filteredProducts.slice(
            startIndex,
            endIndex
        );


    /*
       Create product cards
    */

    container.innerHTML =
        products
            .map(product =>
                createShopProductCard(product)
            )
            .join("");


    /*
       Refresh wishlist buttons
    */

    if (
        typeof updateWishlistButtons ===
        "function"
    ) {

        updateWishlistButtons();

    }

}


/* =========================================================
   PRODUCT CARD
========================================================= */

function createShopProductCard(product) {

    const isWishlisted =
        typeof AppState !== "undefined" &&
        AppState.wishlist
            .includes(product.id);


    const discount =
        calculateDiscount(product);


    return `

        <div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 mb-4">

            <div class="product-card">


                <!-- IMAGE -->

                <div class="product-image-wrapper">


                    ${
                        product.badge
                            ? `
                                <span class="product-badge">
                                    ${product.badge}
                                </span>
                              `
                            : ""
                    }


                    ${
                        discount > 0
                            ? `
                                <span class="product-discount">
                                    ${discount}% OFF
                                </span>
                              `
                            : ""
                    }


                    <!-- WISHLIST -->

                    <button
                        class="product-wishlist ${
                            isWishlisted
                                ? "active"
                                : ""
                        }"
                        data-wishlist-id="${product.id}"
                        aria-label="Wishlist"
                    >

                        <i class="${
                            isWishlisted
                                ? "fas"
                                : "far"
                        } fa-heart"></i>

                    </button>


                    <!-- PRODUCT IMAGE -->

                    <a
                        href="product-details.html?id=${product.id}"
                        class="product-image-link"
                    >

                        <img
                            src="${product.image}"
                            alt="${product.name}"
                            class="product-image"
                            loading="lazy"
                            onerror="this.src='https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=700&q=80'"
                        >

                    </a>

                </div>


                <!-- PRODUCT INFORMATION -->

                <div class="product-info">


                    <span class="product-category">

                        ${product.categoryName}

                    </span>


                    <h3 class="product-name">

                        <a
                            href="product-details.html?id=${product.id}"
                        >

                            ${product.name}

                        </a>

                    </h3>


                    <!-- RATING -->

                    <div class="product-rating">

                        <span class="stars">

                            ${
                                typeof generateStars ===
                                "function"
                                    ? generateStars(
                                        product.rating
                                    )
                                    : "★★★★★"
                            }

                        </span>

                        <span class="review-count">

                            (${product.reviews || 0})

                        </span>

                    </div>


                    <!-- PRICE -->

                    <div class="product-price-row">

                        <div class="product-price">

                            <span class="current-price">

                                ${
                                    typeof formatPrice ===
                                    "function"
                                        ? formatPrice(
                                            product.price
                                        )
                                        : "₹" +
                                          product.price
                                }

                            </span>


                            ${
                                product.oldPrice
                                    ? `
                                        <span class="old-price">

                                            ${
                                                typeof formatPrice ===
                                                "function"
                                                    ? formatPrice(
                                                        product.oldPrice
                                                    )
                                                    : "₹" +
                                                      product.oldPrice
                                            }

                                        </span>
                                      `
                                    : ""
                            }

                        </div>

                    </div>


                    <!-- ACTIONS -->

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
   CALCULATE DISCOUNT
========================================================= */

function calculateDiscount(product) {

    if (
        product.discount &&
        Number(product.discount) > 0
    ) {

        return Number(product.discount);

    }


    if (
        product.oldPrice &&
        product.price
    ) {

        return Math.round(
            (
                (
                    Number(product.oldPrice) -
                    Number(product.price)
                ) /
                Number(product.oldPrice)
            ) * 100
        );

    }


    return 0;

}


/* =========================================================
   UPDATE TOOLBAR
========================================================= */

function updateShopToolbar() {

    const count =
        document.getElementById(
            "showingCount"
        );


    if (count) {

        count.textContent =
            ShopState.filteredProducts.length;

    }


    const title =
        document.querySelector(
            ".shop-results-title"
        );


    if (!title) return;


    const categoryNames = {

        all: "All Products",

        almonds: "Almonds",

        cashew: "Cashews",

        pista: "Pistachios",

        walnut: "Walnuts",

        raisins: "Raisins",

        dates: "Dates",

        makhana: "Makhana",

        mix: "Dry Fruit Mix"

    };


    title.textContent =
        categoryNames[
            ShopState.category
        ] ||
        "All Products";

}


/* =========================================================
   PAGINATION
========================================================= */

function renderPagination() {

    const pagination =
        document.getElementById(
            "shopPagination"
        );


    if (!pagination) return;


    const totalProducts =
        ShopState.filteredProducts.length;


    const totalPages =
        Math.ceil(
            totalProducts /
            ShopState.productsPerPage
        );


    /*
       Hide pagination if only one page
    */

    if (totalPages <= 1) {

        pagination.innerHTML = "";

        return;

    }


    let html = "";


    /*
       Previous
    */

    html += `

        <button
            class="shop-page-btn"
            ${
                ShopState.currentPage === 1
                    ? "disabled"
                    : ""
            }
            data-page="${
                ShopState.currentPage - 1
            }"
        >

            <i class="fas fa-angle-left"></i>

        </button>

    `;


    /*
       Page numbers
    */

    for (
        let page = 1;
        page <= totalPages;
        page++
    ) {

        html += `

            <button
                class="shop-page-btn ${
                    page ===
                    ShopState.currentPage
                        ? "active"
                        : ""
                }"
                data-page="${page}"
            >

                ${page}

            </button>

        `;

    }


    /*
       Next
    */

    html += `

        <button
            class="shop-page-btn"
            ${
                ShopState.currentPage ===
                totalPages
                    ? "disabled"
                    : ""
            }
            data-page="${
                ShopState.currentPage + 1
            }"
        >

            <i class="fas fa-angle-right"></i>

        </button>

    `;


    pagination.innerHTML =
        html;


    /*
       Pagination click
    */

    pagination
        .querySelectorAll(
            "[data-page]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const page =
                        Number(
                            button.dataset.page
                        );


                    if (
                        page < 1 ||
                        page > totalPages
                    ) {
                        return;
                    }


                    ShopState.currentPage =
                        page;


                    renderShopProducts();

                    renderPagination();


                    /*
                       Scroll back to products
                    */

                    const productsSection =
                        document.getElementById(
                            "shopProducts"
                        );


                    if (productsSection) {

                        productsSection.scrollIntoView({
                            behavior: "smooth",
                            block: "start"
                        });

                    }

                }
            );

        });

}


/* =========================================================
   CLEAR FILTERS
========================================================= */

function setupClearFilters() {

    const clearButton =
        document.getElementById(
            "clearFilters"
        );


    const emptyClear =
        document.getElementById(
            "emptyClearFilters"
        );


    if (clearButton) {

        clearButton.addEventListener(
            "click",
            clearAllShopFilters
        );

    }


    if (emptyClear) {

        emptyClear.addEventListener(
            "click",
            clearAllShopFilters
        );

    }

}


/* =========================================================
   CLEAR ALL
========================================================= */

function clearAllShopFilters() {

    ShopState.category =
        "all";

    ShopState.rating =
        0;

    ShopState.sort =
        "default";

    ShopState.currentPage =
        1;


    /*
       Reset category
    */

    const allCategory =
        document.querySelector(
            'input[name="category"][value="all"]'
        );


    if (allCategory) {

        allCategory.checked =
            true;

    }


    /*
       Reset rating
    */

    const allRating =
        document.querySelector(
            'input[name="rating"][value="0"]'
        );


    if (allRating) {

        allRating.checked =
            true;

    }


    /*
       Reset price
    */

    const priceRange =
        document.getElementById(
            "priceRange"
        );


    const maxPriceValue =
        document.getElementById(
            "maxPriceValue"
        );


    if (priceRange) {

        const prices =
            ShopState.allProducts.map(
                product =>
                    Number(product.price)
            );


        const highest =
            Math.ceil(
                Math.max(...prices) /
                100
            ) * 100;


        priceRange.value =
            highest;


        ShopState.maxPrice =
            highest;


        if (maxPriceValue) {

            maxPriceValue.textContent =
                highest;

        }

    }


    /*
       Reset sorting
    */

    const sort =
        document.getElementById(
            "sortProducts"
        );


    if (sort) {

        sort.value =
            "default";

    }


    updateURL();

    applyShopFilters();


    showShopToast(
        "All filters cleared.",
        "info"
    );

}


/* =========================================================
   UPDATE URL
========================================================= */

function updateURL() {

    const url =
        new URL(
            window.location.href
        );


    if (
        ShopState.category ===
        "all"
    ) {

        url.searchParams.delete(
            "category"
        );

    } else {

        url.searchParams.set(
            "category",
            ShopState.category
        );

    }


    window.history.replaceState(
        {},
        "",
        url
    );

}


/* =========================================================
   SHOP TOAST
========================================================= */

function showShopToast(
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


    console.log(
        message
    );

}


/* =========================================================
   EXPOSE SHOP STATE
========================================================= */

window.DryFruitShop = {

    state: ShopState,

    applyFilters:
        applyShopFilters,

    clearFilters:
        clearAllShopFilters

};


/* =========================================================
   CONSOLE
========================================================= */

console.log(
    "Mishra Dry Fruit Mart Shop loaded successfully."
);