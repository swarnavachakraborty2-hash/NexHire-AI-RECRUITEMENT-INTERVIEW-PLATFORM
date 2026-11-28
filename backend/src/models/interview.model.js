import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema({
    // Practice interviews do not require a company or job.
    companyId: {//optional
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: function () { return this.mode === "recruitment"; }
    },
    jobId: {//optional
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
        required: function () { return this.mode === "recruitment"; }
    },
    candidateId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: function () { return this.mode === "practice"; }
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    mode: {
        type: String,
        enum: ["recruitment", "practice"],
        required: true
    },
    interviewType: {
        type: String,
        required: true,
        trim: true
    },
    difficulty: {
        type: String,
        trim: true
    },
    duration: {
        type: Number,
        required: true,
        min: 1
    },
    answerModes: {
        type: [String],
        default: []
    },
    status: {
        type: String,
        default: "draft",
        enum: ["draft", "ready", "inProgress", "finished"],
        trim: true
    },
    scheduledAt: {//optional
        type: Date
    }
}, {
    timestamps: true
});

interviewSchema.index({ companyId: 1, jobId: 1 });
interviewSchema.index({ candidateId: 1, mode: 1 });

const interviewModel = mongoose.model("Interview", interviewSchema);

export default interviewModel;
