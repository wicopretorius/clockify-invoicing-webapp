import Client from '../models/client.js';

export const getClientData = async (req, res) => {
    try {
        const userFile = req.cookies.userFile; // Retrieve the user file from cookies
        if (!userFile) {
            console.error("User file not found");
            return res.status(400).send("User file not found");
        }

        // Fetch all clients
        const clientData = await Client.fetchAllClients(userFile);

        // Group clients by workspaceId
        const groupedClients = clientData.reduce((acc, client) => {
            if (!acc[client.workspaceId]) {
                acc[client.workspaceId] = [];
            }
            acc[client.workspaceId].push(client);
            return acc;
        }, {});

        console.log("Grouped Client Data:", groupedClients); // Log the grouped client data

        // Render the client view with grouped data
        res.render("client", {
            pageTitle: "Client Information",
            groupedClients: groupedClients,
        });
    } catch (error) {
        console.error("Error fetching client data:", error.message); // Log the error message
        res.status(500).send("Error fetching client data"); // Send a 500 error response
    }
};