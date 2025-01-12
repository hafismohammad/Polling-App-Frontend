import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { logout } from "../services/userService";
import { toast } from "react-toastify";
import { useState } from "react";

function Layouts() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    try {
      logout();
      toast.success("User logged out successfully.");
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <Navbar />
      <div className="flex h-screen bg-slate-200">
        <div
          className={`fixed top-16 left-0 h-[calc(100%-4rem)] w-64 bg-gray-800 text-white p-4 z-40 transform transition-transform duration-300 md:relative md:top-16 md:h-[calc(100%-4rem)] md:translate-x-0 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
       
          <Link
            to="/"
            className={`flex mt-5 items-center p-2 rounded-md transition ${
              isActive("/") ? "bg-slate-400 hover:bg-slate-500" : "hover:bg-gray-600"
            }`}
          >
            Polls
          </Link>
          <Link
            to="/chat"
            className={`flex mt-5 items-center p-2 rounded-md transition ${
              isActive("/chat") ? "bg-slate-400 hover:bg-slate-500" : "hover:bg-gray-600"
            }`}
          >
            Chats
          </Link>
          <button
            onClick={handleLogout}
            className="flex mt-5 items-center p-2 rounded-md transition bg-red-400 hover:bg-red-500"
          >
            Logout
          </button>
        </div>

        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

<div className="flex-1 p-4 overflow-y-auto relative pt-16">
  <button
    className="fixed top-15 left-6  text-purple-500 text-2xl p-4 rounded-full shadow-lg z-50 md:hidden"
    onClick={() => setSidebarOpen(true)}
    aria-label="Open Sidebar"
  >
    ☰
  </button>
  <Outlet />
</div>

      </div>
    </>
  );
}

export default Layouts;
