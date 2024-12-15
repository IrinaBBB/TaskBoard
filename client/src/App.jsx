import React, { useState, useEffect } from 'react'

function App() {
    const [tasks, setTasks] = useState([]) // State to store tasks
    const [loading, setLoading] = useState(true) // State to show loading
    const [error, setError] = useState(null) // State to handle errors
    const [isModalOpen, setIsModalOpen] = useState(false) // State to manage modal visibility
    const [newTask, setNewTask] = useState({ title: '', description: '' }) // State for new task

    // Fetch tasks from API
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/tasks') // Replace with your API endpoint
                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`)
                }
                const data = await response.json()
                setTasks(data) // Update tasks state
            } catch (err) {
                setError(err.message) // Handle errors
            } finally {
                setLoading(false) // Stop loading
            }
        }

        fetchTasks()
    }, []) // Empty dependency array means it runs once on mount

    // Delete task by ID
    const deleteTask = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/api/tasks/${id}`, {
                method: 'DELETE',
            })
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`)
            }
            // Update tasks state to remove the deleted task
            setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id))
        } catch (err) {
            setError(err.message) // Handle errors
        }
    }

    // Add a new task
    const addTask = async () => {
        if (!newTask.title || !newTask.description) {
            setError('Title and description are required.')
            return
        }

        try {
            const response = await fetch('http://localhost:3000/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTask),
            })
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`)
            }
            const task = await response.json()
            setTasks((prevTasks) => [...prevTasks, task]) // Add new task to state
            setIsModalOpen(false) // Close modal
            setNewTask({ title: '', description: '' }) // Reset input fields
            setError(null) // Clear errors
        } catch (err) {
            setError(err.message) // Handle errors
        }
    }

    return (
        <div
            className='min-h-screen bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center text-white'>
            {/* Add Task Button */}
            <div
                className='bg-yellow-400 flex justify-center items-center rounded-full w-16 h-16 absolute right-[28px] bottom-[28px] hover:scale-110 hover:cursor-pointer transition shadow-lg text-center my-auto'
                onClick={() => setIsModalOpen(true)}
            >
                <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 512 512'
                    fill='currentColor'
                    className='w-10 h-10 cursor-pointer transition-transform transform'
                >
                    <path
                        d='m467 211h-166v-166c0-24.853-20.147-45-45-45s-45 20.147-45 45v166h-166c-24.853 0-45 20.147-45 45s20.147 45 45 45h166v166c0 24.853 20.147 45 45 45s45-20.147 45-45v-166h166c24.853 0 45-20.147 45-45s-20.147-45-45-45z'></path>
                </svg>
            </div>

            {/* Task List */}
            <div className='w-11/12 sm:w-3/4 lg:w-2/3 bg-gray-800 rounded-xl shadow-lg overflow-hidden'>
                <header className='bg-gradient-to-r from-green-300 to-green-400 p-6 flex items-center justify-center'>
                    <h1 className='text-3xl text-center uppercase font-light'>Task Board</h1>
                </header>
                <div className='p-6 space-y-4'>
                    {loading && (
                        <div className='flex justify-center items-center'>
                            <p className='text-lg font-medium animate-pulse text-gray-400'>
                                Loading...
                            </p>
                        </div>
                    )}
                    {error && (
                        <div className='bg-red-600 text-white p-4 rounded-lg text-center'>
                            <p className='text-lg font-semibold'>{error}</p>
                        </div>
                    )}
                    <ul className='space-y-4'>
                        {tasks.map((task) => (
                            <li
                                key={task.id}
                                className='bg-gray-700 hover:bg-gray-600 transition-colors p-4 rounded-lg shadow-sm'
                            >
                                <div className='flex justify-between items-center'>
                                    <div>
                                        <h2 className='text-xl font-semibold text-green-400'>
                                            {task.title}
                                        </h2>
                                        <p className='text-gray-300'>{task.description}</p>
                                    </div>
                                    <svg
                                        xmlns='http://www.w3.org/2000/svg'
                                        viewBox='0 0 512 512'
                                        fill='currentColor'
                                        className='w-8 h-8 text-red-500 hover:text-red-700 cursor-pointer'
                                        onClick={() => deleteTask(task.id)}
                                    >
                                        <path
                                            d='M256 512c-141.160156 0-256-114.839844-256-256s114.839844-256 256-256 256 114.839844 256 256-114.839844 256-256 256zm0-475.429688c-120.992188 0-219.429688 98.4375-219.429688 219.429688s98.4375 219.429688 219.429688 219.429688 219.429688-98.4375 219.429688-219.429688-98.4375-219.429688-219.429688-219.429688zm0 0'></path>
                                        <path
                                            d='M347.429688 365.714844c-4.679688 0-9.359376-1.785156-12.929688-5.359375l-182.855469-182.855469c-7.144531-7.144531-7.144531-18.714844 0-25.855469 7.140625-7.140625 18.714844-7.144531 25.855469 0l182.855469 182.855469c7.144531 7.144531 7.144531 18.714844 0 25.855469-3.570313 3.574219-8.246094 5.359375-12.925781 5.359375zm0 0'></path>
                                        <path
                                            d='M164.570312 365.714844c-4.679687 0-9.355468-1.785156-12.925781-5.359375-7.144531-7.140625-7.144531-18.714844 0-25.855469l182.855469-182.855469c7.144531-7.144531 18.714844-7.144531 25.855469 0 7.140625 7.140625 7.144531 18.714844 0 25.855469l-182.855469 182.855469c-3.570312 3.574219-8.25 5.359375-12.929688 5.359375zm0 0'></path>
                                    </svg>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                {!loading && !tasks.length && (
                    <div className='p-6 text-center'>
                        <p className='text-gray-400 text-lg'>No tasks to display!</p>
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className='fixed text-gray-800 inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
                    <div className='bg-white p-6 rounded-lg shadow-xl w-full max-w-md space-y-4'>
                        <h2 className='text-xl font-bold text-gray-800'>Add New Task</h2>
                        <input
                            type='text'
                            placeholder='Title'
                            value={newTask.title}
                            onChange={(e) =>
                                setNewTask((prev) => ({ ...prev, title: e.target.value }))
                            }
                            className='w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400'
                        />
                        <textarea
                            placeholder='Description'
                            value={newTask.description}
                            onChange={(e) =>
                                setNewTask((prev) => ({ ...prev, description: e.target.value }))
                            }
                            className='w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400'
                        />
                        <div className='flex justify-end space-x-2'>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className='px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600'
                            >
                                Cancel
                            </button>
                            <button
                                onClick={addTask}
                                className='px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600'
                            >
                                Add Task
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default App
