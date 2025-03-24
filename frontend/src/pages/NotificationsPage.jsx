"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { axiosInstance } from "../lib/axios"
import { toast } from "react-hot-toast"
import { Bell, Check, ExternalLink, Eye, MessageSquare, ThumbsUp, Trash2, UserPlus } from "lucide-react"
import { Link } from "react-router-dom"
import Sidebar from "../components/Sidebar"
import { formatDistanceToNow } from "date-fns"
import { useState } from "react"

const NotificationsPage = () => {
  const { data: authUser } = useQuery({ queryKey: ["authUser"] })
  const queryClient = useQueryClient()
  const [filter, setFilter] = useState("all")

  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => axiosInstance.get("/notifications"),
  })

  const { mutate: markAsReadMutation } = useMutation({
    mutationFn: (id) => axiosInstance.put(`/notifications/${id}/read`),
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"])
    },
  })

  const { mutate: markAllAsReadMutation } = useMutation({
    mutationFn: async () => {
      const unreadNotifications = notifications.data.filter((n) => !n.read)
      await Promise.all(unreadNotifications.map((n) => axiosInstance.put(`/notifications/${n._id}/read`)))
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"])
      toast.success("All notifications marked as read")
    },
  })

  const { mutate: deleteNotificationMutation } = useMutation({
    mutationFn: (id) => axiosInstance.delete(`/notifications/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"])
      toast.success("Notification removed", {
        icon: "🗑️",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      })
    },
  })

  const renderNotificationIcon = (type) => {
    switch (type) {
      case "like":





        return <ThumbsUp className="text-pink-500" size={20} />
      case "comment":





        return <MessageSquare className="text-green-500" size={20} />
      case "connectionAccepted":





        return <UserPlus className="text-purple-500" size={20} />
      default:
        return null
    }
  }

  const renderNotificationContent = (notification) => {
    const userName = notification.relatedUser.name

    switch (notification.type) {
      case "like":





        return `${userName} liked your post`
      case "comment":





        return `${userName} commented on your post`
      case "connectionAccepted":





        return `${userName} accepted your connection request`
      default:
        return null
    }
  }
























  const filteredNotifications = notifications?.data.filter((notification) => {
    if (filter === "all") return true
    if (filter === "unread") return !notification.read
    return notification.type === filter
  })

  const unreadCount = notifications?.data.filter((n) => !n.read).length || 0
  const hasUnread = unreadCount > 0

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
      <div className="col-span-1 lg:col-span-1">
        <Sidebar user={authUser} />
      </div>
      <div className="col-span-1 lg:col-span-3">


        <div className="bg-white dark:bg-surface-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Bell size={24} className="text-brand-500 mr-3" />
              <h1 className="text-2xl font-bold">Notifications</h1>
              {hasUnread && (
                <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">{unreadCount} new</span>
              )}
            </div>


            <div className="flex items-center gap-3">
              {hasUnread && (


                <button onClick={() => markAllAsReadMutation()} className="btn-secondary flex items-center">
                  <Check size={16} className="mr-2" />
                  Mark all as read
                </button>
              )}



















              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="form-select rounded-lg border-surface-200"
              >
                <option value="all">All notifications</option>
                <option value="unread">Unread</option>
                <option value="like">Likes</option>
                <option value="comment">Comments</option>
                <option value="connectionAccepted">Connections</option>
              </select>
            </div>
          </div>

          {isLoading ? (



            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
            </div>
          ) : filteredNotifications && filteredNotifications.length > 0 ? (

            <div className="space-y-4">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification._id}


                  className={`flex items-center p-4 rounded-lg ${
                    !notification.read ? "bg-surface-50 dark:bg-surface-700" : "bg-white dark:bg-surface-800"
                  }`}
                >























                  <img
                    src={notification.relatedUser.profilePicture || "/avatar.png"}
                    alt=""
                    className="w-10 h-10 rounded-full mr-4"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-full bg-surface-100 dark:bg-surface-700">
                        {renderNotificationIcon(notification.type)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-surface-900 dark:text-surface-100">
                          {renderNotificationContent(notification)}
                        </p>
                        <p className="text-xs text-surface-500">
                          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                    </div>











                  </div>
                  <div className="flex items-center gap-2">
                    {!notification.read && (
                      <button


                        onClick={() => markAsReadMutation(notification._id)}
                        className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-full"
                      >


                        <Eye size={18} className="text-surface-500" />
                      </button>

                    )}
                    <button
                      onClick={() => deleteNotificationMutation(notification._id)}
                      className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-full"
                    >
                      <Trash2 size={18} className="text-red-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (















            <div className="text-center py-8">
              <Bell size={40} className="mx-auto text-surface-400 mb-4" />
              <p className="text-surface-600">No notifications found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default NotificationsPage

