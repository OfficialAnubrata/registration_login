const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const { ApiError } = require("../utils/ApiError.js");

const validateToken = asyncHandler(async (req, res, next) => {
    let token = req.cookies.accesstoken;

    if (!token) {
        throw new ApiError(400,"User is not authorized or token is missing");
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            throw new ApiError(401,"User is not authorized");
        }
        req.user = decoded.user;
        next();
    });
});
module.exports = validateToken;

