import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class Project {
    constructor(id, name, workspaceId) {
        this.id = id;
        this.name = name;
        this.workspaceId = workspaceId;
    }

    static async fetchAllTasks(filename) {
        const userFilePath = path.join(__dirname, '..', 'data', 'clockify', 'users', filename);
        const workspaceFilePath = path.join(__dirname, '..', 'data', 'clockify', 'workspaces', filename);
        const projectFilePath = path.join(__dirname, '..', 'data', 'clockify', 'projects', filename);
        const taskFilePath = path.join(__dirname, '..', 'data', 'clockify', 'tasks', filename);

        try {
            let fileData = {};

            // Read user file to get the API key
            if (fs.existsSync(userFilePath)) {
                const rawData = fs.readFileSync(userFilePath);
                fileData = JSON.parse(rawData);
            }

            const apiKey = fileData.apiKey;
            if (!apiKey) {
                throw new Error('API key not found in user file');
            }

            // Read workspace file to get workspace IDs
            let workspaceData = [];
            if (fs.existsSync(workspaceFilePath)) {
                const rawWorkspaceData = fs.readFileSync(workspaceFilePath);
                workspaceData = JSON.parse(rawWorkspaceData); // Assuming this contains an array of workspace objects
            }

            // Read projects file to get project IDs
            let projectData = [];
            if (fs.existsSync(projectFilePath)) {
                const rawProjectData = fs.readFileSync(projectFilePath);
                projectData = JSON.parse(rawProjectData); // Assuming this contains an array of project objects
            }

            const newTaskData = [];

            // Iterate over each workspace
            for (const workspace of workspaceData) {
                const workspaceId = workspace.id;

                // Iterate over each project in the workspace
                for (const project of projectData) {
                    const projectId = project.id;

                    try {
                        // Fetch tasks for the current project
                        const response = await axios.get(
                            `https://api.clockify.me/api/v1/workspaces/${workspaceId}/projects/${projectId}/tasks`,
                            {
                                headers: { 'x-api-key': apiKey }
                            }
                        );

                        // Extract task data and add workspace and project IDs
                        const tasks = response.data.map(task => ({
                            id: task.id,
                            name: task.name,
                            projectId: projectId,
                            workspaceId: workspaceId,
                        }));

                        // Add the tasks to the newTaskData array
                        newTaskData.push(...tasks);
                    } catch (err) {
                        console.error(
                            `Error fetching tasks for workspace ${workspaceId} and project ${projectId}:`,
                            err.message
                        );
                    }
                }
            }

            // Save the task data to a file
            fs.writeFileSync(taskFilePath, JSON.stringify(newTaskData, null, 2));

            return newTaskData; // Return the filtered data
        } catch (err) {
            console.error('Error in fetchAllTasks:', err.message);
            throw err;
        }
    }
}