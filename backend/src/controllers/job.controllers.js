import jobModel from "../models/job.model.js"
import asyncHandler from "../utils/asyncHandler.js";
import apiResponse from "../utils/apiResponse.js"
import apiError from "../utils/apiError.js";
import jobService from "../services/job.service.js"
import applicationModel from "../models/application.model.js";
import candidateModel from "../models/candidate.model.js"
import mongoose from "mongoose";
import companyMemberModel from "../models/companyMember.model.js";
import notificationModel from "../models/notification.model.js"
import userModel from "../models/user.model.js";
import companyModel from "../models/company.model.js";
import sendEmail from "../services/email.service.js";


const createJobPost = asyncHandler(async (req, res) => {

    const { title, description, type, method, experience, location, salary, requiredSkills, vacancies } = req.body

    if (!title || !description || !type || !method || !experience || !location || !requiredSkills || !vacancies) {
        throw new apiError(400, "all fields are required")
    }


    const jobData = {
        title,
        description,
        experience,
        type,
        method,
        location,
        salary,
        status: "Open",
        requiredSkills,
        vacancies,
        postedBy: req.user?._id
    }

    const job = await jobService.createJob(jobData)

    if (!job) {
        throw new apiError(400, "could'nt create job")
    }

    res.status(201).json(
        new apiResponse(201, "job created successfully", job)
    )
}
)

const getFeedJobs = asyncHandler(async function (req, res) {

    const feedJobs = await jobService.getFeedJobs()

    if (!feedJobs) {
        throw new apiError(400, "still no jobs posted yet!")
    }

    return res.status(200).json(
        new apiResponse(200, "jobs fetched successfully", feedJobs)
    )
})

const getJobDetails = asyncHandler(async function (req, res) {
    const { job_id } = req.params
    const curr_user = req.user._id

    const jobDetails = await jobService.getJobDetails(job_id)

    if (!jobDetails) {
        throw new apiError(400, "could'nt fetch job details")
    }

    let isApplied = false
    const application = await applicationModel.findOne({
        candidateId: new mongoose.Types.ObjectId(curr_user),
        jobId: new mongoose.Types.ObjectId(job_id)
    })
    if (application) {
        isApplied = true
    }

    return res.status(200).json(
        new apiResponse(200, "details fetched successfully", { ...jobDetails, isApplied })
    )
})

const jobApplicationToggle = asyncHandler(async function (req, res) {

    const { job_id } = req.params
    const user_id = req.user._id

    const foundApplication = await applicationModel.findOne({
        jobId: new mongoose.Types.ObjectId(job_id),
        candidateId: new mongoose.Types.ObjectId(user_id)
    })

    const foundJob = await jobModel.findById(job_id)
    if (!foundJob) {
        throw new apiError(400, "job does'nt exist")
    }

    let createdApplication = null

    if (!foundApplication) {
        if (foundJob.vacancies === 0) {
            throw new apiError(400, "sorry, the vacancy is full")
        }
        const candidate = await candidateModel.findOne({ userId: user_id }).select("resumeUrl")
        if (!candidate || !candidate.resumeUrl) {
            throw new apiError(400, "Please complete your candidate profile and upload a resume before applying.")
        }
        const resumeUrl = candidate.resumeUrl
        const job = await jobModel.aggregate([
            {
                $match: { _id: new mongoose.Types.ObjectId(job_id) }
            },
            {
                $lookup: {
                    from: "companymembers",
                    localField: "postedBy",
                    foreignField: "userId",
                    as: "postedBy",
                    pipeline: [
                        {
                            $project: {
                                companyId: 1
                            }
                        }
                    ]
                }
            },
            {
                $addFields: { postedBy: { $first: "$postedBy.companyId" } }
            }
        ])

        const targetCompanyId = job[0]?.postedBy || foundJob.companyId

        createdApplication = await jobService.createApplication({
            candidateId: user_id,
            jobId: job_id,
            companyId: targetCompanyId,
            resumeUrl
        })

        if (!createdApplication) {
            throw new apiError(400, "could'nt create application")
        }

        foundJob.vacancies -= 1;
        await foundJob.save()

        const user = await userModel.findById(user_id).select("name")
        await notificationModel.create({
            recipientId: foundJob.postedBy, // The recruiter
            type: "NEW_APPLICATION",
            title: "New Applicant Received",
            message: `${user?.name || "A candidate"} just applied for the ${foundJob.title}.`,
            actionUrl: `/recruiter/jobs/${foundJob._id}`,
            isRead: false
        })
    } else {
        await jobService.deleteApplication({
            candidateId: user_id,
            jobId: job_id
        })
        foundJob.vacancies += 1
        await foundJob.save()
    }

    return res.status(foundApplication ? 200 : 201).json(
        new apiResponse(foundApplication ? 200 : 201, foundApplication ? "unapplied successfully" : "applied successfully", foundApplication ? { isApplied: false } : { isApplied: true })
    )
})

//delete job

const deleteJobPost = asyncHandler(async function (req, res) {
    const { job_id } = req.params
    const user_id = req.user._id
    const foundJob = await jobService.findJobById(job_id)
    if (!foundJob) {
        throw new apiError(400, "job does'nt exist")
    }
    const postedById = foundJob.postedBy?._id ? foundJob.postedBy._id.toString() : foundJob.postedBy.toString()
    if (postedById !== user_id.toString()) {
        throw new apiError(403, "you are not the owner of this job")
    }
    const deletedJob = await jobService.deleteJobPost(job_id)
    return res.status(200).json(
        new apiResponse(200, "job deleted successfully", deletedJob)
    )
})

