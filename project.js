/* =========================================================
   MISHRA MISHRA DRY FRUIT MART
   PRODUCT DATABASE
   ========================================================= */

const products = [

    /* =====================================================
       ALMONDS
    ===================================================== */

    {
        id: 1,
        name: "Premium California Almonds",
        slug: "premium-california-almonds",
        category: "almonds",
        categoryName: "Almonds",

        price: 249,
        oldPrice: 299,
        discount: 17,

        weight: "250g",

        rating: 4.8,
        reviews: 324,

        badge: "BEST SELLER",

        image:
            "https://images.unsplash.com/photo-1508061253366-f7da158b6d5a?auto=format&fit=crop&w=800&q=80",

        description:
            "Premium California almonds with a naturally crunchy texture and delicious taste. Perfect for daily snacking and healthy living.",

        shortDescription:
            "Crunchy premium California almonds.",

        features: [
            "Premium California quality",
            "Rich in protein",
            "Good source of Vitamin E",
            "Freshly packed",
            "No artificial additives"
        ],

        sizes: [
            {
                weight: "250g",
                price: 249
            },
            {
                weight: "500g",
                price: 469
            },
            {
                weight: "1kg",
                price: 899
            }
        ]
    },


    {
        id: 2,
        name: "Mamra Almonds",
        slug: "mamra-almonds",
        category: "almonds",
        categoryName: "Almonds",

        price: 449,
        oldPrice: 529,
        discount: 15,

        weight: "250g",

        rating: 4.9,
        reviews: 187,

        badge: "PREMIUM",

        image:
            "https://images.unsplash.com/photo-1608797178974-15b35a64ede9?auto=format&fit=crop&w=800&q=80",

        description:
            "Premium Mamra almonds known for their rich taste, natural oils and excellent nutritional value.",

        shortDescription:
            "Premium natural Mamra almonds.",

        features: [
            "Premium Mamra variety",
            "Naturally rich in oil",
            "High nutritional value",
            "Fresh and crunchy",
            "Carefully selected"
        ],

        sizes: [
            {
                weight: "250g",
                price: 449
            },
            {
                weight: "500g",
                price: 849
            },
            {
                weight: "1kg",
                price: 1599
            }
        ]
    },


    {
        id: 3,
        name: "California Almonds Value Pack",
        slug: "california-almonds-value-pack",
        category: "almonds",
        categoryName: "Almonds",

        price: 299,
        oldPrice: 349,
        discount: 14,

        weight: "500g",

        rating: 4.7,
        reviews: 241,

        badge: "VALUE PACK",

        image:
            "https://images.unsplash.com/photo-1574570062769-5e6e8c1e7f6b?auto=format&fit=crop&w=800&q=80",

        description:
            "A value pack of crunchy California almonds for families and regular snackers.",

        shortDescription:
            "Affordable family-size almond pack.",

        features: [
            "Family pack",
            "Crunchy texture",
            "Rich in nutrients",
            "Fresh packaging",
            "Great value"
        ],

        sizes: [
            {
                weight: "500g",
                price: 299
            },
            {
                weight: "1kg",
                price: 569
            }
        ]
    },


    /* =====================================================
       CASHEWS
    ===================================================== */

    {
        id: 4,
        name: "Premium Cashew Kaju",
        slug: "premium-cashew-kaju",
        category: "cashew",
        categoryName: "Cashews",

        price: 349,
        oldPrice: 419,
        discount: 17,

        weight: "250g",

        rating: 4.9,
        reviews: 512,

        badge: "BEST SELLER",

        image:
            "https://images.unsplash.com/photo-1606923829579-0cb981a83e2e?auto=format&fit=crop&w=800&q=80",

        description:
            "Premium whole cashews with a creamy texture and naturally sweet taste. Perfect for snacking, desserts and festive occasions.",

        shortDescription:
            "Creamy, crunchy premium whole cashews.",

        features: [
            "Premium whole cashews",
            "Naturally creamy",
            "Rich in healthy fats",
            "Freshly packed",
            "Ideal for snacking"
        ],

        sizes: [
            {
                weight: "250g",
                price: 349
            },
            {
                weight: "500g",
                price: 669
            },
            {
                weight: "1kg",
                price: 1299
            }
        ]
    },


    {
        id: 5,
        name: "W320 Premium Cashews",
        slug: "w320-premium-cashews",
        category: "cashew",
        categoryName: "Cashews",

        price: 399,
        oldPrice: 469,
        discount: 15,

        weight: "250g",

        rating: 4.8,
        reviews: 286,

        badge: "PREMIUM",

        image:
            "https://images.unsplash.com/photo-1574570062769-5e6e8c1e7f6b?auto=format&fit=crop&w=800&q=80",

        description:
            "Premium W320 grade cashews selected for their beautiful whole shape, creamy taste and crunch.",

        shortDescription:
            "Premium W320 grade cashews.",

        features: [
            "W320 grade",
            "Whole cashews",
            "Creamy taste",
            "Crunchy texture",
            "Premium selection"
        ],

        sizes: [
            {
                weight: "250g",
                price: 399
            },
            {
                weight: "500g",
                price: 769
            },
            {
                weight: "1kg",
                price: 1499
            }
        ]
    },


    {
        id: 6,
        name: "Roasted Salted Cashews",
        slug: "roasted-salted-cashews",
        category: "cashew",
        categoryName: "Cashews",

        price: 329,
        oldPrice: 379,
        discount: 13,

        weight: "250g",

        rating: 4.7,
        reviews: 193,

        badge: "POPULAR",

        image:
            "https://images.unsplash.com/photo-1599599810694-b5ac0f4e7b8c?auto=format&fit=crop&w=800&q=80",

        description:
            "Crunchy roasted cashews lightly seasoned with salt for a delicious anytime snack.",

        shortDescription:
            "Crispy roasted salted cashews.",

        features: [
            "Slow roasted",
            "Lightly salted",
            "Crunchy",
            "Ready to eat",
            "Perfect snack"
        ],

        sizes: [
            {
                weight: "250g",
                price: 329
            },
            {
                weight: "500g",
                price: 629
            }
        ]
    },


    /* =====================================================
       PISTA
    ===================================================== */

    {
        id: 7,
        name: "Premium Pista",
        slug: "premium-pista",
        category: "pista",
        categoryName: "Pistachios",

        price: 399,
        oldPrice: 479,
        discount: 17,

        weight: "250g",

        rating: 4.8,
        reviews: 301,

        badge: "BEST SELLER",

        image:
            "https://images.unsplash.com/photo-1599599810694-b5ac0f4e7b8c?auto=format&fit=crop&w=800&q=80",

        description:
            "Premium pistachios with a satisfying crunch and naturally delicious flavour.",

        shortDescription:
            "Crunchy premium pistachios.",

        features: [
            "Premium quality",
            "Naturally crunchy",
            "Rich in antioxidants",
            "Freshly packed",
            "Delicious taste"
        ],

        sizes: [
            {
                weight: "250g",
                price: 399
            },
            {
                weight: "500g",
                price: 769
            },
            {
                weight: "1kg",
                price: 1499
            }
        ]
    },


    {
        id: 8,
        name: "Roasted Salted Pista",
        slug: "roasted-salted-pista",
        category: "pista",
        categoryName: "Pistachios",

        price: 429,
        oldPrice: 499,
        discount: 14,

        weight: "250g",

        rating: 4.7,
        reviews: 165,

        badge: "POPULAR",

        image:
            "https://images.unsplash.com/photo-1621939514649-280e2aa8c6b8?auto=format&fit=crop&w=800&q=80",

        description:
            "Delicious roasted pistachios with a light salt coating for an irresistible snack.",

        shortDescription:
            "Roasted and lightly salted pista.",

        features: [
            "Roasted fresh",
            "Lightly salted",
            "Crunchy",
            "Premium quality",
            "Ready to eat"
        ],

        sizes: [
            {
                weight: "250g",
                price: 429
            },
            {
                weight: "500g",
                price: 829
            }
        ]
    },


    /* =====================================================
       WALNUTS
    ===================================================== */

    {
        id: 9,
        name: "Premium Kashmiri Walnuts",
        slug: "premium-kashmiri-walnuts",
        category: "walnut",
        categoryName: "Walnuts",

        price: 379,
        oldPrice: 449,
        discount: 16,

        weight: "250g",

        rating: 4.8,
        reviews: 218,

        badge: "PREMIUM",

        image:
            "https://images.unsplash.com/photo-1543158181-e6f9f6712055?auto=format&fit=crop&w=800&q=80",

        description:
            "Premium Kashmiri walnuts with a rich flavour and crunchy texture.",

        shortDescription:
            "Premium Kashmiri walnuts.",

        features: [
            "Kashmiri origin",
            "Rich natural flavour",
            "Crunchy texture",
            "Nutrient rich",
            "Fresh packaging"
        ],

        sizes: [
            {
                weight: "250g",
                price: 379
            },
            {
                weight: "500g",
                price: 729
            },
            {
                weight: "1kg",
                price: 1399
            }
        ]
    },


    {
        id: 10,
        name: "Walnut Kernels",
        slug: "walnut-kernels",
        category: "walnut",
        categoryName: "Walnuts",

        price: 429,
        oldPrice: 499,
        discount: 14,

        weight: "250g",

        rating: 4.7,
        reviews: 147,

        badge: "POPULAR",

        image:
            "https://images.unsplash.com/photo-1605196560544-1f3e3e6b1e36?auto=format&fit=crop&w=800&q=80",

        description:
            "Ready-to-eat walnut kernels, carefully selected and packed for maximum freshness.",

        shortDescription:
            "Ready-to-eat walnut kernels.",

        features: [
            "Premium kernels",
            "Ready to eat",
            "Rich in nutrients",
            "Freshly packed",
            "Easy to use"
        ],

        sizes: [
            {
                weight: "250g",
                price: 429
            },
            {
                weight: "500g",
                price: 829
            }
        ]
    },


    /* =====================================================
       RAISINS
    ===================================================== */

    {
        id: 11,
        name: "Golden Kishmish",
        slug: "golden-kishmish",
        category: "raisins",
        categoryName: "Raisins",

        price: 149,
        oldPrice: 189,
        discount: 21,

        weight: "250g",

        rating: 4.8,
        reviews: 378,

        badge: "BEST VALUE",

        image:
            "https://images.unsplash.com/photo-1599909533602-8f4c8d1e5d9e?auto=format&fit=crop&w=800&q=80",

        description:
            "Sweet and juicy golden raisins, perfect for snacking, baking and desserts.",

        shortDescription:
            "Sweet and juicy golden raisins.",

        features: [
            "Naturally sweet",
            "Soft and juicy",
            "No added sugar",
            "Perfect for desserts",
            "Fresh packaging"
        ],

        sizes: [
            {
                weight: "250g",
                price: 149
            },
            {
                weight: "500g",
                price: 279
            },
            {
                weight: "1kg",
                price: 529
            }
        ]
    },


    {
        id: 12,
        name: "Black Raisins",
        slug: "black-raisins",
        category: "raisins",
        categoryName: "Raisins",

        price: 179,
        oldPrice: 219,
        discount: 18,

        weight: "250g",

        rating: 4.7,
        reviews: 229,

        badge: "POPULAR",

        image:
            "https://images.unsplash.com/photo-1599909533602-8f4c8d1e5d9e?auto=format&fit=crop&w=800&q=80",

        description:
            "Naturally sweet black raisins with a soft texture and rich flavour.",

        shortDescription:
            "Naturally sweet black raisins.",

        features: [
            "Naturally sweet",
            "Soft texture",
            "Rich flavour",
            "No artificial colours",
            "Freshly packed"
        ],

        sizes: [
            {
                weight: "250g",
                price: 179
            },
            {
                weight: "500g",
                price: 339
            },
            {
                weight: "1kg",
                price: 649
            }
        ]
    },


    /* =====================================================
       ANJEER
    ===================================================== */

    {
        id: 13,
        name: "Premium Anjeer",
        slug: "premium-anjeer",
        category: "anjeer",
        categoryName: "Anjeer",

        price: 449,
        oldPrice: 529,
        discount: 15,

        weight: "250g",

        rating: 4.8,
        reviews: 176,

        badge: "PREMIUM",

        image:
            "https://images.unsplash.com/photo-1601379760883-1bb497c558f5?auto=format&fit=crop&w=800&q=80",

        description:
            "Premium dried figs with a naturally sweet taste and chewy texture.",

        shortDescription:
            "Naturally sweet premium dried figs.",

        features: [
            "Premium dried figs",
            "Naturally sweet",
            "Soft chewy texture",
            "Nutrient rich",
            "Carefully selected"
        ],

        sizes: [
            {
                weight: "250g",
                price: 449
            },
            {
                weight: "500g",
                price: 859
            },
            {
                weight: "1kg",
                price: 1699
            }
        ]
    },


    /* =====================================================
       DATES
    ===================================================== */

    {
        id: 14,
        name: "Premium Seedless Dates",
        slug: "premium-seedless-dates",
        category: "dates",
        categoryName: "Dates",

        price: 199,
        oldPrice: 249,
        discount: 20,

        weight: "500g",

        rating: 4.9,
        reviews: 421,

        badge: "BEST SELLER",

        image:
            "https://images.unsplash.com/photo-1596591868231-05e1d4f7c7d8?auto=format&fit=crop&w=800&q=80",

        description:
            "Soft, naturally sweet and delicious seedless dates. Perfect for daily snacking.",

        shortDescription:
            "Soft and naturally sweet dates.",

        features: [
            "Seedless",
            "Naturally sweet",
            "Soft texture",
            "No added sugar",
            "Ready to eat"
        ],

        sizes: [
            {
                weight: "500g",
                price: 199
            },
            {
                weight: "1kg",
                price: 379
            }
        ]
    },


    /* =====================================================
       MAKHANA
    ===================================================== */

    {
        id: 15,
        name: "Premium Makhana",
        slug: "premium-makhana",
        category: "makhana",
        categoryName: "Makhana",

        price: 229,
        oldPrice: 279,
        discount: 18,

        weight: "250g",

        rating: 4.8,
        reviews: 298,

        badge: "HEALTHY",

        image:
            "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80",

        description:
            "Light and crunchy premium makhana, perfect for guilt-free snacking.",

        shortDescription:
            "Light, crunchy and healthy makhana.",

        features: [
            "Premium quality",
            "Light and crunchy",
            "Healthy snack",
            "Low oil",
            "Freshly packed"
        ],

        sizes: [
            {
                weight: "250g",
                price: 229
            },
            {
                weight: "500g",
                price: 439
            },
            {
                weight: "1kg",
                price: 849
            }
        ]
    },


    {
        id: 16,
        name: "Roasted Masala Makhana",
        slug: "roasted-masala-makhana",
        category: "makhana",
        categoryName: "Makhana",

        price: 249,
        oldPrice: 299,
        discount: 17,

        weight: "250g",

        rating: 4.7,
        reviews: 194,

        badge: "NEW",

        image:
            "https://images.unsplash.com/photo-1627662168223-7df99068099a?auto=format&fit=crop&w=800&q=80",

        description:
            "Crunchy roasted makhana with a delicious masala flavour.",

        shortDescription:
            "Crunchy roasted masala makhana.",

        features: [
            "Roasted",
            "Flavourful masala",
            "Crunchy",
            "Light snack",
            "Freshly packed"
        ],

        sizes: [
            {
                weight: "250g",
                price: 249
            },
            {
                weight: "500g",
                price: 479
            }
        ]
    },


    /* =====================================================
       DRY FRUIT MIX
    ===================================================== */

    {
        id: 17,
        name: "Premium Dry Fruit Mix",
        slug: "premium-dry-fruit-mix",
        category: "mix",
        categoryName: "Dry Fruit Mix",

        price: 499,
        oldPrice: 599,
        discount: 17,

        weight: "500g",

        rating: 4.9,
        reviews: 634,

        badge: "BEST SELLER",

        image:
            "https://images.unsplash.com/photo-1599599810694-b5ac0f4e7b8c?auto=format&fit=crop&w=800&q=80",

        description:
            "A delicious premium mix of almonds, cashews, pistachios, raisins and walnuts.",

        shortDescription:
            "Premium mix of your favourite dry fruits.",

        features: [
            "Almonds",
            "Cashews",
            "Pistachios",
            "Raisins",
            "Walnuts"
        ],

        sizes: [
            {
                weight: "250g",
                price: 269
            },
            {
                weight: "500g",
                price: 499
            },
            {
                weight: "1kg",
                price: 949
            }
        ]
    },


    {
        id: 18,
        name: "Royal Dry Fruit Gift Box",
        slug: "royal-dry-fruit-gift-box",
        category: "mix",
        categoryName: "Dry Fruit Mix",

        price: 799,
        oldPrice: 999,
        discount: 20,

        weight: "1kg",

        rating: 4.9,
        reviews: 382,

        badge: "GIFT SPECIAL",

        image:
            "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80",

        description:
            "A premium gift box containing a delicious assortment of hand-picked dry fruits.",

        shortDescription:
            "Premium dry fruit gift box.",

        features: [
            "Premium gift packaging",
            "Almonds",
            "Cashews",
            "Pistachios",
            "Walnuts",
            "Raisins"
        ],

        sizes: [
            {
                weight: "500g",
                price: 449
            },
            {
                weight: "1kg",
                price: 799
            },
            {
                weight: "2kg",
                price: 1499
            }
        ]
    },


    /* =====================================================
       COMBO PACKS
    ===================================================== */

    {
        id: 19,
        name: "Healthy Daily Snack Combo",
        slug: "healthy-daily-snack-combo",
        category: "mix",
        categoryName: "Combo",

        price: 599,
        oldPrice: 749,
        discount: 20,

        weight: "750g",

        rating: 4.8,
        reviews: 213,

        badge: "COMBO",

        image:
            "https://images.unsplash.com/photo-1599599810694-b5ac0f4e7b8c?auto=format&fit=crop&w=800&q=80",

        description:
            "A balanced everyday combo featuring almonds, cashews, raisins and pistachios.",

        shortDescription:
            "Healthy everyday dry fruit combo.",

        features: [
            "Almonds",
            "Cashews",
            "Raisins",
            "Pistachios",
            "Great value"
        ],

        sizes: [
            {
                weight: "750g",
                price: 599
            },
            {
                weight: "1.5kg",
                price: 1149
            }
        ]
    },


    {
        id: 20,
        name: "Festive Dry Fruit Combo",
        slug: "festive-dry-fruit-combo",
        category: "mix",
        categoryName: "Combo",

        price: 899,
        oldPrice: 1099,
        discount: 18,

        weight: "1kg",

        rating: 4.9,
        reviews: 267,

        badge: "FESTIVE",

        image:
            "https://images.unsplash.com/photo-1601379760883-1bb497c558f5?auto=format&fit=crop&w=800&q=80",

        description:
            "A luxurious festive assortment of premium dry fruits, ideal for gifting and celebrations.",

        shortDescription:
            "Premium festive dry fruit collection.",

        features: [
            "Premium almonds",
            "Premium cashews",
            "Pistachios",
            "Walnuts",
            "Anjeer",
            "Gift-ready packaging"
        ],

        sizes: [
            {
                weight: "1kg",
                price: 899
            },
            {
                weight: "2kg",
                price: 1699
            }
        ]
    }

];


