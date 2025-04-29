import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class Workspace {
    constructor(id, name, workspaceId) {
        this.id = id;
        this.name = name;
        this.workspaceId = workspaceId;
    }
    
    
    static async fetchAllClients(filename){
        const userFilePath = path.join(__dirname, '..', 'data', 'clockify', 'users', filename);
        const workspaceFilePath = path.join(__dirname, '..', 'data', 'clockify', 'workspaces', filename);
        const clientFilePath = path.join(__dirname, '..', 'data', 'clockify', 'clients', filename);
      
        try {
          let fileData = {};
      
          if (fs.existsSync(userFilePath)) {
            const rawData = fs.readFileSync(userFilePath);
            fileData = JSON.parse(rawData);
          }
          
          // If missing but has apikey, fetch from Clockify API
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

            const newClientData = [];
      
          // Iterate over each workspace and fetch clients
        for (const workspace of workspaceData) {
            const workspaceId = workspace.id;

            const response = await axios.get(`https://api.clockify.me/api/v1/workspaces/${workspaceId}/clients`, {
                headers: { 'x-api-key': apiKey }
            });

            // Extract client data and add workspace ID
            const clients = response.data.map(client => ({
                id: client.id,
                name: client.name,
                workspaceId: workspaceId,
            }));

            // Add the clients to the newClientData array
            newClientData.push(...clients);
        }
        // Save the client data to a file
        fs.writeFileSync(clientFilePath, JSON.stringify(newClientData, null, 2));

        return newClientData; // Return the filtered data

        } catch (err) {
          console.error('Error in fetchAllClients:', err);
          throw err;
        }
      };
    }