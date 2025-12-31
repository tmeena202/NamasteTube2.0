import { useDispatch, useSelector } from "react-redux";
import { markAsRead, clearNotifications } from "../utils/notificationSlice";

const NotificationPanel = () => {
  const dispatch = useDispatch();

  const notifications = useSelector((store) => store.notifications.list);
  const isLoading = useSelector((store) => store.notifications.isLoading);

  return (
    <div className="absolute right-0 mt-3 w-96 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
      {/* HEADER */}
      <div className="flex items-center justify-between px-4 py-2 border-b bg-gray-50">
        <h2 className="font-semibold text-sm text-gray-800">Notifications</h2>
        <button
          className="text-xs text-blue-600 hover:underline"
          onClick={() => dispatch(clearNotifications())}
        >
          Clear all
        </button>
      </div>

      {/* BODY */}
      <div className="max-h-[420px] overflow-y-auto">
        {/* 🔄 LOADING UI */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center h-40 gap-3 text-gray-500 text-sm">
            <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
            Loading notifications...
          </div>
        )}

        {/* 📭 EMPTY STATE */}
        {!isLoading && notifications.length === 0 && (
          <div className="flex items-center justify-center h-40 text-gray-500 text-sm">
            No notifications
          </div>
        )}

        {/* 📩 NOTIFICATIONS */}
        {!isLoading &&
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => dispatch(markAsRead(n.id))}
              className={`flex gap-3 px-4 py-3 cursor-pointer border-b last:border-b-0
                ${n.isRead ? "bg-white" : "bg-blue-50"}
                hover:bg-gray-100`}
            >
              {/* THUMBNAIL */}
              <img
                src={`https://i.ytimg.com/vi/${n.id}/hqdefault.jpg`}
                alt="video thumbnail"
                className="w-16 h-10 rounded object-cover flex-shrink-0"
              />

              {/* TEXT */}
              <div className="text-sm text-gray-800 leading-snug">{n.text}</div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default NotificationPanel;
