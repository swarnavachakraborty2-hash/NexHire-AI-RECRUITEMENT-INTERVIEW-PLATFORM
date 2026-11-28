import express from "express";
import companyControllers from "../controllers/company.controllers.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.js";
import interviewControllers from "../controllers/interview.controller.js";

const route = express.Router();

route.post("/practice/create-interview", authMiddleware, interviewControllers.createPracticeInterview)

export default route