import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class Report {
    // constructor(companyLogo, clientLogo, clientAddress, clientAttention, bankingDetails) {
    //     this.companyLogo = companyLogo;
    //     this.clientLogo = clientLogo;
    //     this.clientAddress = clientAddress;
    //     this.clientAttention = clientAttention;
    //     this.bankingDetails = bankingDetails;
    // }

    // Save admin data to a file
    static async saveAdminData(filename, data) {
        const invoiceInfoFilePath = path.join(__dirname, "..", "data", "clockify", "invoiceInfo", filename);

        try {
            fs.writeFileSync(invoiceInfoFilePath, JSON.stringify(data, null, 2));
            console.log("Invoice admin data saved successfully.");
        } catch (error) {
            console.error("Error saving invoice admin data:", error.message);
            throw error;
        }
    }

    // Retrieve admin data from a file
    static async getAdminData(filename) {
        const invoiceInfoFilePath = path.join(__dirname, "..", "data", "clockify", "invoiceInfo", filename);

        try {
            if (fs.existsSync(invoiceInfoFilePath)) {
                const rawData = fs.readFileSync(invoiceInfoFilePath);
                return JSON.parse(rawData); // Return parsed data
            }
            return null; // Return null if the file doesn't exist
        } catch (error) {
            console.error("Error reading invoice admin data:", error.message);
            throw error;
        }
    }

    // Retrieve userId from a file
    static async getUserId(filename) {
        const userFilePath = path.join(__dirname, "..", "data", "clockify", "users", filename);

        try {
            if (fs.existsSync(userFilePath)) {
                const rawData = fs.readFileSync(userFilePath);
                const userData = JSON.parse(rawData);
                console.log("User Data:", userData.id); // Log the retrieved data for debugging
                return userData.id; // Assuming the file contains a userId field
            }
            throw new Error("User file not found");
        } catch (error) {
            console.error("Error reading userId:", error.message);
            throw error;
        }
    }

    // Retrieve workspaceIds from a file
    static async getWorkspaces(filename) {
        const workspaceFilePath = path.join(__dirname, "..", "data", "clockify", "workspaces", filename);

        try {
            if (fs.existsSync(workspaceFilePath)) {
                const rawData = fs.readFileSync(workspaceFilePath);
                const workspaceData = JSON.parse(rawData);
                console.log("Workspace Data:", workspaceData); // Log the retrieved data for debugging
                return workspaceData; // Return an array or empty array
            }
            throw new Error("Workspace file not found");
        } catch (error) {
            console.error("Error reading workspaceIds:", error.message);
            return []; // Return an empty array on error
        }
    }

    // Retrieve clientIds from a file
    static async getClients(filename) {
        const clientFilePath = path.join(__dirname, "..", "data", "clockify", "clients", filename);

        try {
            if (fs.existsSync(clientFilePath)) {
                const rawData = fs.readFileSync(clientFilePath);
                const clientData = JSON.parse(rawData);
                console.log("Client Data:", clientData); // Log the retrieved data for debugging
                return clientData; // Return an array or empty array
            }
            throw new Error("Client file not found");
        } catch (error) {
            console.error("Error reading clientIds:", error.message);
            return []; // Return an empty array on error
        }
    }
    
    static async getProjects(filename) {
        const projectFilePath = path.join(__dirname, "..", "data", "clockify", "projects", filename);

        try {
            if (fs.existsSync(projectFilePath)) {
                const rawData = fs.readFileSync(projectFilePath);
                const projectData = JSON.parse(rawData);
                console.log("Project Data:", projectData); // Log the retrieved data for debugging
                return projectData; // Return an array or empty array
            }
            throw new Error("Project file not found");
        } catch (error) {
            console.error("Error reading ProjectIds:", error.message);
            return []; // Return an empty array on error
        }
    }

    // Retrieve projectIds from a file filtering by clientId
    static async getProjectIds(filename, clientId) {
        const projectFilePath = path.join(__dirname, "..", "data", "clockify", "projects", filename);
    
        try {
            if (fs.existsSync(projectFilePath)) {
                const rawData = fs.readFileSync(projectFilePath);
                const projectData = JSON.parse(rawData);
    
                // Filter projects by clientId
                const projectIds = projectData
                    .filter(project => project.clientId === clientId)
                    .map(project => project.id); // Extract only the project IDs
    
                console.log("Filtered Project ID:", projectIds); // Log the filtered projects for debugging
                return projectIds; // Return the filtered projects
            }
            throw new Error("Project file not found");
        } catch (error) {
            console.error("Error reading projects by clientId:", error.message);
            return []; // Return an empty array on error
        }
    }


    // Retrieve API key from a file
    static async getApiKey(filename) {
        const apiKeyFilePath = path.join(__dirname, "..", "data", "clockify", "users", filename);

        try {
            if (fs.existsSync(apiKeyFilePath)) {
                const rawData = fs.readFileSync(apiKeyFilePath);
                const apiKeyData = JSON.parse(rawData);
                return apiKeyData.apiKey; // Assuming the file contains an apiKey field
            }
            throw new Error("API key file not found");
        } catch (error) {
            console.error("Error reading API key:", error.message);
            throw error;
        }
    }
};