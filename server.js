import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import multer from 'multer';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

// Set the base path
const basePath = '/invoicing';

app.set("view engine", "ejs");
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json()); // Built-in middleware for JSON parsing
app.use(express.urlencoded({ extended: true })); // For URL-encoded data
app.use(cookieParser()); // Enable cookie parsing
app.use(basePath, express.static(path.join(__dirname, 'public'))); // Serve static files under the base path



// Serve static files for uploads, reports, and invoices under the base path
 app.use(`${basePath}/uploads`, express.static(path.join(__dirname, 'data', 'images')));
 app.use(`${basePath}/reports`, express.static(path.join(__dirname, 'data', 'reports')));
 app.use(`${basePath}/invoices`, express.static(path.join(__dirname, 'data', 'invoices')));

// Configure multer for file uploads
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'data/images')); // Save files to the 'data/images' folder
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Use a timestamp to make filenames unique
  }
});

const fileFilter = (req, file, cb) => {
  // Accept only image files
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// Use multer middleware
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).fields([
  { name: "companyLogo", maxCount: 1 },
  { name: "clientLogo", maxCount: 1 }
])); // Handle multiple file fields



// Routes
import userRoutes from './routes/user.js';
app.use(basePath, userRoutes);

import cookieRoutes from './routes/cookie.js';
app.use(basePath, cookieRoutes);

import workspaceRoutes from './routes/workspace.js';
app.use(basePath, workspaceRoutes);

import clientRoutes from './routes/client.js';
app.use(basePath, clientRoutes);

import projectRoutes from './routes/project.js';
app.use(basePath, projectRoutes);

import taskRoutes from './routes/task.js';
app.use(basePath, taskRoutes);

import reportRoutes from './routes/report.js';
app.use(basePath, reportRoutes);

import invoiceRoutes from './routes/invoice.js';
app.use(basePath, invoiceRoutes);



app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}${basePath}`);
  });