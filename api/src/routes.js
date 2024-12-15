const express = require('express')
const fs = require('fs')
const router = express.Router()

const TASKS_FILE = './src/tasks.json'

// Helper function to read and write tasks
const readTasks = () => {
    try {
        return JSON.parse(fs.readFileSync(TASKS_FILE, 'utf-8'))
    } catch (error) {
        console.error('Error reading tasks file:', error)
        return []
    }
}
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

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the task
 *               description:
 *                 type: string
 *                 description: The description of the task
 *             example:
 *               title: New Task
 *               description: This is a new task.
 *     responses:
 *       201:
 *         description: Task successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Invalid input, title and description are required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Title and description are required.
 */
router.post('/tasks', (req, res) => {
    const { title, description } = req.body


    if (!title || !description) {
        return res.status(400).json({ error: 'Title and description are required.' })
    }

    const tasks = readTasks()
    const newTask = {
        id: tasks.length ? tasks[tasks.length - 1].id + 1 : 1,
        title,
        description,
    }
    tasks.push(newTask)
    writeTasks(tasks)

    res.status(201).json(newTask)
})


/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     summary: Update a task by ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The task ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The new title of the task
 *               description:
 *                 type: string
 *                 description: The new description of the task
 *             example:
 *               title: Updated Task Title
 *               description: Updated Task Description
 *     responses:
 *       200:
 *         description: The updated task
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
 *                   example: Task not found.
 *       400:
 *         description: Invalid request body
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid request body.
 */

router.put('/tasks/:id', (req, res) => {
    const { id } = req.params
    const { title, description } = req.body

    const tasks = readTasks()
    const taskIndex = tasks.findIndex((task) => task.id === parseInt(id, 10))

    if (taskIndex === -1) {
        return res.status(404).json({ error: 'Task not found.' })
    }

    if (title) tasks[taskIndex].title = title
    if (description) tasks[taskIndex].description = description

    writeTasks(tasks)
    res.json(tasks[taskIndex])
})


// 404 handler for unknown routes
router.use((req, res) => {
    res.status(404).send('Not Found')
})

module.exports = router
