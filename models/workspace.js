import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class Workspace {
    constructor(id, name,) {
        this.id = id;
        this.name = name;
    }

    static async fetchAllWorkspaces(filename){
        const userFilePath = path.join(__dirname, '..', 'data', 'clockify', 'users', filename);
        const workspaceFilePath = path.join(__dirname, '..', 'data', 'clockify', 'workspaces', filename);
      
        try {
          let fileData = {};
      
          if (fs.existsSync(userFilePath)) {
            const rawData = fs.readFileSync(userFilePath);
            fileData = JSON.parse(rawData);
          }
      
        //   // Check if full user data is available
        //  if (fileData.id && fileData.name && fileData.email) {
        //    return fileData;
        // }
      
          // If missing but has apikey, fetch from Clockify API
          const apiKey = fileData.apiKey;
          if (!apiKey) {
            throw new Error('API key not found in user file');
          }
      
          const response = await axios.get('https://api.clockify.me/api/v1/workspaces', {
            headers: { 'x-api-key': apiKey }
          });
            
          console.log(response.data);
        // Extract only id and name from the response data
        const newWorkspaceData = response.data.map(workspace => ({
            id: workspace.id,
            name: workspace.name
        }));
        fs.writeFileSync(workspaceFilePath, JSON.stringify(newWorkspaceData, null, 2));
        return newWorkspaceData; // Return the filtered data
      
          //fs.writeFileSync(filePath, JSON.stringify(newUserData, null, 2));
         // return ;//newUserData;
      
        } catch (err) {
          console.error('Error in fetchAllWorkspaces:', err);
          throw err;
        }
      };
    }