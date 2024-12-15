const express = require('express')
const swaggerUi = require('swagger-ui-express')
const swaggerSpec = require('../config/swagger')
const routes = require('./routes')

const app = express()

// Middleware
app.use(express.json())
app.use('/api', routes)

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

module.exports = app
