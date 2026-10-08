import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Clock,
  Ticket,
  Megaphone,
  Shield,
  ThumbsUp,
  Download,
  ArrowRight,
  Bell,
} from "lucide-react";

interface Notification {
  id: string;
  type: "reminder" | "ticket" | "event" | "security" | "welcome";
  title: string;
  description: string;
  timestamp: string;
  timeAgo: string;
  isRead: boolean;
  action?: {
    label: string;
    type: "link" | "button" | "dismiss";
    onClick?: () => void;
  }[];
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    type: "reminder",
    title: "Event Reminder: Spirituality in the Modern City starts in 2 hours",
    description:
      "Your session at the Grand Hall begins at 6:00 PM. Don't forget your digital ticket for scanning at the entrance.",
    timestamp: "2h ago",
    timeAgo: "2h ago",
    isRead: false,
    action: [
      { label: "View Details", type: "link" },
      { label: "Dismiss", type: "dismiss" },
    ],
  },
  {
    id: "2",
    type: "ticket",
    title: "Ticket Confirmed",
    description:
      "Your registration for 'Global Tech Ummah Summit' is successful. Transaction ID: #MS-88293.",
    timestamp: "5h ago",
    timeAgo: "5h ago",
    isRead: true,
    action: [{ label: "Download PDF", type: "button" }],
  },
  {
    id: "3",
    type: "event",
    title: "New Event: Global Tech Ummah Summit announced",
    description:
      "Join 500+ leaders in exploring the intersection of faith and technology. Early bird registrations now open.",
    timestamp: "Yesterday",
    timeAgo: "Yesterday",
    isRead: true,
    action: [{ label: "Learn More", type: "link" }],
  },
  {
    id: "4",
    type: "security",
    title: "Security Update",
    description:
      "Your password was successfully changed. If you did not perform this action, please contact support immediately.",
    timestamp: "Yesterday",
    timeAgo: "Yesterday",
    isRead: true,
  },
  {
    id: "5",
    type: "welcome",
    title: "Community Welcome",
    description:
      "Welcome to MSQUARED! Start by exploring events near you.",
    timestamp: "Oct 12, 2024",
    timeAgo: "Oct 12, 2024",
    isRead: true,
  },
];

const getIcon = (type: Notification["type"]) => {
  switch (type) {
    case "reminder":
      return Clock;
    case "ticket":
      return Ticket;
    case "event":
      return Megaphone;
    case "security":
      return Shield;
    case "welcome":
      return ThumbsUp;
    default:
      return Bell;
  }
};

const getIconBg = (type: Notification["type"]) => {
  switch (type) {
    case "reminder":
      return "bg-red-500/10";
    case "ticket":
      return "bg-secondary/10";
    case "event":
      return "bg-secondary/10";
    case "security":
      return "bg-secondary/10";
    case "welcome":
      return "bg-secondary/10";
    default:
      return "bg-secondary/10";
  }
};

const getIconColor = (type: Notification["type"]) => {
  switch (type) {
    case "reminder":
      return "text-red-400";
    case "ticket":
      return "text-secondary";
    case "event":
      return "text-secondary";
    case "security":
      return "text-secondary";
    case "welcome":
      return "text-secondary";
    default:
      return "text-secondary";
  }
};