/* =========================================================
   PRODUCT HELPER FUNCTIONS
   ========================================================= */


/**
 * Get product by ID
 */
function getProductById(id) {

    return products.find(
        product => product.id === Number(id)
    );

}


/**
 * Get product by slug
 */
function getProductBySlug(slug) {

    return products.find(
        product => product.slug === slug
    );

}


/**
 * Get products by category
 */
function getProductsByCategory(category) {

    if (!category || category === "all") {
        return products;
    }

    return products.filter(
        product => product.category === category
    );

}


/**
 * Search products
 */
function searchProducts(searchTerm) {

    if (!searchTerm) {
        return products;
    }

    const term = searchTerm
        .toLowerCase()
        .trim();

    return products.filter(product => {

        return (
            product.name.toLowerCase().includes(term) ||
            product.categoryName.toLowerCase().includes(term) ||
            product.description.toLowerCase().includes(term) ||
            product.shortDescription.toLowerCase().includes(term)
        );

    });

}


/**
 * Get products sorted by price
 */
function sortProductsByPrice(productsList, order = "low") {

    return [...productsList].sort((a, b) => {

        if (order === "high") {
            return b.price - a.price;
        }

        return a.price - b.price;

    });

}


/**
 * Get products sorted by rating
 */
function sortProductsByRating(productsList) {

    return [...productsList].sort(
        (a, b) => b.rating - a.rating
    );

}


