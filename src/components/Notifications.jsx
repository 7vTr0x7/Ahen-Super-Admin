import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [notificationType, setNotificationType] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch notifications from the API using fetch
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://driving.shellcode.cloud/api/notifications/1"
      );
      const data = await response.json();
      if (data.message === "Notifications fetched successfully") {
        setNotifications(data.notifications);
        toast.success("Notifications loaded successfully!");
      } else {
        toast.error("Failed to load notifications");
      }
    } catch (error) {
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  // Create a new notification using fetch
  const createNotification = async () => {
    if (!notificationType || !content) {
      toast.error("Please fill in both fields: Notification Type and Content");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        "https://driving.shellcode.cloud/api/admin/notify-all",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            notification_type: notificationType,
            content: content,
          }),
        }
      );
      const result = await response.json();
      if (response.ok) {
        toast.success("Notification created successfully!");
        fetchNotifications(); // Refresh the notifications
        setNotificationType(""); // Clear notification type
        setContent(""); // Clear content
      } else {
        toast.error(result.message || "Failed to create notification");
      }
    } catch (error) {
      toast.error("Failed to create notification");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications(); // Fetch notifications when the component mounts
  }, []);

  return (
    <div className="container mx-auto p-6">
      <div className="space-y-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Notifications</h2>
          {/* <button
            onClick={createNotification}
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none"
          >
            {loading ? "Creating..." : "Create Notification"}
          </button> */}
        </div>

        <div className="rounded-lg bg-white p-4 shadow-md">
          <div className="space-y-4">
            {/* Notification Type Input */}
            <div>
              <label
                htmlFor="notification-type"
                className="block text-sm font-medium text-gray-700"
              >
                Notification Type
              </label>
              <input
                id="notification-type"
                type="text"
                value={notificationType}
                onChange={(e) => setNotificationType(e.target.value)}
                className="w-full rounded-md border border-gray-300 p-2"
                placeholder="e.g. offer, alert, update"
              />
            </div>

            {/* Content Input */}
            <div>
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-700"
              >
                Content
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full rounded-md border border-gray-300 p-2"
                rows="4"
                placeholder="Write the notification content"
              />
            </div>
          </div>

          <div className="mt-4">
            <button
              onClick={createNotification}
              className="w-full rounded-md bg-green-500 py-2 text-white hover:bg-green-600 focus:outline-none"
            >
              Create Notification
            </button>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-xl font-semibold">All Notifications</h3>
          {loading ? (
            <div className="text-center text-gray-500">Loading...</div>
          ) : (
            <div className="mt-4 space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="flex items-center justify-between rounded-lg border p-4 shadow-sm"
                >
                  <div>
                    <p className="font-semibold text-blue-600">
                      {notification.notification_type}
                    </p>
                    <p className="text-gray-700">{notification.content}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(notification.created_at).toLocaleString()}
                    </p>
                  </div>
                  {/* <button
                    onClick={() =>
                      toast("This is a notification action button")
                    }
                    className="text-blue-500 hover:text-blue-600"
                  >
                    Action
                  </button> */}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
