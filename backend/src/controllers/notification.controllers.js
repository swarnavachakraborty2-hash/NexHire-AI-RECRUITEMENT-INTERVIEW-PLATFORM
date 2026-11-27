import asyncHandler from "../utils/asynchandler.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import notificationService from "../services/notification.service.js";
import mongoose from "mongoose";

const getRecipientId = (req) => {
    const userId = req.user?._id;

    if (!userId) {
        throw new apiError(401, "Unauthorized: User not found");
    }

    return userId;
};

const getNotificationId = (req) => {
    const notificationId = req.params?.notification_id;

    if (!mongoose.isObjectIdOrHexString(notificationId)) {
        throw new apiError(400, "A valid notification_id is required");
    }

    return notificationId;
};

const getAllNotifications = asyncHandler(async function (req, res) {
    const recipientId = getRecipientId(req);
    const notifications = await notificationService.getAllNotifications(recipientId);

    return res.status(200).json(
        new apiResponse(200, "Notifications fetched successfully", notifications)
    );
});

const readNotification = asyncHandler(async function (req, res) {
    const recipientId = getRecipientId(req);
    const notificationId = getNotificationId(req);
    const notification = await notificationService.readNotification(notificationId, recipientId);

    if (!notification) {
        throw new apiError(404, "Notification not found");
    }

    return res.status(200).json(
        new apiResponse(200, "Notification marked as read", notification)
    );
});

const deleteNotification = asyncHandler(async function (req, res) {
    const recipientId = getRecipientId(req);
    const notificationId = getNotificationId(req);
    const notification = await notificationService.deleteNotification(notificationId, recipientId);

    if (!notification) {
        throw new apiError(404, "Notification not found");
    }

    return res.status(200).json(
        new apiResponse(200, "Notification deleted successfully", notification)
    );
});

const deleteAllNotification = asyncHandler(async function (req, res) {
    const recipientId = getRecipientId(req);
    const result = await notificationService.deleteAllNotification(recipientId);

    return res.status(200).json(
        new apiResponse(200, "Notifications deleted successfully", {
            deletedCount: result.deletedCount
        })
    );
});

const readAllNotifications = asyncHandler(async function (req, res) {
    const recipientId = getRecipientId(req);
    const result = await notificationService.readAllNotifications(recipientId);

    return res.status(200).json(
        new apiResponse(200, "Notifications marked as read", {
            modifiedCount: result.modifiedCount
        })
    );
});

export default {
    getAllNotifications,
    readNotification,
    readAllNotifications,
    deleteAllNotification,
    deleteNotification
};
