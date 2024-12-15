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


