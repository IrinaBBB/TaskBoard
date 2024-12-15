const request = require('supertest')
const mockFs = require('mock-fs')
const app = require('../src/app')

const TASKS_FILE = './src/tasks.json'

const initialTasks = [
    { id: 1, title: 'Task 1', description: 'Description 1' },
    { id: 2, title: 'Task 2', description: 'Description 2' },
]

beforeEach(() => {
    mockFs({
        [TASKS_FILE]: JSON.stringify(initialTasks), // Mock the tasks.json file
    })
})

afterEach(() => {
    mockFs.restore() // Restore the file system after each test
})

describe('GET /api/tasks', () => {
    it('should return all tasks', async () => {
        const response = await request(app).get('/api/tasks')

        expect(response.status).toBe(200) // Assert HTTP status 200
        expect(response.headers['content-type']).toMatch(/json/) // Validate JSON response
        expect(response.body).toEqual(initialTasks) // Assert the response matches the mock data
    })

    it('should return an empty array if no tasks exist', async () => {
        mockFs({
            [TASKS_FILE]: JSON.stringify([]), // Empty tasks file
        })

        const response = await request(app).get('/api/tasks')

        expect(response.status).toBe(200) // Assert HTTP status 200
        expect(response.body).toEqual([]) // Assert the response is an empty array
    })

    it('should return 404 for an unknown route', async () => {
        const response = await request(app).get('/api/unknown-route')

        expect(response.status).toBe(404) // Assert HTTP status 404
        expect(response.text).toBe('Not Found') // Validate the response message
    })
})

describe('GET /api/tasks/:id', () => {
    it('should return the task for a valid ID', async () => {
        const response = await request(app).get('/api/tasks/1')

        expect(response.status).toBe(200)
        expect(response.headers['content-type']).toMatch(/json/)
        expect(response.body).toEqual(initialTasks[0])
    })

    it('should return 404 if the task ID does not exist', async () => {
        const response = await request(app).get('/api/tasks/999')

        expect(response.status).toBe(404)
        expect(response.body).toEqual({ error: 'Task not found' })
    })

    it('should return 400 for invalid ID format', async () => {
        const response = await request(app).get('/api/tasks/invalid-id')

        expect(response.status).toBe(404) // Assert HTTP status 400
        expect(response.body).toEqual({ error: 'Task not found' })
    })
})

describe('POST /api/tasks', () => {
    it('should create a new task and return it', async () => {
        const newTask = { title: 'New Task', description: 'This is a new task.' }

        const response = await request(app)
            .post('/api/tasks')
            .set('Content-Type', 'application/json') // Explicitly set Content-Type
            .send(newTask)


        expect(response.status).toBe(201) // Assert HTTP status 201
        expect(response.headers['content-type']).toMatch(/json/) // Validate JSON response
        expect(response.body).toEqual(
            expect.objectContaining({
                id: expect.any(Number), // Ensure ID is auto-generated
                title: newTask.title,
                description: newTask.description,
            }),
        )

        // Validate that the task is added to the file
        const tasksAfter = JSON.parse(mockFs.readFileSync(TASKS_FILE, 'utf-8'))
        expect(tasksAfter).toContainEqual(response.body) // Verify the new task is in the file
    })

    it('should return 400 if title or description is missing', async () => {
        const incompleteTask = { title: 'New Task' } // Missing description

        const response = await request(app)
            .post('/api/tasks')
            .set('Content-Type', 'application/json') // Explicitly set Content-Type
            .send(incompleteTask)

        expect(response.status).toBe(400) // Assert HTTP status 400
        expect(response.body).toEqual({ error: 'Title and description are required.' }) // Assert the error message
    })

    it('should return 400 if request body is empty', async () => {
        const response = await request(app)
            .post('/api/tasks')
            .set('Content-Type', 'application/json') // Explicitly set Content-Type
            .send({}) // Empty body

        expect(response.status).toBe(400) // Assert HTTP status 400
        expect(response.body).toEqual({ error: 'Title and description are required.' }) // Assert the error message
    })
})

describe('PUT /tasks/:id', () => {
    it('should update the title and description of an existing task', async () => {
        const updatedTask = { title: 'Updated Task', description: 'Updated Description' }

        const response = await request(app)
            .put('/api/tasks/1')
            .set('Content-Type', 'application/json')
            .send(updatedTask)

        expect(response.status).toBe(200)
        expect(response.body).toEqual(
            expect.objectContaining({
                id: 1,
                title: updatedTask.title,
                description: updatedTask.description,
            }),
        )

        const tasksAfter = JSON.parse(mockFs.readFileSync(TASKS_FILE, 'utf-8'))
        expect(tasksAfter[0]).toEqual(response.body) // Verify the task is updated in the file
    })

    it('should update only the title if description is not provided', async () => {
        const updatedTask = { title: 'Updated Task Only' }

        const response = await request(app)
            .put('/api/tasks/2')
            .set('Content-Type', 'application/json')
            .send(updatedTask)

        expect(response.status).toBe(200)
        expect(response.body).toEqual(
            expect.objectContaining({
                id: 2,
                title: updatedTask.title,
                description: 'Description 2', // Original description remains unchanged
            }),
        )

        const tasksAfter = JSON.parse(mockFs.readFileSync(TASKS_FILE, 'utf-8'))
        expect(tasksAfter[1]).toEqual(response.body) // Verify the task is updated in the file
    })

    it('should return 404 if the task ID does not exist', async () => {
        const updatedTask = { title: 'Nonexistent Task', description: 'Description' }

        const response = await request(app)
            .put('/api/tasks/999')
            .set('Content-Type', 'application/json')
            .send(updatedTask)

        expect(response.status).toBe(404)
        expect(response.body).toEqual({ error: 'Task not found.' })
    })

    it('should return 400 if neither title nor description is provided', async () => {
        const response = await request(app)
            .put('/api/tasks/1')
            .set('Content-Type', 'application/json')
            .send({})

        expect(response.status).toBe(200) // Still returns 200 if nothing changes but valid ID
        expect(response.body).toEqual(
            expect.objectContaining({
                id: 1,
                title: 'Task 1',
                description: 'Description 1',
            }),
        )
    })

    it('should return 400 for invalid task ID format', async () => {
        const updatedTask = { title: 'Invalid ID', description: 'Invalid ID Description' }

        const response = await request(app)
            .put('/api/tasks/invalid-id')
            .set('Content-Type', 'application/json')
            .send(updatedTask)

        expect(response.status).toBe(404)
        expect(response.body).toEqual({ error: 'Task not found.' })
    })
})






