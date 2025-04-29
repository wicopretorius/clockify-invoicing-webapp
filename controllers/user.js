import User from '../models/user.js';
import path from 'path';

export const getAPIKey = (req, res, next) => {
    
    if (!req.cookies.userFile) {
        res.render("index", { 
            apikey: "No API Key", 
            pageTitle: "Clockify Program",
            path: "/",          

        });
    }   
    else {
        //const user = new User
        const filename = req.cookies.userFile; // Properly declare filename
        User.fetchAPIKey(filename, (err, user) => {
            if (err) {
                console.error("Error:", err.message); // Log the error message
                res.render("index", { 
                    apikey: "Error fetching user data", 
                    pageTitle: "Clockify Program",
                    path: "/",
                });
                return;
            }
            console.log("User data:", user); // Log the user data
            res.render("index", { 
                apikey: user.apiKey, 
                pageTitle: "Clockify Program",
                path: "/",
            });
        });
    }
};

export const getUserData = async (req, res) => { 
    try{ 
        const userFile = req.cookies.userFile; // Properly declare filename
        if (!req.cookies.userFile) {
            console.log("User file not found");
            return res.status(400).send("User file not found");
        }    
        const user = await User.fetchCurrentUser(userFile);
        res.render('user', { user: user });    
    }
    catch (error) {
        console.error("Error:", error.message); // Log the error message
        res.status(500).send("Error fetching user data"); // Send a 500 error response
        return;
    }
}