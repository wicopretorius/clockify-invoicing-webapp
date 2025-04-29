import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class Cookie {
    constructor(apiKey) {
        this.apiKey = apiKey;
    }
    
    saveAPIKey() {
        const p = path.join(__dirname, '..', 'data', 'clockify', 'users', `${this.apiKey}.json`);
        fs.writeFile(p, JSON.stringify({"apiKey":this.apiKey}), err => {
            if (err) {
                console.log(err);
            }
        });
    }
   
}