import jwt from "jsonwebtoken";
import apiError from "../utils/apiError.js";
import asyncHandler from "../utils/asynchandler.js";



const authMiddleware = asyncHandler(async function (req, res, next) {
    const authHeader = req.headers.authorization || req.headers.Authorization

    if (!authHeader) {
        throw new apiError(401, "unauthorised: token not found")
    }

    if (!authHeader.split(" ")[1]) {
        throw new apiError(401, "unauthorised: malformed token header")
    }

    const token = authHeader.split(" ")[1]

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        req.user = decoded
        next()
    } catch (error) {
        throw new apiError(401, error.message || "invalid access token")
    }
})


export default authMiddleware