const NotificationsPage = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const groupedNotifications = {
    today: notifications.filter((n) => n.timeAgo.includes("h ago")),
    yesterday: notifications.filter((n) => n.timeAgo === "Yesterday"),
    earlier: notifications.filter(
      (n) => !n.timeAgo.includes("h ago") && n.timeAgo !== "Yesterday"
    ),
  };

  return (
    <div className="w-full py-8">

      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-jakarta text-3xl md:text-4xl font-bold text-white mb-2">
            Notifications
          </h1>
          <p className="text-secondary text-sm">
            Stay updated with your community and events.
          </p>
        </div>
        <button
          onClick={markAllAsRead}
          className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
        >
          Mark all as read
        </button>
      </div>


      <div className="space-y-8">

        {groupedNotifications.today.length > 0 && (
          <div>
            <h2 className="text-[10px] uppercase tracking-[0.15em] font-semibold text-secondary mb-4">
              TODAY
            </h2>
            <div className="bg-[#131418] border border-secondary/10 rounded-xl divide-y divide-secondary/5">
              {groupedNotifications.today.map((notification) => {
                const Icon = getIcon(notification.type);
                return (
                  <div key={notification.id} className="p-5">
                    <div className="flex gap-4">

                      <div
                        className={`w-10 h-10 rounded-lg ${getIconBg(
                          notification.type
                        )} flex items-center justify-center flex-shrink-0 relative`}
                      >
                        <Icon size={18} className={getIconColor(notification.type)} />
                        {!notification.isRead && (
                          <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full" />
                        )}
                      </div>


                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <h3 className="text-white text-sm font-semibold">
                            {notification.title}
                          </h3>
                          <span className="text-secondary/40 text-xs whitespace-nowrap">
                            {notification.timestamp}
                          </span>
                        </div>
                        <p className="text-secondary text-sm mb-3">
                          {notification.description}
                        </p>
                        {notification.action && (
                          <div className="flex items-center gap-4">
                            {notification.action.map((action, idx) =>
                              action.type === "button" ? (
                                <button
                                  key={idx}
                                  onClick={action.onClick}
                                  className="flex items-center gap-1.5 bg-secondary/10 hover:bg-secondary/20 text-secondary text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                                >
                                  <Download size={12} />
                                  {action.label}
                                </button>
                              ) : action.type === "dismiss" ? (
                                <button
                                  key={idx}
                                  onClick={() => dismissNotification(notification.id)}
                                  className="text-secondary hover:text-white text-xs font-medium transition-colors"
                                >
                                  {action.label}
                                </button>
                              ) : (
                                <button
                                  key={idx}
                                  onClick={action.onClick}
                                  className="flex items-center gap-1 text-red-400 hover:text-red-300 text-xs font-medium transition-colors"
                                >
                                  {action.label}
                                  <ArrowRight size={10} />
                                </button>
                              )
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}


        {groupedNotifications.yesterday.length > 0 && (
          <div>
            <h2 className="text-[10px] uppercase tracking-[0.15em] font-semibold text-secondary mb-4">
              YESTERDAY
            </h2>
            <div className="bg-[#131418] border border-secondary/10 rounded-xl divide-y divide-secondary/5">
              {groupedNotifications.yesterday.map((notification) => {
                const Icon = getIcon(notification.type);
                return (
                  <div key={notification.id} className="p-5">
                    <div className="flex gap-4">
                      <div
                        className={`w-10 h-10 rounded-lg ${getIconBg(
                          notification.type
                        )} flex items-center justify-center flex-shrink-0`}
                      >
                        <Icon size={18} className={getIconColor(notification.type)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <h3 className="text-white text-sm font-semibold">
                            {notification.title}
                          </h3>
                          <span className="text-secondary/40 text-xs whitespace-nowrap">
                            {notification.timestamp}
                          </span>
                        </div>
                        <p className="text-secondary text-sm mb-3">
                          {notification.description}
                        </p>
                        {notification.action && (
                          <div className="flex items-center gap-4">
                            {notification.action.map((action, idx) => (
                              <button
                                key={idx}
                                onClick={action.onClick}
                                className="flex items-center gap-1 text-red-400 hover:text-red-300 text-xs font-medium transition-colors"
                              >
                                {action.label}
                                <ArrowRight size={10} />
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}


        {groupedNotifications.earlier.length > 0 && (
          <div>
            <h2 className="text-[10px] uppercase tracking-[0.15em] font-semibold text-secondary mb-4">
              EARLIER
            </h2>
            <div className="bg-[#131418] border border-secondary/10 rounded-xl divide-y divide-secondary/5">
              {groupedNotifications.earlier.map((notification) => {
                const Icon = getIcon(notification.type);
                return (
                  <div key={notification.id} className="p-5">
                    <div className="flex gap-4">
                      <div
                        className={`w-10 h-10 rounded-lg ${getIconBg(
                          notification.type
                        )} flex items-center justify-center flex-shrink-0`}
                      >
                        <Icon size={18} className={getIconColor(notification.type)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <h3 className="text-white text-sm font-semibold">
                            {notification.title}
                          </h3>
                          <span className="text-secondary/40 text-xs whitespace-nowrap">
                            {notification.timestamp}
                          </span>
                        </div>
                        <p className="text-secondary text-sm">
                          {notification.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}


        {notifications.length === 0 && (
          <div className="text-center py-20">
            <Bell size={40} className="text-secondary/30 mx-auto mb-4" />
            <h3 className="text-white text-lg font-semibold mb-1">
              No notifications yet
            </h3>
            <p className="text-secondary text-sm">
              You're all caught up! Check back later for updates.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
