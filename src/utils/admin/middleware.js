// Code: Middleware for admin
require("dotenv").config();
const middleware = {
    isAdmin: (req, res, next) => {
        if (req.headers.token === process.env.ADMIN_TOKEN) {
            next();
        } else {
            res.status(401).json({
                success: false,
                msg: "unauthorized admin access 🤕"
            });
        }
    }
}

module.exports = middleware;