const express = require('express')
const fs = require('fs')
const router = express.Router()

const TASKS_FILE = './src/tasks.json'

// Helper function to read and write tasks
const readTasks = () => JSON.parse(fs.readFileSync(TASKS_FILE, 'utf-8'))
const writeTasks = (tasks) => fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2))

// Health Check
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

/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       required:
 *         - id
 *         - title
 *         - description
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated ID of the task
 *         title:
 *           type: string
 *           description: The title of the task
 *         description:
 *           type: string
 *           description: The description of the task
 *       example:
 *         id: 1
 *         title: Task 1
 *         description: This is a task
 */

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Get all tasks
 *     tags: [Tasks]
 *     responses:
 *       200:
 *         description: The list of tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 */
router.get('/tasks', (req, res) => {
    const tasks = readTasks()
    res.json(tasks)
})


/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     summary: Get a task by ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The task ID
 *     responses:
 *       200:
 *         description: The task details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Task not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Task not found
 */
router.get('/tasks/:id', (req, res) => {
    const { id } = req.params

    const tasks = readTasks()
    const task = tasks.find((task) => task.id === parseInt(id, 10))

    if (!task) {
        return res.status(404).json({ error: 'Task not found' })
    }

    res.json(task)
})


// 404 handler for unknown routes
router.use((req, res) => {
    res.status(404).send('Not Found')
})

module.exports = router
