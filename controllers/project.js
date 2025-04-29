import Project from '../models/project.js';

export const getProjectData = async (req, res) => {
    try {
        const userFile = req.cookies.userFile; // Retrieve the user file from cookies
        if (!userFile) {
            console.error("User file not found");
            return res.status(400).send("User file not found");
        }

        // Fetch all Projects
        const projectData = await Project.fetchAllProjects(userFile);

        // Group Projects by workspaceId
        const groupedProjects = projectData.reduce((acc, project) => {
            if (!acc[project.workspaceId]) {
                acc[project.workspaceId] = [];
            }
            acc[project.workspaceId].push(project);
            return acc;
        }, {});

        console.log("Grouped Project Data:", groupedProjects); // Log the grouped project data

        // Render the project view with grouped data
        res.render("project", {
            pageTitle: "Project Information",
            groupedProjects: groupedProjects,
        });
    } catch (error) {
        console.error("Error fetching client data:", error.message); // Log the error message
        res.status(500).send("Error fetching client data"); // Send a 500 error response
    }
};