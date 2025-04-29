document.addEventListener("DOMContentLoaded", () => {
    const workspaceSelect = document.getElementById("workspaceId");
    const clientSelect = document.getElementById("clientId");
    const projectBox = document.getElementById("projectBox");
    const projectIdsInput = document.getElementById("projectIds");

    // All clients and projects passed from the server
    const allClients = JSON.parse(document.getElementById("clientsData").textContent);
    const allProjects = JSON.parse(document.getElementById("projectsData").textContent);

    // Event listener for workspace selection change
    workspaceSelect.addEventListener("change", () => {
        const selectedWorkspaceId = workspaceSelect.value;

        // Filter clients based on the selected workspace
        const filteredClients = allClients.filter(client => client.workspaceId === selectedWorkspaceId);

        // Clear existing options in the client dropdown
        clientSelect.innerHTML = "";

        // Add filtered clients to the dropdown
        if (filteredClients.length > 0) {
            filteredClients.forEach(client => {
                const option = document.createElement("option");
                option.value = client.id;
                option.textContent = client.name;
                clientSelect.appendChild(option);
            });
        } else {
            // If no clients are available, show a disabled option
            const option = document.createElement("option");
            option.value = "";
            option.textContent = "No clients available";
            option.disabled = true;
            clientSelect.appendChild(option);
        }

        // Trigger the client change event to update projects
        clientSelect.dispatchEvent(new Event("change"));
    });

    // Event listener for client selection change
    clientSelect.addEventListener("change", () => {
        const selectedClientId = clientSelect.value;

        // Filter projects based on the selected client
        const filteredProjects = allProjects.filter(project => project.clientId === selectedClientId);

        // Clear the project box
        projectBox.innerHTML = "";

        // Add filtered projects to the project box
        const selectedProjectIds = [];
        if (filteredProjects.length > 0) {
            filteredProjects.forEach(project => {
                const projectItem = document.createElement("div");
                projectItem.textContent = project.name;
                projectItem.dataset.projectId = project.id;
                projectItem.classList.add("project-item");
                projectItem.addEventListener("click", () => {
                    projectItem.classList.toggle("selected");
                    updateSelectedProjects();
                });
                projectBox.appendChild(projectItem);
            });
        } else {
            projectBox.textContent = "No projects available for the selected client.";
        }

        // Update the hidden input with selected project IDs
        function updateSelectedProjects() {
            const selectedProjects = Array.from(
                projectBox.querySelectorAll(".project-item.selected")
            ).map(item => item.dataset.projectId);
            projectIdsInput.value = JSON.stringify(selectedProjects);
        }
    });

    // Trigger the workspace change event on page load to initialize the client dropdown
    workspaceSelect.dispatchEvent(new Event("change"));
});