/**
 * Get best selling products
 */
function getBestSellingProducts(limit = 8) {

    return [...products]
        .sort((a, b) => b.reviews - a.reviews)
        .slice(0, limit);

}


/**
 * Get discounted products
 */
function getDiscountedProducts(limit = 8) {

    return [...products]
        .filter(product => product.discount > 0)
        .sort((a, b) => b.discount - a.discount)
        .slice(0, limit);

}


/**
 * Get featured products
 */
function getFeaturedProducts(limit = 8) {

    const featuredIds = [
        1,
        4,
        7,
        9,
        11,
        14,
        15,
        17
    ];

    return featuredIds
        .map(id => getProductById(id))
        .filter(Boolean)
        .slice(0, limit);

}


/* =========================================================
   CURRENCY FORMATTER
   ========================================================= */

function formatPrice(price) {

    return new Intl.NumberFormat(
        "en-IN",
        {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0
        }
    ).format(price);

}


/**
 * Example:
 *
 * formatPrice(499)
 *
 * Output:
 * ₹499
 */


/* =========================================================
   PRODUCT COUNT
   ========================================================= */

function getProductCount() {

    return products.length;

}


/* =========================================================
   CATEGORY LIST
   ========================================================= */

const categories = [

    {
        id: "almonds",
        name: "Almonds",
        icon: "fa-seedling"
    },

    {
        id: "cashew",
        name: "Cashews",
        icon: "fa-leaf"
    },

    {
        id: "pista",
        name: "Pistachios",
        icon: "fa-circle"
    },

    {
        id: "walnut",
        name: "Walnuts",
        icon: "fa-tree"
    },

    {
        id: "raisins",
        name: "Raisins",
        icon: "fa-grapes"
    },

    {
        id: "anjeer",
        name: "Anjeer",
        icon: "fa-cookie-bite"
    },

    {
        id: "dates",
        name: "Dates",
        icon: "fa-leaf"
    },

    {
        id: "makhana",
        name: "Makhana",
        icon: "fa-bowl-food"
    },

    {
        id: "mix",
        name: "Dry Fruit Mix",
        icon: "fa-box-open"
    }

];


/* =========================================================
   GLOBAL EXPORT
   ========================================================= */

window.DryFruitStore = {

    products,

    categories,

    getProductById,

    getProductBySlug,

    getProductsByCategory,

    searchProducts,

    sortProductsByPrice,

    sortProductsByRating,

    getBestSellingProducts,

    getDiscountedProducts,

    getFeaturedProducts,

    formatPrice,

    getProductCount

};