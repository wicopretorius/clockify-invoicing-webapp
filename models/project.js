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

    static async fetchAllProjects(filename) {
        const userFilePath = path.join(__dirname, '..', 'data', 'clockify', 'users', filename);
        const workspaceFilePath = path.join(__dirname, '..', 'data', 'clockify', 'workspaces', filename);
        const projectFilePath = path.join(__dirname, '..', 'data', 'clockify', 'projects', filename);

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

            const newProjectData = [];

            // Iterate over each workspace and fetch projects
            for (const workspace of workspaceData) {
                const workspaceId = workspace.id;

                try {
                    // Fetch projects for the current workspace
                    const response = await axios.get(
                        `https://api.clockify.me/api/v1/workspaces/${workspaceId}/projects`,
                        {
                            headers: { 'x-api-key': apiKey }
                        }
                    );

                    // Extract project data and add workspace ID
                    const projects = response.data.map(project => ({
                        id: project.id,
                        name: project.name,
                        clientId: project.clientId,
                        workspaceId: workspaceId,
                    }));

                    // Add the projects to the newProjectData array
                    newProjectData.push(...projects);
                } catch (err) {
                    console.error(
                        `Error fetching projects for workspace ${workspaceId}:`,
                        err.message
                    );
                }
            }

            // Save the project data to a file
            fs.writeFileSync(projectFilePath, JSON.stringify(newProjectData, null, 2));

            return newProjectData; // Return the filtered data
        } catch (err) {
            console.error('Error in fetchAllProjects:', err.message);
            throw err;
        }
    }
}