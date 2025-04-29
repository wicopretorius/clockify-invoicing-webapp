import Invoice from '../models/invoice.js';
import fs from 'node:fs';
import path from 'path';
import PDFDocument from 'pdfkit';
//import poppler from 'pdf-poppler';
import csvParser from 'csv-parser';
//import { pdf } from 'pdf-to-img';
//import pdftopic from "pdftopic";

//import { fromPath } from "pdf2pic";
//import puppeteer from 'puppeteer';
import CloudConvert from 'cloudconvert';

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cloudConvert = new CloudConvert('eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiY2ZkMTBiM2E2MzU3ZTJiMDkzMWUyY2Q5ZjExZjI2MmM2NjM2NzhkMTg2NjRjYTZmMmQ0YzFlZjdkMjc1OTZhNzk3ZjJkNDgwM2JhNjJiNDgiLCJpYXQiOjE3NDUyMzEzMjcuMzQxMTc0LCJuYmYiOjE3NDUyMzEzMjcuMzQxMTc1LCJleHAiOjQ5MDA5MDQ5MjcuMzM3OTAzLCJzdWIiOiI3MTY5NDUxOCIsInNjb3BlcyI6WyJ0YXNrLnJlYWQiLCJ3ZWJob29rLnJlYWQiLCJ0YXNrLndyaXRlIiwidXNlci53cml0ZSIsInVzZXIucmVhZCIsIndlYmhvb2sud3JpdGUiLCJwcmVzZXQucmVhZCIsInByZXNldC53cml0ZSJdfQ.Go7xhlZRBLfoiLqeSbNTyiQ-GNTOE8oeFHyostuHQs5SNM84y27C46drM2_juFmuytyPxY01tuDMlU2Kb1oYAqCLFEGwB7mkTTvFuMfMSRCcUiWQF-9xSqDqd5jjUiXvvWy5mfAxRaEo49AAGige8hvOd5M5QfZQDPdAf8jrJza2csRCOtX4-JQs4qzhHXR0fdy7XXt5dUuiSMIw1JIQDm0pMMo1emngZmYGU7NuKR7NxIro5ABYUqprVircxvo7Cn5RovMTHGINZYZxxV6JootuCM6uiYob0Z07iLTYZMX5wRHZ5nz4hYQXEvj1U0mMjuoJMQhvDMIpxV1HhWCA9QyXp3ytPjjtPPFLz71bqkNg2scJOI-6Ht06iRRsNqRyaBmcEKCDJ_pnjliRCHKNaXm8nDLcPieUddHj2YocAbFkzJpPeKozTPOeRXWh_e5gCK3wICo7uzVHYSB5OQN3XWontkuAsCY_3MFLB7ItudSNPOSiHe80V8qhu3envT4-ifdpjWJeJux9Lo585qgUQB_vzhrst6LaJtv73hbtah9wdtWDwX3Y7NJDq9I5Gn1-wcSwjRjjhVhYa_SgqdAOrPN9e0L9oxBVOcfUZAfkcZQ4wyQjyDqAg-e69Ea0nMR_WXQt3jeyZhJ2hnmP9sYXaWPR50dL8vBZZZ27xJuSWz4');


// async function pdfToJpeg(pdfPath, outputDir) {
//     if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);
  
//     const browser = await puppeteer.launch({
//       headless: "new", // or "true" depending on your Puppeteer version
//       args: ['--no-sandbox', '--disable-setuid-sandbox'] // needed for shared hosts
//     });
  
//     const page = await browser.newPage();
//     const fileUrl = `file://${path.resolve(pdfPath)}`;
//     console.log("File URL:", fileUrl); // Log the file URL for debugging

//     await page.goto(fileUrl, { waitUntil: 'networkidle0' });
  
//     const pageCount = 2; //await page.evaluate(() => {
//     //   return PDFViewerApplication.pdfDocument.numPages;
//     // });
  
//     for (let i = 1; i <= pageCount; i++) {
//         const singlePageUrl = `${fileUrl}#page=${i}`;
//         await page.goto(singlePageUrl, { waitUntil: 'networkidle0' });
      
