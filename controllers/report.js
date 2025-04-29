import Report from '../models/report.js';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getReport = (req, res) => {
    try {
        const userFile = req.cookies.userFile; // Retrieve the user file from cookies
        if (!userFile) {
            console.error("User file not found");
            return res.status(400).send("User file not found");
        }
        
        res.render("report", {
            pageTitle: "Report Management",
        });
    } catch (error) {
        console.error("Error rendering report page:", error.message);
        res.status(500).send("Error rendering report page");
    }
};

export const getReportData = async (req, res) => {
    try {
        const userFile = req.cookies.userFile; // Retrieve the user file from cookies
        if (!userFile) {
            console.error("User file not found");
            return res.status(400).send("User file not found");
        }

        // Retrieve userId, workspaceIds, and clientIds from respective files
        const userId = await Report.getUserId(userFile); // Implement this in the model
        const workspaces = await Report.getWorkspaces(userFile); // Implement this in the model
        const clients = await Report.getClients(userFile); // Implement this in the model
        const projects = await Report.getProjects(userFile);
        // Render the form for Report creation
        res.render("report-create", {
            pageTitle: "Create Report",
            userId,
            workspaces,
            clients,
            projects,
        });
    } catch (error) {
        console.error("Error fetching report data:", error.message);
        res.status(500).send("Error fetching report data");
    }
};

export const saveReportData = async (req, res) => {
    try {
        const { userId, workspaceId, clientId, dateRangeStart, dateRangeEnd } = req.body;
        const userFile = req.cookies.userFile; // Retrieve the user file from cookies
        const apiKey = await Report.getApiKey(userFile); // Retrieve API key from the model
        const projectIds = await Report.getProjectIds(userFile, clientId); // Retrieve project IDs from the model
        const dateStart = `${dateRangeStart}T00:00:00Z`;
        const dateEnd = `${dateRangeEnd}T23:59:59.999Z`;
        const fromdate = dateRangeStart.replace(/-/g, "");
        const todate = dateRangeEnd.replace(/-/g, "");

        console.log("API Key:", apiKey);
        console.log("User ID:", userId);
        console.log("Workspace ID:", workspaceId);
        console.log("Client ID:", clientId);
        console.log("Project IDs:", projectIds);
        console.log("Date Range Start:", dateStart);
        console.log("Date Range End:", dateEnd);

        // Base configuration for the Clockify API request
        const baseConfig = {
            method: "post",
            maxBodyLength: Infinity,
            url: `https://reports.api.clockify.me/v1/workspaces/${workspaceId}/reports/summary`,
            headers: {
                "Content-Type": "application/json",
                "x-api-key": apiKey,
            },
            data: {
                "amountShown": "EARNED",
                "billable": true,
                "clients": {
                    "contains": "CONTAINS",
                    "ids": [clientId],
                    "status": "ACTIVE",
                },
                "dateFormat": "YYYY-MM-DD",
                "dateRangeEnd": dateEnd,
                "dateRangeStart": dateStart,
                "dateRangeType": "",
                "description": "",
                "projects": {
                    "contains": "CONTAINS",
                    "ids": projectIds,
                    "status": "ACTIVE",
                },
                "sortOrder": "ASCENDING",
                "summaryFilter": {
                    "groups": ["PROJECT", "TASK"],
                    "sortColumn": "GROUP",
                    "summaryChartType": "BILLABILITY",
                },
                "timeFormat": "T00:00:00",
                "timeZone": "Africa/Johannesburg",
                "users": {
                    "contains": "CONTAINS",
                    "ids": [userId],
                    "status": "ALL",
                },
                "userLocale": "en",
                "weekStart": "MONDAY",
                "withoutDescription": true,
                "zoomLevel": "WEEK",
            },
        };

        // Function to fetch and save a report
        const fetchAndSaveReport = async (exportType, extension) => {
            // Clone the baseConfig and add exportType
            const config = { ...baseConfig };
            config.data.exportType = exportType; // Add exportType to the request payload

            // Stringify the data for the request
            const requestData = JSON.stringify(config.data);

            console.log(`Requesting ${exportType} report...`);

            // Make the axios request
            const response = await axios({
                method: config.method,
                url: config.url,
                headers: config.headers,
                data: requestData, // Use the stringified data
                responseType: exportType === "PDF" ? "stream" : "arraybuffer", // Set response type
            });

            // Save the report to a file
            const outputPath = path.join(__dirname, "..", "data", "reports", `${fromdate}-${todate}.${extension}`);

            if (exportType === "PDF") {
                // Handle PDF response
                const writer = fs.createWriteStream(outputPath);
                response.data.pipe(writer);

                return new Promise((resolve, reject) => {
                    writer.on("finish", () => {
                        console.log(`${exportType} report saved successfully:`, outputPath);
                        resolve();
                    });
                    writer.on("error", (error) => {
                        console.error(`Error saving ${exportType} report:`, error.message);
                        reject(error);
                    });
                });
            } else if (exportType === "CSV") {
                // Handle CSV response
                const csvData = Buffer.from(response.data, "binary").toString("utf-8"); // Convert arraybuffer to string
                fs.writeFileSync(outputPath, csvData); // Write CSV data to file
                console.log(`${exportType} report saved successfully:`, outputPath);
            }
        };

        // Fetch and save both PDF and CSV reports
        await fetchAndSaveReport("CSV", "csv");
        await fetchAndSaveReport("PDF", "pdf");

        // Redirect back to the Report page
        res.redirect("/invoicing/report/showall");
    } catch (error) {
        console.error("Error generating report:", error.message);
        res.status(500).send("Error generating report");
    }
};

export const showAllReports = async (req, res) => {
    try {
        // Path to the Reports directory
        const reportsDir = path.join(__dirname, "..", "data", "reports");

        // Get the list of files in the Reports directory
        const files = fs.readdirSync(reportsDir);

        if (files.length === 0) {
            return res.status(404).send("No reports found.");
        }

        // Filter only PDF files
        const pdfReports = files
            .filter(file => file.endsWith(".pdf")) // Include only .pdf files
            .map(file => ({
                name: file,
                path: `/reports/${file}`, // Public path to the report
                time: fs.statSync(path.join(reportsDir, file)).mtime.getTime(),
            }));

        if (pdfReports.length === 0) {
            return res.status(404).send("No PDF reports found.");
        }

        // Sort the reports by creation time (most recent first)
        pdfReports.sort((a, b) => b.time - a.time);

        // Get the latest report
        const latestReport = pdfReports[0];

        // Render the view and pass the reports and the latest report
        res.render("show-report", {
            pageTitle: "Reports",
            reports: pdfReports,
            latestReportPath: latestReport.path,
        });
    } catch (error) {
        console.error("Error displaying the reports:", error.message);
        res.status(500).send("Error displaying the reports.");
    }
};