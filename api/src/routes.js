const express = require('express')
const fs = require('fs')
const router = express.Router()

const TASKS_FILE = './src/tasks.json'

// Helper function to read and write tasks
const readTasks = () => JSON.parse(fs.readFileSync(TASKS_FILE, 'utf-8'))
const writeTasks = (tasks) => fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2))

//
router.get('/', (req, res) => {
    res.json({
        message: 'Welcome to the Task Board API',
        version: '1.0.0',
        endpoints: {
            tasks: '/tasks',
            taskById: '/tasks/:id',
        },
    })
})

// Get All Tasks
router.get('/tasks', (req, res) => {
    const tasks = readTasks()
    res.json(tasks)
})

// 404 handler for unknown routes
router.use((req, res) => {
    res.status(404).send('Not Found')
})

module.exports = router
