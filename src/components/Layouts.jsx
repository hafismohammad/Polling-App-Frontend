import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { logout } from "../services/userService";
import { toast } from "react-toastify";

function Layouts() {
  const location = useLocation();
  const navigate = useNavigate();

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
        <div className="w-64 mt-16 bg-gray-700 text-white p-4">
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

        {/* Main Content */}
        <div className="flex-1 p-4 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default Layouts;
