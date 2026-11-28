import express from "express";
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true
}));

// Routes
import userRoutes from "./routes/user.routes.js";
import companyRoutes from "./routes/company.routes.js";
import jobRoutes from "./routes/job.routes.js";
import candidateRoutes from "./routes/candidate.routes.js"
import notificationRoutes from "./routes/notification.routes.js"
import interviewRoutes from "./routes/interview.routes.js"

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/company", companyRoutes);
app.use("/api/v1/job", jobRoutes);
app.use("/api/v1/jobs", jobRoutes);
app.use("/api/v1/candidate", candidateRoutes);
app.use("/api/v1/notification", notificationRoutes);
app.use("/api/v1/interview", interviewRoutes);

export default app;
