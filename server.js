const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./backend/routes/authRoutes');
const productRoutes = require('./backend/routes/productRoutes');
const orderRoutes = require('./backend/routes/orderRoutes');
const contactRoutes = require('./backend/routes/contactRoutes');
const paymentRoutes = require('./backend/routes/paymentRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and JSON body parser
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/payment', paymentRoutes);

// Serve static frontend assets and pages
app.use(express.static(__dirname));

// Fallback route to index.html for single page requests
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start Express Server
app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 Mishra Dry Fruit Mart Server is running!`);
    console.log(`📡 Local Web App: http://localhost:${PORT}`);
    console.log(`🔌 REST API Base: http://localhost:${PORT}/api`);
    console.log(`=======================================================`);
});
