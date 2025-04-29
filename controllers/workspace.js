import Workspace from '../models/workspace.js';


export const getWorkspaceData = async (req, res) => { 
    try{ 
        const userFile = req.cookies.userFile; // Properly declare filename
        if (!req.cookies.userFile) {
            console.log("User file not found");
            return res.status(400).send("User file not found");
        }    
        const workspaceData = await Workspace.fetchAllWorkspaces(userFile);
        console.log("Workspace data:", workspaceData); // Log the workspace data
        res.render('workspace', { workspaces: workspaceData });    
    }
    catch (error) {
        console.error("Error:", error.message); // Log the error message
        res.status(500).send("Error fetching workspace data"); // Send a 500 error response
        return;
    }
}