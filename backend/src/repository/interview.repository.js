import interviewModel from "../models/interview.model.js";

const createPracticeInterview = async (interviewData) => {
    const interview = await interviewModel.create(interviewData)
    return interview
}

export default { createPracticeInterview }