//         // Add a small delay to make sure the PDF has rendered
//         await new Promise(resolve => setTimeout(resolve, 500));
      
//         const screenshotPath = path.join(outputDir, `page-${i}.jpeg`);
//         await page.screenshot({
//           path: screenshotPath,
//           type: 'jpeg',
//           quality: 80,
//           fullPage: true
//         });
  
//       console.log(`Saved: ${screenshotPath}`);
//     }
  
//     await browser.close();
//   }

export const getInvoice = (req, res) => {
    try {
        const userFile = req.cookies.userFile; // Retrieve the user file from cookies
        if (!userFile) {
            console.error("User file not found");
            return res.status(400).send("User file not found");
        }
        res.render("invoice", {
            pageTitle: "Invoice Management",
        });
    } catch (error) {
        console.error("Error rendering invoice page:", error.message);
        res.status(500).send("Error rendering invoice page");
    }
};

export const getInvoiceAdmin = async (req, res) => {
    try {
        const userFile = req.cookies.userFile; // Retrieve the user file from cookies
        if (!userFile) {
            console.error("User file not found");
            return res.status(400).send("User file not found");
        }

        // Retrieve invoice admin data from the model
        const adminData = await Invoice.getAdminData(userFile);
        console.log("Admin Data:", adminData); // Log the retrieved data for debugging
        // Render the admin page with the retrieved data
        res.render("invoice-admin", {
            pageTitle: "Invoice Admin",
            adminData: adminData, // Pass the data to the view
        });
    } catch (error) {
        console.error("Error rendering invoice admin page:", error.message);
        res.status(500).send("Error rendering invoice admin page");
    }
};

export const saveInvoiceAdminData = async (req, res) => {
    try {
       
        const userFile = req.cookies.userFile; // Retrieve the user file from cookies
        if (!userFile) {
            console.error("User file not found");
            return res.status(400).send("User file not found");
        }

        // Check if the user file exists and retrieve admin data
        let adminData = await Invoice.getAdminData(userFile);

        // Initialize adminData as an empty object if it is null or undefined
        if (!adminData) {
            adminData = {};
        }
        
        // Access uploaded files and form data
        const companyLogo = req.files?.companyLogo?.[0]; // Access the uploaded company logo
        const clientLogo = req.files?.clientLogo?.[0]; // Access the uploaded client logo
        const clientAddress = req.body.clientAddress;
        const clientAttention = req.body.clientAttention;
        const bankingDetails = req.body.bankingDetails;
        
        // Update the admin data only if the fields are provided
        if (companyLogo) {
            adminData.companyLogo = `invoicing/uploads/${companyLogo.filename}`;
        }
        if (clientLogo) {
            adminData.clientLogo = `invoicing/uploads/${clientLogo.filename}`;
        }
        if (clientAddress) {
            adminData.clientAddress = clientAddress;
        }
        if (clientAttention) {
            adminData.clientAttention = clientAttention;
        }
        if (bankingDetails) {
            adminData.bankingDetails = bankingDetails;
        }

        console.log("UserFile: " + userFile);
        console.log("Admin Data: " + adminData);
        // Save the data using the Invoice model
        Invoice.saveAdminData(userFile,adminData);

        res.redirect("/invoicing/invoice/admin"); // Redirect back to the admin page
    } catch (error) {
        console.error("Error saving invoice admin data:", error.message);
        res.status(500).send("Error saving invoice admin data");
    }
};

function formatDate(dateString) {
    // Extract year, month, and day from the string
    const year = dateString.substring(0, 4);
    const month = dateString.substring(4, 6) - 1; // Month is zero-based in JavaScript
    const day = dateString.substring(6, 8);

    // Create a Date object
    const date = new Date(year, month, day);

    // Format the date to "07 Apr 2025"
    const formattedDate = new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(date);

    return formattedDate;
}

async function toPDF(reportPath) {
    const pdfData = fs.readFileSync(reportPath);

    const converted_result = await pdftopic.pdftobuffer(pdfData, "all");

            converted_result.forEach((file, index) => {
                fs.writeFileSync(`page-${index}.png`, file);
            });
    
}

