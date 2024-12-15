const express = require('express')
const fs = require('fs')
const router = express.Router()


router.get('/', (req, res) => {
    res.json({
        message: 'Welcome to the Task Manager API',
        version: '1.0.0',
        endpoints: {
            tasks: '/tasks',
            taskById: '/tasks/:id',
        },
    })
})

module.exports = router
