import express from 'express'
import notificationControllers from "../controllers/notification.controllers.js"
import authMiddleware from '../middlewares/auth.middleware.js'


const route = express.Router()

route.get("/all", authMiddleware, notificationControllers.getAllNotifications)
route.patch("/read-all", authMiddleware, notificationControllers.readAllNotifications)
route.get("/read-all", authMiddleware, notificationControllers.readAllNotifications)
route.delete("/delete-all", authMiddleware, notificationControllers.deleteAllNotification)
route.get("/read/:notification_id", authMiddleware, notificationControllers.readNotification)
route.patch("/read/:notification_id", authMiddleware, notificationControllers.readNotification)
route.delete("/delete/:notification_id", authMiddleware, notificationControllers.deleteNotification)

export default route
