const express = require('express')
const cors = require('cors')
const swaggerUi = require('swagger-ui-express')
const swaggerSpec = require('../config/swagger') // Swagger configuration file
const routes = require('./routes') // Import routes

const app = express()

// Middleware
app.use(express.json()) // Parse JSON payloads

// CORS configuration
const corsOptions = {
    origin: 'http://localhost:5173', // Replace with your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
}
app.use(cors(corsOptions)) // Enable CORS with options

// Routes
app.use('/api', routes) // Use routes under "/api"

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec)) // Serve Swagger UI

module.exports = app
