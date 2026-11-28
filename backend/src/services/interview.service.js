import interviewRepository from "../repository/interview.repository.js";

const createPracticeInterview = async (data) => {
    const interview = await interviewRepository.createPracticeInterview(data)
    return interview
}

export default {createPracticeInterview}