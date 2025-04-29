import Cookie from '../models/cookie.js';;

export const postSetCookie = (req, res) => {
    const cookie = new Cookie(req.body.apiKey);

    cookie.saveAPIKey()

    const filename= cookie.apiKey;
    res.cookie("userFile", `${filename}.json`, { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true });

    res.redirect("/invoicing");
};
