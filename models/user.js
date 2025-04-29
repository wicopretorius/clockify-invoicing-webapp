import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class User {
    constructor(apiKey, id, name, email) {
      this.apiKey = apiKey;
      this.id = id;
      this.name = name;
      this.email = email;
    }
    
    saveAPIKey(APIKey) {
        this.APIKey = APIKey;
    }
    
    static fetchAPIKey(filename, callback) {
        const p = path.join(__dirname, '..', 'data', 'clockify', 'users', `${filename}`);
        //let user = {"apiKey":"error"};
        fs.readFile(p, (err, fileContent) => {
             if (err) {
                 // If the file does not exist or cannot be read, return an empty array
                 return callback(new Error("File not found or cannot be read"), null);
             }
             try {
                 // Attempt to parse the file content
                 const user = JSON.parse(fileContent);
                 return callback(null, user); // Success: Pass the user data
             } catch (parseError) {
                 // If parsing fails (e.g., empty file), return an empty array
                 return callback(new Error("Failed to parse file content"), null);
             }
         });
    }

    static async fetchCurrentUser(filename){
        const filePath = path.join(__dirname, '..', 'data', 'clockify', 'users', filename);
      
        try {
          let fileData = {};
      
          if (fs.existsSync(filePath)) {
            const rawData = fs.readFileSync(filePath);
            fileData = JSON.parse(rawData);
          }
      
          // Check if full user data is available
          if (fileData.id && fileData.name && fileData.email) {
            return fileData;
          }
      
          // If missing but has apikey, fetch from Clockify API
          const apiKey = fileData.apiKey;
          if (!apiKey) {
            throw new Error('API key not found in user file');
          }
      
          const response = await axios.get('https://api.clockify.me/api/v1/user', {
            headers: { 'x-api-key': apiKey }
          });
            
          console.log(response.data);
          const newUserData = {
            apiKey: apiKey,
            id: response.data.id,
            name: response.data.name,
            email: response.data.email
          };
      
          fs.writeFileSync(filePath, JSON.stringify(newUserData, null, 2));
          return newUserData;
      
        } catch (err) {
          console.error('Error in fetchCurrentUser:', err);
          throw err;
        }
      };
    }