import notificationRepository from "../repository/notification.repository.js";

const getAllNotifications = async (recipientId) => {
    const notifications = await notificationRepository.getAllNotifications(recipientId);
    return notifications;
};

const readNotification = async (notificationId, recipientId) => {
    const notification = await notificationRepository.readNotification(notificationId, recipientId);
    return notification;
};

const deleteNotification = async (notificationId, recipientId) => {
    const notification = await notificationRepository.deleteNotification(notificationId, recipientId);
    return notification;
};

const deleteAllNotification = async (recipientId) => {
    const result = await notificationRepository.deleteAllNotification(recipientId);
    return result;
};

const readAllNotifications = async (recipientId) => {
    const result = await notificationRepository.readAllNotifications(recipientId);
    return result;
};

export default {
    getAllNotifications,
    readNotification,
    readAllNotifications,
    deleteNotification,
    deleteAllNotification
};