//getMyJobs

const getMyJobs = asyncHandler(async function (req, res) {
    const user_id = req.user._id
    const foundJobs = await jobService.getMyJobs(user_id)
    if (!foundJobs) {
        throw new apiError(400, "you have not posted any jobs yet")
    }
    return res.status(200).json(
        new apiResponse(200, "jobs fetched successfully", foundJobs)
    )
})

//getJobApplicants(candidate list with name and avatar)(params: job_id)

const getJobApplicants = asyncHandler(async function (req, res) {
    const { job_id } = req.params
    const foundJob = await jobService.findJobById(job_id)
    if (!foundJob) {
        throw new apiError(400, "job does not exist")
    }
    // Implementation for fetching job applicants
    const applicants = await jobService.getJobApplicants(job_id)
    return res.status(200).json(
        new apiResponse(200, "applicants fetched successfully", applicants)
    )
})

const getMyApplications = asyncHandler(async function (req, res) {
    const userId = req.user._id

    const applications = await jobService.getMyApplications(userId)
    if (!applications) {
        throw new apiError(400, "could not fetch applications")
    }

    return res.status(200).json(
        new apiResponse(200, "applications fetched successfully", applications)
    )
})
//accept application(send notification to candidate)(params: applicationId)

const acceptApplication = asyncHandler(async function (req, res) {
    const { applicationId } = req.params
    const user_id = req.user._id
    const application = await jobService.findApplicationById(applicationId)

    if (!application) {
        throw new apiError(400, "application does not exist")
    }
    const foundJob = await jobService.findJobById(application.jobId)
    if (!foundJob) {
        throw new apiError(404, "job does not exist")
    }
    const postedById = foundJob.postedBy?._id ? foundJob.postedBy._id.toString() : foundJob.postedBy.toString()
    if (postedById !== user_id.toString()) {
        throw new apiError(403, "you are not the owner of this job")
    }
    if (application.status === "Accepted") {
        throw new apiError(400, "application is already accepted")
    }
    application.status = "Accepted"
    await application.save()

    const company = await companyModel.findById(application.companyId)

    await notificationModel.create({
        recipientId: application.candidateId, // The candidate
        type: "JOB_APPLICATION",
        title: "Application accepted",
        message: `you have been shortlisted / accepted as ${foundJob.title} for ${company.name} !!`,
        actionUrl: `/candidate/job/${foundJob._id}`,
        isRead: false
    })

    const user = await userModel.findById(application.candidateId)
    const recruiter = await userModel.findById(foundJob.postedBy)
    const emailHtml = `
      <div style="font-family: sans-serif; max-width: 550px; padding: 24px; border: 1px solid #f7d6d6; border-radius: 12px; background: #ffffff;">
        <h2 style="color: #e11d48; margin: 0 0 12px;">NexHire &bull; Application Accepted</h2>
        <p style="color: #334155; font-size: 15px; line-height: 1.5;">
          Hello <strong>${user?.name || "Candidate"}</strong>,
        </p>
        <p style="color: #334155; font-size: 15px; line-height: 1.5;">
          Your application for <strong>${foundJob.title}</strong> at <strong>${company?.name || "Company"}</strong> has been accepted by <strong>${recruiter?.name || "the Recruiter"}</strong>.
        </p>
        <p style="color: #334155; font-size: 15px; line-height: 1.5;">
          We will soon be conducting the interview. Best of luck!
        </p>
        <hr style="border: none; border-top: 1px solid #f7d6d6; margin: 20px 0;" />
        <p style="font-size: 12px; color: #94a3b8; margin: 0;">NexHire Recruitment Platform</p>
      </div>
    `
    if (user?.email) {
        sendEmail(
            user.email,
            "Job application status",
            `Your application for ${foundJob.title} at ${company?.name || "Company"} has been accepted by ${recruiter?.name || "the Recruiter"}. We will soon be conducting the interview.`,
            emailHtml
        )
    }

    return res.status(200).json(
        new apiResponse(200, "application accepted successfully", application)
    )
})

//reject application(params: applicationId)

const rejectApplication = asyncHandler(async function (req, res) {
    const { applicationId } = req.params
    const user_id = req.user._id
    const application = await jobService.findApplicationById(applicationId)
    if (!application) {
        throw new apiError(400, "application does not exist")
    }
    const foundJob = await jobService.findJobById(application.jobId)
    if (!foundJob) {
        throw new apiError(404, "job does not exist")
    }
    const postedById = foundJob.postedBy?._id ? foundJob.postedBy._id.toString() : foundJob.postedBy.toString()
    if (postedById !== user_id.toString()) {
        throw new apiError(403, "you are not the owner of this job")
    }
    if (application.status === "Rejected") {
        throw new apiError(400, "application is already rejected")
    }
    application.status = "Rejected"
    await application.save()

    return res.status(200).json(
        new apiResponse(200, "application rejected successfully", application)
    )
})

export default { createJobPost, getFeedJobs, getJobDetails, jobApplicationToggle, deleteJobPost, getMyJobs, getJobApplicants, getMyApplications, acceptApplication, rejectApplication }
