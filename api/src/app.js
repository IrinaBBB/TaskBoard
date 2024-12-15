const express = require('express')
const swaggerUi = require('swagger-ui-express')
const swaggerSpec = require('../config/swagger')
const bodyParser = require('body-parser')
const routes = require('./routes')

const app = express()
const PORT = 3000

// Middleware
app.use(bodyParser.json())
app.use('/api', routes)

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
    console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`)
})


module.exports = app