export const createInvoiceData = async (req, res) => {
    try {
        let { reportPath } = req.body;

        if (!reportPath) {
            return res.status(400).send("Report path is required.");
        }

        // Extract and format the date range from the report filename
        let descriptName = reportPath.replace("/invoicing/reports/", "");
        descriptName = descriptName.replace(".pdf", "");
        const descriptNameFrom = formatDate(descriptName.substring(0, 8));
        const descriptNameTo = formatDate(descriptName.substring(descriptName.length - 8));

        // Convert the virtual path to the actual filesystem path
        if (reportPath.startsWith("/invoicing/reports/")) {
            reportPath = path.join(__dirname, "..", "data", "reports", reportPath.replace("/invoicing/reports/", ""));
        }

        // Retrieve the userFile from the cookie
        const userFile = req.cookies.userFile;
        if (!userFile) {
            return res.status(400).send("User file cookie is missing.");
        }

        // Construct the full path to the invoice info file
        const invoiceInfoPath = path.join(__dirname, "..", "data", "clockify", "invoiceInfo", userFile);
        if (!fs.existsSync(invoiceInfoPath)) {
            return res.status(404).send("Invoice info file not found.");
        }

        // Read and parse the invoice info file
        const invoiceInfo = JSON.parse(fs.readFileSync(invoiceInfoPath, "utf-8"));
        console.log("Invoice Info:", invoiceInfo); // Log the invoice info for debugging

        // Generate the invoice number based on the current date
        const now = new Date();
        const invoiceNumber = `${now.getFullYear().toString().substring(2)}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(3, "0")}`; // Format: YYMMDD

        // Generate current date for invoice
        const formattedDate = new Intl.DateTimeFormat("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }).format(now);

        // Prepare logo paths
        let companyLogoName = invoiceInfo.companyLogo;
        let clientLogoName = invoiceInfo.clientLogo;

        // Remove the "/uploads/" prefix if it exists
        companyLogoName = companyLogoName.replace("invoicing/uploads/", "");
        clientLogoName = clientLogoName.replace("invoicing/uploads/", "");

        console.log("companyLogoName:", companyLogoName); // Log the company logo name for debugging
        console.log("clientLogoName:", clientLogoName); // Log the client logo name for debugging

        // Prepare the output directories
        const outputDirJpegs = path.join(__dirname, "..", "data", "jpegs");
        const outputDirInvoices = path.join(__dirname, "..", "data", "invoices");

        if (!fs.existsSync(outputDirJpegs)) {
            fs.mkdirSync(outputDirJpegs, { recursive: true });
        }

        if (!fs.existsSync(outputDirInvoices)) {
            fs.mkdirSync(outputDirInvoices, { recursive: true });
        }

        try {
            // Generate JPEGs from the PDF using pdf-poppler
            // const options = {
            //     format: "jpeg",
            //     out_dir: outputDirJpegs,
            //     out_prefix: "page",
            //     page: null, // Convert all pages
            //     density: 600, // Increased DPI for higher resolution
            //     quality: 100, // Highest JPEG quality
            //     scale: 5000,  // Scale factor for output
            // };
            //await poppler.convert(reportPath, options);
            
            try {
                // Path to the PDF to be converted (could be uploaded by user or already stored)
                //const pdfPath = path.join('path', 'to', 'invoice.pdf');
            
                const job = await cloudConvert.jobs.create({
                  tasks: {
                    import_pdf: {
                      operation: 'import/upload'
                    },
                    convert: {
                      operation: 'convert',
                      input: 'import_pdf',
                      output_format: 'jpg',
                      page_range: '1-2' // or remove for all pages
                    },
                    export_result: {
                      operation: 'export/url',
                      input: 'convert'
                    }
                  }
                });
            
                const uploadTask = job.tasks.find(task => task.name === 'import_pdf');
                await cloudConvert.tasks.upload(uploadTask, fs.createReadStream(reportPath));

                const completedJob = await cloudConvert.jobs.wait(job.id);

                const exportTask = completedJob.tasks.find(
                task => task.operation === 'export/url' && task.status === 'finished'
                );

                const files = exportTask.result.files;

                // Download each image and save as page-1.jpg, page-2.jpg, etc.
                await Promise.all(
                files.map(async (file, index) => {
                    const res = await fetch(file.url);
                    const buffer = await res.arrayBuffer();
                    const pageNum = index + 1;
                    const outputPath = path.join(__dirname, "..", "data", "jpegs", `page-${pageNum}.jpg`);
                    fs.writeFileSync(outputPath, Buffer.from(buffer));
                })
                );

                //res.status(200).json({ message: 'PDF pages converted to JPGs', filesCount: files.length });
            } catch (err) {
                console.error(err);
                res.status(500).json({ error: 'Conversion failed', details: err.message });
            }






            console.log("JPEGs generated successfully.");
            
            // Read the corresponding CSV file
            const csvFilePath = reportPath.replace(".pdf", ".csv");
            if (!fs.existsSync(csvFilePath)) {
                return res.status(404).send("Corresponding CSV file not found.");
            }

            // Parse the CSV file to extract items
            const items = [];
            await new Promise((resolve, reject) => {
                fs.createReadStream(csvFilePath)
                    .pipe(csvParser())
                    .on("data", (row) => {
                        // Assuming the CSV has columns: description, hours, unitPrice, total
                        items.push({
                            description: row.Project + " - " + row.Task,
                            hours: parseFloat(row["Time (decimal)"]),
                            unitPrice: parseFloat(250.00),
                            total: parseFloat(row["Amount (ZAR)"]),
                        });
                    })
                    .on("end", () => {
                        console.log("CSV file successfully processed.");
                        resolve();
                    })
                    .on("error", (error) => {
                        console.error("Error reading CSV file:", error.message);
                        reject(error);
                    });
            });

            // Create the invoice PDF
            const invoiceData = {
                client: {
                    attention: invoiceInfo.clientAttention,
                    address: invoiceInfo.clientAddress.replace(/\r\n/g, "\n"), // Remove \r\n and replace with a space
                    logo: clientLogoName,
                },
                companyLogo: companyLogoName,
                invoiceNumber: invoiceNumber,
                date: formattedDate,
                items: items, // Use the parsed items from the CSV
                total: items.reduce((sum, item) => sum + item.total, 0), // Calculate total
                tax: 0, // Example tax value
                amountDue: Math.floor((items.reduce((sum, item) => sum + item.total, 0)) / 100) * 100, // Round down to the nearest 100
                bankDetails: {
                    bank: invoiceInfo.bankingDetails.split("\r\n")[0], // Extract bank name
                    accName: invoiceInfo.bankingDetails.split("\r\n")[1].split(": ")[1], // Extract account name
                    accNumber: invoiceInfo.bankingDetails.split("\r\n")[2].split(": ")[1], // Extract account number
                    branch: invoiceInfo.bankingDetails.split("\r\n")[3].split(": ")[1], // Extract branch
                    swift: invoiceInfo.bankingDetails.split("\r\n")[4].split(": ")[1], // Extract SWIFT code
                },
                periodDescription: `Period: ${descriptNameFrom} to ${descriptNameTo}`,
            };

            // Extract the report filename without the `/invoices/` prefix
            const reportFilename = path.basename(reportPath, ".pdf"); // e.g., "20250407-20250413"

            // Use the report filename as the invoice name
            const outputPath = path.join(outputDirInvoices, `${reportFilename}.pdf`);

            try {
                let completed = await createInvoice(invoiceData, outputPath);

                if (completed) {
                    console.log("Invoice created successfully. Delaying redirection...");
                    setTimeout(() => {
                        console.log("Redirecting to /invoice/showall...");
                        res.redirect("/invoicing/invoice/showall");
                    }, 2000); // Delay of 2 seconds (2000 milliseconds)
                } else {
                    console.error("Invoice creation failed.");
                    res.status(500).send("Failed to create invoice.");
                }
            } catch (error) {
                console.error("Error in createInvoiceData:", error.message);
                res.status(500).send("Error creating invoice.");
            }

        } catch (error) {
            console.error("Error generating JPEGs:", error.message);
            return res.status(500).send("Failed to generate JPEGs.");
        }
    } catch (error) {
        console.error("Error creating invoice:", error.message);
        res.status(500).send("Error creating invoice.");
    }
};


// Function to create the invoice PDF
const createInvoice = async (invoiceData, outputPath) => {
    const doc = new PDFDocument({ margin: 50, size: "A4" });
    doc.pipe(fs.createWriteStream(outputPath));

    const logoPath = path.join(__dirname, "..", "data", "images", invoiceData.companyLogo);
    console.log("Logo Path:", logoPath, fs.existsSync(logoPath)); // Log the logo path for debugging

    // Add the company logo to the PDF
    if (fs.existsSync(logoPath)) {
        const logoWidth = 120;
        const pageWidth = doc.page.width;
        const logoX = (pageWidth - logoWidth) / 2;
        doc.image(logoPath, logoX, 45, { width: logoWidth });
    }

    const clientLogoPath = path.join(__dirname, "..", "data", "images", invoiceData.client.logo);
    console.log("Client Logo Path:", clientLogoPath, fs.existsSync(clientLogoPath)); // Log the client logo path for debugging
    // Add the client logo to the PDF
    const clientDetailsYPosition = 220;
    const clientLogoWidth = 150;
    const clientLogoHeight = 45;
    const clientLogoX = 50;
    const clientLogoY = clientDetailsYPosition;

    if (fs.existsSync(clientLogoPath)) {
        doc.rect(clientLogoX, clientLogoY, clientLogoWidth, clientLogoHeight)
           .fillColor('black')
           .fill();
        doc.image(clientLogoPath, clientLogoX + 5, clientLogoY + 5, { width: clientLogoWidth - 15 });
    }

    // Add content to the PDF (e.g., logo, client details, items, etc.)
    //doc.fontSize(12).text(`Invoice No: ${invoiceData.invoiceNumber}`, 50, 50);
    //doc.text(`Date: ${invoiceData.date}`, 50, 70);
    const clientInfoX = clientLogoX + clientLogoWidth + 10;
    doc.fontSize(10).text(`ATTN: ${invoiceData.client.attention}`, clientLogoX, clientDetailsYPosition + clientLogoHeight + 10);
    doc.text(invoiceData.client.address, clientInfoX, clientDetailsYPosition);

    doc.fontSize(12).text(`Invoice No: ${invoiceData.invoiceNumber}`, 400, clientDetailsYPosition);
    doc.text(`Date: ${invoiceData.date}`, 400, clientDetailsYPosition + 15);

    const tableStartY = clientDetailsYPosition + 120;
    doc.moveDown().text("DESCRIPTION", 50, tableStartY);
    doc.text("QTY (hours)", 250, tableStartY);
    doc.text("UNIT PRICE", 350, tableStartY);
    doc.text("TOTAL", 450, tableStartY);
    doc.moveTo(50, tableStartY + 15).lineTo(550, tableStartY + 15).stroke();

    // Add period description
    doc.text(invoiceData.periodDescription, 50, tableStartY + 25, {
        font: 'Helvetica-Bold'
    });

    // Add items
    let y = tableStartY + 45;  // Increased to make room for period description
    invoiceData.items.forEach(item => {
        doc.text(item.description, 50, y);
        doc.text(item.hours, 250, y);
        doc.text(`R${item.unitPrice.toFixed(2)}`, 350, y);
        doc.text(`R${item.total.toFixed(2)}`, 450, y);
        y += 20;
    });

   
    doc.text("Total", 350, y + 20);
    doc.text(`R${invoiceData.total.toFixed(2)}`, 450, y + 20);
    doc.text("Tax", 350, y + 40);
    doc.text(`R${invoiceData.tax.toFixed(2)}`, 450, y + 40);

    doc.rect(clientLogoX, y + 60, 500, 5)
       .fillColor('black')
       .fill();
    doc.fontSize(15).text("Amount Due", 220, y + 80);
    doc.fontSize(15).text(`R${invoiceData.amountDue.toFixed(2)}`, 310, y + 80);
    doc.rect(clientLogoX, y + 105, 500, 5)
        .fillColor('black')
        .fill();

    doc.moveDown();

    const marginBottom = 70; // Adjust this value for spacing from the bottom

    let y_banking = doc.page.height - marginBottom - 150
    doc.fontSize(12).text("Bank Details:", 50, y_banking + 0);
    doc.text(invoiceData.bankDetails.bank, 50, y_banking + 20);
    doc.text(`Account Name: ${invoiceData.bankDetails.accName}`, 50, y_banking + 35);
    doc.text(`Account Number: ${invoiceData.bankDetails.accNumber}`, 50, y_banking + 50);
    doc.text(`Branch: ${invoiceData.bankDetails.branch}`, 50, y_banking + 65);
    doc.text(`SWIFT: ${invoiceData.bankDetails.swift}`, 50, y_banking + 80);

    // Position the "Thank you" message at the bottom of the page
    doc.fontSize(15)
       .text("Thank you for your business!", { align: 'center', lineGap: 10 }, doc.page.height - marginBottom);


    // Add JPEGs as new pages with watermark
    const jpegDir = path.join(__dirname, "..", "data", "jpegs");
    const jpeg1Path = path.join(jpegDir, "page-1.jpg");
    const jpeg2Path = path.join(jpegDir, "page-2.jpg");

    console.log("Checking for JPEGs...");
    console.log("JPEG 1 Path:", jpeg1Path, fs.existsSync(jpeg1Path));
    console.log("JPEG 2 Path:", jpeg2Path, fs.existsSync(jpeg2Path));

    const watermarkOptions = {
        fit: [80, 60], // Scale the watermark to fit within this size
        align: "center",
        valign: "center",
        opacity: 0.5, // Set the opacity for the watermark
    };

    if (fs.existsSync(jpeg1Path)) {
        doc.addPage();
        doc.image(jpeg1Path, {
            fit: [500, 700], // Scale the image to fit within the page
            align: "center",
            valign: "center",
        });

        // Add the watermark (company logo) on top of the JPEG
        if (fs.existsSync(logoPath)) {
            doc.image(logoPath, 20, 20, watermarkOptions); // Adjust position as needed
        }
    }

    if (fs.existsSync(jpeg2Path)) {
        doc.addPage();
        doc.image(jpeg2Path, {
            fit: [500, 700], // Scale the image to fit within the page
            align: "center",
            valign: "center",
        });

        // Add the watermark (company logo) on top of the JPEG
        if (fs.existsSync(logoPath)) {
            doc.image(logoPath, 20, 20, watermarkOptions); // Adjust position as needed
        }
    }

    doc.end();
    console.log(`Invoice PDF created at ${outputPath}`);
    return true;
};

export const showAllInvoices = async (req, res) => {
    try {
        // Path to the invoices directory
        const invoicesDir = path.join(__dirname, "..", "data", "invoices");

        // Ensure the directory exists
        if (!fs.existsSync(invoicesDir)) {
            return res.status(404).send("No invoices directory found.");
        }

        // Get the list of invoice files
        const files = fs.readdirSync(invoicesDir);

        if (files.length === 0) {
            return res.status(404).send("No invoice found.");
        }

        // Map the files to include their public paths
        const invoices = files.map(file => ({
            name: file,
            path: `/invoices/${file}`, // Public path to the report
            time: fs.statSync(path.join(invoicesDir, file)).mtime.getTime(),
        }));

        // Sort the invoices by creation time (most recent first)
        invoices.sort((a, b) => b.time - a.time);

        // Get the latest report
        const latestInvoice = invoices[0];

        // Render the view and pass the invoices and the latest report
        res.render("show-invoice", {
            pageTitle: "Invoices",
            invoices,
            latestInvoicePath: latestInvoice.path,
        });
    } catch (error) {
        console.error("Error displaying the invoices:", error.message);
        res.status(500).send("Error displaying the invoices.");
    }
};