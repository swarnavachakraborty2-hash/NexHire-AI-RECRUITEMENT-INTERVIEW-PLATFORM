import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api, { asyncHandler } from '../api/axios'

function formatNotificationTime(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return ''
  const diffMs = Date.now() - date.getTime()
  const diffMinutes = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMinutes < 1) return 'Just now'
  if (diffMinutes < 60) return `${diffMinutes}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function NotificationModal({
  notifications: initialNotifications = [],
  isOpen = true,
  onClose,
  setNotifications: setParentNotifications,
}) {
  const [localNotifications, setLocalNotifications] = useState(null)
  const navigate = useNavigate()

  const notifications = localNotifications ?? initialNotifications

  const updateNotifications = (updater) => {
    setLocalNotifications((prev) => {
      const current = prev ?? initialNotifications
      const next = typeof updater === 'function' ? updater(current) : updater
      if (typeof setParentNotifications === 'function') {
        setParentNotifications(next)
      }
      return next
    })
  }

  // Delete single notification
  const onDeleteNotification = (id, e) => {
    if (e) e.stopPropagation()
    try {
      asyncHandler(async function () {
        await api.delete(`/notification/delete/${id}`)
        updateNotifications((prev) =>
          prev.filter((n) => n._id?.toString() !== id?.toString())
        )
      })
    } catch (err) {
      console.log('failed to delete notification: ', err?.response?.data?.message || err?.message)
    }
  }

  // Click on notification: mark as read and navigate to actionUrl
  const onclickNotification = (notification) => {
    const id = notification._id
    try {
      asyncHandler(async function () {
        if (!notification.isRead) {
          await api.get(`/notification/read/${id}`)
          updateNotifications((prev) =>
            prev.map((item) =>
              item._id?.toString() === id?.toString()
                ? { ...item, isRead: true }
                : item
            )
          )
        }
        if (notification.actionUrl) {
          if (onClose) onClose()
          navigate(notification.actionUrl)
        }
      })
    } catch (err) {
      console.log('failed to read notification: ', err?.response?.data?.message || err?.message)
    }
  }

  // Read all notifications
  const onreadAllNotifications = () => {
    try {
      asyncHandler(async function () {
        try {
          await api.patch('/notification/read-all')
        } catch {
          await api.get('/notification/read-all')
        }
        updateNotifications((prev) =>
          prev.map((item) => ({ ...item, isRead: true }))
        )
      })
    } catch (err) {
      console.log('failed to read all notification: ', err?.response?.data?.message || err?.message)
    }
  }

  // Delete all notifications
  const onDeleteAllNotifications = () => {
    try {
      asyncHandler(async function () {
        await api.delete('/notification/delete-all')
        updateNotifications([])
      })
    } catch (err) {
      console.log('failed to delete all notification: ', err?.response?.data?.message || err?.message)
    }
  }

  if (!isOpen) return null

  const unreadCount = notifications.filter((n) => !n.isRead).length

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl border border-[#f7d6d6] shadow-xl w-full max-w-lg max-h-[82vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#f7d6d6] flex items-center justify-between gap-3 bg-[#fff9f9]">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-sm">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-600 text-white">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500">
                {notifications.length} {notifications.length === 1 ? 'notification' : 'notifications'} total
              </p>
            </div>
          </div>

          {/* Action Buttons: Read All, Delete All, Close */}
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={onreadAllNotifications}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition cursor-pointer flex items-center gap-1 shadow-2xs"
                title="Mark all notifications as read"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span>Read All</span>
              </button>
            )}

            {notifications.length > 0 && (
              <button
                type="button"
                onClick={onDeleteAllNotifications}
                className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 transition cursor-pointer"
                title="Clear all notifications"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}

            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer ml-1"
                title="Close modal"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="overflow-y-auto divide-y divide-slate-100 flex-1">
          {notifications.length === 0 ? (
            <div className="p-10 text-center">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 text-rose-500 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h4 className="font-bold text-slate-800 text-sm">No notifications yet</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                You're all caught up! New updates regarding applications and interviews will appear here.
              </p>
            </div>
          ) : (
            notifications.map((notif) => {
              const isUnread = !notif.isRead
              return (
                <div
                  key={notif._id}
                  onClick={() => onclickNotification(notif)}
                  className={`p-4 flex items-start justify-between gap-3 transition cursor-pointer group ${
                    isUnread
                      ? 'bg-rose-50/40 hover:bg-rose-50/70'
                      : 'hover:bg-slate-50/80 bg-white'
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    {/* Status dot */}
                    <span
                      className={`w-2 h-2 rounded-full mt-1.5 shrink-0 transition-colors ${
                        isUnread ? 'bg-rose-600' : 'bg-slate-200'
                      }`}
                    />

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4
                          className={`text-xs sm:text-sm leading-snug ${
                            isUnread ? 'font-bold text-slate-900' : 'font-medium text-slate-700'
                          }`}
                        >
                          {notif.title || 'Notification'}
                        </h4>
                        {isUnread && (
                          <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded-md bg-rose-100 text-rose-700">
                            Unread
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-600 mt-0.5 leading-relaxed break-words">
                        {notif.message}
                      </p>

                      <div className="flex items-center gap-2 mt-1.5 text-[10px] text-slate-400">
                        <span>{formatNotificationTime(notif.createdAt)}</span>
                        {notif.actionUrl && (
                          <>
                            <span>&bull;</span>
                            <span className="text-rose-600 font-semibold group-hover:underline">
                              View details &rarr;
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Single Delete Button: small delete icon */}
                  <button
                    type="button"
                    onClick={(e) => onDeleteNotification(notif._id, e)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer shrink-0"
                    title="Delete notification"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}

export default NotificationModal
