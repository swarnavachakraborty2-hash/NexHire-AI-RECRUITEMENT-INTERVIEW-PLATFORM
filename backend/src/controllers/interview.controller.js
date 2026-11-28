import asyncHandler from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import uploadFile from "../utils/cloudinary.js";
import companyModel from "../models/company.model.js";
import companyMemberModel from "../models/companyMember.model.js";
import generateInterviewQuestions from "../services/gemini.service.js";
import mongoose from "mongoose";
import interviewService from "../services/interview.service.js";
import interviewQuestionModel from "../models/interviewQuestion.model.js"

const createPracticeInterview = asyncHandler(async function (req, res) {

    const { title, interviewType, difficulty, duration, answerModes, topics } = req.body
    if (!(title || interviewType || difficulty || duration)) {
        throw new apiError(400, "please provide the required fileds")
    }
    const userId = req.user._id

    const createdInterview = await interviewService.createPracticeInterview({
        title,
        interviewType,
        difficulty,
        duration,
        mode: "practice",
        answerModes: answerModes ? answerModes : [],
        status: "ready"
    })
    if (!createdInterview) {
        throw new apiError(400, "could'nt create interview")
    }

    const generatedQuestions = await generateInterviewQuestions({ title, interviewType, difficulty, duration, topics: topics ? topics : [] })
    if (!generatedQuestions || generatedQuestions.length == 0) {
        throw new apiError(400, "could'nt generate interview questions")
    }

    const interviewQuestions = generatedQuestions?.map( async (question) => await interviewQuestionModel.create({
        //due
    }))

})


export default { createPracticeInterview }