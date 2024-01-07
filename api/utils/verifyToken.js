const jwt = require("jsonwebtoken");
const { handleError } = require("./error.js");

const verifyToken = async (req, res, next) => {
    try {
        const token = req.cookies["access_token"];
        if (!token) return next(handleError(401, "Unauthorized"));
        const verifiedUser = jwt.verify(token, process.env.SECRET);
        if (!verifiedUser) return next(handleError(403, "Forbidden"));
        req.verifiedUser = verifiedUser;
        next();
    } catch (error) {
        next(error);
    }
}

module.exports = { verifyToken };  