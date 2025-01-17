import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faUser } from "@fortawesome/free-solid-svg-icons";
import { useContext, useEffect, useState } from "react";
import { getUser } from "../services/userService";
import { authContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import { clearNotifications, getAllNotification,} from "../services/chatService";
import useSocket from "../hooks/useSocket";
import Logo from "../../src/assets/logo.png"

function Navbar() {
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const { token } = useContext(authContext);
  // const socket = useSocket('http://localhost:8000');
  const socket = useSocket('https://polling-app.hpc.tw');


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getUser(token);
        setUser(response.user);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    if (token) {
      fetchUser();
    }
  }, [token]);

  const toggleSidebar = async () => {
    setIsSidebarOpen((prevState) => !prevState);
    if (!isSidebarOpen) {
      try {
        const response = await getAllNotification(token);

        const allNotifications = response.data.AllNotificaitons || [];

        const filteredNotifications = allNotifications.filter(
          (notification) => notification.senderId !== user?.id
        );

        setNotifications(filteredNotifications);
      } catch (error) {
        console.error("Error while fetching notifications:", error);
      }
    }
  };

  const handleClearNotifications = async () => {
    try {
      const response = await clearNotifications(token);
      if (response.status === 200) {
        toast.success(response.data.message);
      }
      setNotifications([]);
    } catch (error) {
      console.error("Error while clearing notifications:", error);
    }
  };

  useEffect(() => {
    if (socket) {
      socket.on("sendNotification", (data) => {
        const { userName, message, receiverId } = data;

        if (user && receiverId === user.id) {
          toast.info(
            <div>
              <strong>New Notification</strong>
              <p>{`${userName}: ${message}`}</p>
            </div>
          );

          setNotifications((prevNotifications) => [...prevNotifications, data]);
        }
      });
    }

    return () => {
      if (socket) {
        socket.off("sendNotification");
      }
    };
  }, [socket, user]);

  const handleAccount = async () => {};

  return (
    <div className="bg-purple-600 w-full top-0 text-white fixed z-50 shadow-md">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <div className="flex items-center space-x-2">
          <img className="h-20 w-full " src={Logo} alt="logo" />
        </div>

        <div className="flex items-center space-x-10 ml-auto">
          <div className="relative cursor-pointer">
            <FontAwesomeIcon
              onClick={toggleSidebar}
              icon={faBell}
              className="lg:text-2xl"
            />
            {notifications.filter(
              (notification) => notification.receiverId === user?.id
            ).length > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-600 rounded-full">
                {
                  notifications.filter(
                    (notification) => notification.receiverId === user?.id
                  ).length
                }
              </span>
            )}
          </div>

          <div
            onClick={handleAccount}
            className="flex items-center space-x-2 cursor-pointer bg-gray-950 px-4 py-2 rounded-2xl"
          >
            <FontAwesomeIcon icon={faUser} className="mb-1 lg:text-2xl" />
            {user && <h2>{user.name}</h2>}
          </div>
        </div>
      </div>

      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-md transform ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 z-50`}
      >
        <div className="p-4 h-full relative">
          <h2 className="font-bold text-lg text-purple-600">Notifications</h2>
          <button
            onClick={toggleSidebar}
            className="text-red-500 font-bold absolute top-4 right-4"
          >
            Close
          </button>
          <ul className="mt-4 space-y-2 overflow-y-auto max-h-[calc(100%-4rem)]">
            {notifications.length > 0 ? (
              [
                ...new Map(
                  notifications
                    .filter(
                      (notification) => notification.receiverId === user?.id
                    )
                    .map((notification) => [notification._id, notification])
                ).values(),
              ].map((notification, index) => (
                <li key={index} className="p-2 border-b text-gray-800">
                  <div>
                    <p className="font-medium">{notification.senderName}</p>
                    <p className="text-sm">{notification.message}</p>
                  </div>
                  <span className="text-gray-500 text-xs">
                    {new Date(notification.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </li>
              ))
            ) : (
              <li className="p-2 text-gray-500">No notifications available</li>
            )}
          </ul>

          {notifications.length > 0 && (
            <div className="absolute bottom-4 left-0 w-full px-4">
              <button
                onClick={handleClearNotifications}
                className="w-full py-2 text-center text-white bg-red-500 rounded hover:bg-red-600 transition"
              >
                Clear All
              </button>
            </div>
          )}
        </div>
      </div>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
}

export default Navbar;
