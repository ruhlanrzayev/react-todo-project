import { Link } from 'react-router-dom';
import React, { useState, useEffect, useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext.jsx';

const sun = 'fa-sun';
const moon = 'fa-moon';

function TodoMain() {
    const { theme, setTheme } = useContext(ThemeContext);
    const [tasks, setTasks] = useState([]);
    const [taskCount, setTaskCount] = useState(0);
    const [successCount, setSuccessCount] = useState(0);
    const [pendingCount, setPendingCount] = useState(0);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isDetailsViewOpen, setIsDetailsViewOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [newTask, setNewTask] = useState({
        name: '',
        difficulty: '',
        priority: '',
        category: '',
        tags: '',
        creationDate: new Date().toISOString().split('T')[0],
        deadlineDate: ''
    });

    useEffect(() => {
        const storedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        const storedTaskCount = localStorage.getItem('taskCount') || 0;
        const storedSuccessCount = localStorage.getItem('successCount') || 0;
        const storedPendingCount = localStorage.getItem('pendingCount') || 0;

        setTasks(storedTasks);
        setTaskCount(Number(storedTaskCount));
        setSuccessCount(Number(storedSuccessCount));
        setPendingCount(Number(storedPendingCount));
    }, []);

    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
        localStorage.setItem('taskCount', taskCount);
        localStorage.setItem('successCount', successCount);
        localStorage.setItem('pendingCount', pendingCount);
    }, [tasks, taskCount, successCount, pendingCount]);

    const changeTheme = () => {
        setTheme(theme === "light" ? "dark" : "light");
    };

    const openCreateTaskModal = () => setIsCreateModalOpen(true);
    const closeCreateTaskModal = () => {
        setIsCreateModalOpen(false);
        setNewTask({
            name: '',
            difficulty: '',
            priority: '',
            category: '',
            tags: '',
            creationDate: new Date().toISOString().split('T')[0],
            deadlineDate: ''
        });
    };

    const addTask = () => {
        const { name, difficulty, priority, category, deadlineDate } = newTask;
        
        if (!name || !difficulty || !priority || !category || !deadlineDate) {
            alert('Please fill all required fields!');
            return;
        }

        const newTaskObj = {
            id: taskCount + 1,
            name,
            difficulty,
            priority,
            category,
            tags: newTask.tags ? newTask.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
            creationDate: newTask.creationDate,
            deadlineDate,
            status: 'pending'
        };

        setTasks(prevTasks => [...prevTasks, newTaskObj]);
        setTaskCount(prevCount => prevCount + 1);
        setPendingCount(prevCount => prevCount + 1);
        closeCreateTaskModal();
    };

    const deleteTask = (taskId) => {
        const taskToDelete = tasks.find(t => t.id === taskId);
        
        setTasks(prevTasks => prevTasks.filter(t => t.id !== taskId).map((task, index) => ({
            ...task,
            id: index + 1
        })));
        
        setTaskCount(prevCount => prevCount - 1);
        
        if (taskToDelete.status === 'completed') {
            setSuccessCount(prevCount => prevCount - 1);
        } else {
            setPendingCount(prevCount => prevCount - 1);
        }
    };

    const markAsSuccess = (taskId) => {
        setTasks(prevTasks => prevTasks.map(task => {
            if (task.id === taskId) {
                const newStatus = task.status === 'pending' ? 'completed' : 'pending';
                
                if (newStatus === 'completed') {
                    setSuccessCount(prevCount => prevCount + 1);
                    setPendingCount(prevCount => prevCount - 1);
                } else {
                    setSuccessCount(prevCount => prevCount - 1);
                    setPendingCount(prevCount => prevCount + 1);
                }
                
                return { ...task, status: newStatus };
            }
            return task;
        }));
    };

    const editTask = (taskId) => {
        const newName = prompt("Edit Task Name:", tasks.find(t => t.id === taskId).name);
        
        if (newName !== null && newName.trim() !== '') {
            setTasks(prevTasks => prevTasks.map(task => 
                task.id === taskId ? { ...task, name: newName.trim() } : task
            ));
        }
    };

    const showTaskDetails = (taskId) => {
        setSelectedTask(tasks.find(t => t.id === taskId));
        setIsDetailsViewOpen(true);
    };

    const backToTaskList = () => {
        setIsDetailsViewOpen(false);
        setSelectedTask(null);
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setNewTask(prevTask => ({
            ...prevTask,
            [id]: value
        }));
    };

    return (
        <div className="min-h-screen w-screen relative flex items-center justify-center flex-col gap-3 text-[#242424] dark:text-amber-50 bg-[#eeeaea] dark:bg-[#242424]">
            <div className="change-theme flex items-center justify-between">
                <button 
                    className={`fa-solid ${theme === "light" ? moon : sun} rounded-[50%] px-4 py-3 bg-black text-amber-50 hover:border-[#333] dark:px-3 focus:outline-none focus:ring-0 absolute right-[25px] top-[25px]`} 
                    onClick={changeTheme}
                >
                </button>
                <Link
                  to="/"
                  className="absolute top-[25px] left-[25px] bg-orange-600 rounded-2xl px-[10px] py-[5px] text-amber-50 font-bold text-[12px] sm:px-[15px] md:px-[20px] sm:py-[10px] md:py-[10px] sm:rounded-[40px] sm:text-xl sm:transition ease duration-300 hover:bg-orange-500 dark:hover:bg-orange-700 hover:text-amber-50"
                >
                  Get Home
                </Link>
            </div>

            <div className="super-container bg-[#242424] p-[20px] w-full flex items-start justify-center max-w-[800px] rounded-[20px] dark:bg-[#eeeaea]">
                {!isDetailsViewOpen ? (
                    <div id="taskListView">
                        <div className="container">
                            <div className="top-content p-3 sm:w-[800px]">
                                <div className="top-text flex items-center justify-between w-[280px] sm:w-full my-4">
                                    <h1 className="text-amber-50 font-bold text-[1.5em] dark:text-[#242424]">My Tasks</h1>
                                    <button 
                                        onClick={openCreateTaskModal} 
                                        className="bg-[#eeeaea] dark:bg-[#242424] dark px-3 py-2 rounded-[20px] font-bold cursor-pointer hover:bg-[#eeeaea] focus:outline-0 active:scale-[.9] transition ease duration-200"
                                    >
                                        Create Task
                                    </button>
                                </div>
                                <div className="top-content flex items-center justify-evenly flex-row sm:flex-row">
                                    <span className="bg-blue-300 text-blue-600 p-1 rounded-[5px] m-1">Total: {taskCount}</span>
                                    <span className="bg-green-300 text-green-600 p-1 rounded-[5px] m-1">Success: {successCount}</span>
                                    <span className="bg-orange-300 text-orange-600 p-1 rounded-[5px] m-1">Pending: {pendingCount}</span>
                                </div>
                            </div>
                        </div>
                        <div className="taskContainer p-2">
                            {tasks.map(task => (
                                <div 
                                    key={task.id} 
                                  className="flex justify-between w-full sm:w-[700px] m-auto items-center bg-[#eeeaea] dark:bg-[#242424] p-3 rounded-md my-3 flex-wrap"
                                >
                                    <div className="flex items-center gap-3 w-full sm:w-auto">
                                        <input 
                                            type="checkbox" 
                                            checked={task.status === 'completed'}
                                            onChange={() => markAsSuccess(task.id)} 
                                            className="task-checkbox"
                                        />
                                        <i 
                                            className="fas fa-edit cursor-pointer" 
                                            onClick={() => editTask(task.id)}
                                        ></i>
                                        <i 
                                            className="fas fa-trash cursor-pointer" 
                                            onClick={() => deleteTask(task.id)}
                                        ></i>
                                        <span 
                                            onClick={() => showTaskDetails(task.id)}
                                            className={`task-name cursor-pointer ${task.status === 'completed' ? 'line-through' : ''}`}
                                        >
                                            {task.id}. {task.name}
                                        </span>
                                    </div>
                                    <div className="task-dates text-sm text-gray-600 hidden sm:block">
                                        Deadline: {task.deadlineDate}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div id="taskDetailsView" className="p-6 w-[800px] m-auto">
                        <button 
                            onClick={backToTaskList} 
                            className="mb-4 bg-gray-600 px-4 py-2 rounded"
                        >
                            <i className="fas fa-arrow-left mr-2"></i>Back to Tasks
                        </button>
                        {selectedTask && (
                            <div className="bg-[#eeeaea] dark:bg-[#242424] p-6 rounded-lg ">
                                <h2 className="text-2xl font-bold mb-4">
                                    {selectedTask.id}. {selectedTask.name}
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <strong>Difficulty:</strong> {selectedTask.difficulty}
                                    </div>
                                    <div>
                                        <strong>Priority:</strong> {selectedTask.priority}
                                    </div>
                                    <div>
                                        <strong>Category:</strong> {selectedTask.category}
                                    </div>
                                    <div>
                                        <strong>Tags:</strong> {selectedTask.tags.join(', ') || 'No tags'}
                                    </div>
                                    <div>
                                        <strong>Created:</strong> {selectedTask.creationDate}
                                    </div>
                                    <div>
                                        <strong>Deadline:</strong> {selectedTask.deadlineDate}
                                    </div>
                                    <div>
                                        <strong>Status:</strong> 
                                        {selectedTask.status === 'pending' ? (
                                            <span className="bg-orange-300 text-orange-600 p-1 rounded-[5px]">Pending</span>
                                        ) : (
                                            <span className="bg-green-300 text-green-600 p-1 rounded-[5px]">Success</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {isCreateModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center modal-backdrop z-50">
                    <div className="bg-[#242424] dark:bg-[#eeeaea] p-6 rounded-lg shadow-lg w-[90%] max-w-[500px]">
                        <h2 className="text-lg font-bold mb-4 text-white dark:text-[#242424]">Create New Task</h2>
                        <div className="space-y-4">
                            <input 
                                type="text" 
                                id="name" 
                                value={newTask.name}
                                onChange={handleInputChange}
                                className="border p-2 w-full text-white" 
                                placeholder="Task Name *" 
                                required 
                            />
                            
                            <select 
                                id="difficulty" 
                                value={newTask.difficulty}
                                onChange={handleInputChange}
                                className="border p-2 w-full text-white"
                            >
                                <option value="">Select Difficulty</option>
                                <option value="Easy">Easy</option>
                                <option value="Medium">Medium</option>
                                <option value="Hard">Hard</option>
                            </select>

                            <select 
                                id="priority" 
                                value={newTask.priority}
                                onChange={handleInputChange}
                                className="border p-2 w-full text-white"
                            >
                                <option value="">Select Priority</option>
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>

                            <select 
                                id="category" 
                                value={newTask.category}
                                onChange={handleInputChange}
                                className="border p-2 w-full text-white"
                            >
                                <option value="">Select Category</option>
                                <option value="Work">Work</option>
                                <option value="Personal">Personal</option>
                                <option value="Study">Study</option>
                                <option value="Health">Health</option>
                            </select>

                            <input 
                                type="text" 
                                id="tags" 
                                value={newTask.tags}
                                onChange={handleInputChange}
                                className="border p-2 w-full text-white" 
                                placeholder="Tags (optional)" 
                            />

                            <div className="flex space-x-4">
                                <div className="w-1/2 text-white">
                                    <label className="block mb-2 text-white dark:text-[#242424]">Creation Date</label>
                                    <input 
                                        type="date" 
                                        id="creationDate" 
                                        value={newTask.creationDate}
                                        onChange={handleInputChange}
                                        className="border p-2 w-full" 
                                        readOnly 
                                    />
                                </div>
                                <div className="w-1/2 text-white">
                                    <label className="block mb-2 text-white dark:text-[#242424]">Deadline</label>
                                    <input 
                                        type="date" 
                                        id="deadlineDate" 
                                        value={newTask.deadlineDate}
                                        onChange={handleInputChange}
                                        className="border p-2 w-full" 
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-4">
                            <button 
                                onClick={closeCreateTaskModal} 
                                className="bg-gray-400 px-4 py-2 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={addTask} 
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                            >
                                Create Task
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TodoMain;