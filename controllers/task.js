import Task from '../models/task.js';

var taskDataCache; // Cache to store fetched task data temporarily

export const getTaskData = async (req, res) => {
    taskDataCache = null;
    try {
        const userFile = req.cookies.userFile; // Retrieve the user file from cookies
        if (!userFile) {
            console.error("User file not found");
            return res.status(400).send("User file not found");
        }

        // Render the loading view immediately
        res.render("loading", {
            pageTitle: "Loading Tasks...",
        });

        // Fetch all tasks in the background
        const taskData = await Task.fetchAllTasks(userFile);

        // Group tasks by workspaceId and projectId
        const groupedTasks = taskData.reduce((acc, task) => {
            if (!acc[task.workspaceId]) {
                acc[task.workspaceId] = {}; // Initialize workspace group
            }
            if (!acc[task.workspaceId][task.projectId]) {
                acc[task.workspaceId][task.projectId] = []; // Initialize project group
            }
            acc[task.workspaceId][task.projectId].push(task); // Add task to the project group
            return acc;
        }, {});

        console.log("Grouped Task Data:", groupedTasks); // Log the grouped task data

        // Cache the grouped task data
        taskDataCache = groupedTasks;
        console.log("Task data cached successfully " + taskDataCache); // Log the successful caching
        
    } catch (error) {
        console.error("Error fetching task data:", error.message); // Log the error message
        taskDataCache = { error: "Error fetching task data" }; // Cache the error
    }
};

// Endpoint to check if task data is ready
export const checkTaskData = (req, res) => {
    console.log("Checking task data:" + taskDataCache); // Log the check request
    if (taskDataCache) {
        if (taskDataCache.error) {
            return res.status(500).send(taskDataCache.error); // Send error if fetching failed
        }

        // Render the task view with grouped data
        res.render("task", {
            pageTitle: "Task Information",
            groupedTasks: taskDataCache,
        });

        // Clear the cache after rendering
        //taskDataCache = null;
    } else {
        res.status(202).send("Task data is still being processed."); // Send a 202 status if not ready
    }
};