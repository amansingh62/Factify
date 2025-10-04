// Imported all required packages
const { verifyToken } = require("../utils/jwtHelper");

// Function for authMiddlware
const authMiddleware = (req, res, next) => {
    const token = req.cookies.accessToken;
    if(!token) return res.status(401).json({ message: "Unauthorized"});

    try{
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    }
    catch(err) {
        return res.status(403).json({ message: "Invalid Token "});
    }
};

// Exported the authMiddlware function
module.exports = authMiddleware;