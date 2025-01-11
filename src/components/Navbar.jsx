import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons'; 
import { useContext, useEffect, useState } from 'react'; 
import { getUser } from '../services/userService';
import { authContext } from '../context/AuthContext';
import useSocket from '../hooks/useSocket';
import { getAllNotification } from '../services/chatService';

function Navbar() {
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const { token } = useContext(authContext); 
  const socket = useSocket("http://localhost:8000")


  useEffect(() => {
    if(socket) {
      socket.on('sendNotification', (userName, messages) => {
        console.log('sendNotification',userName, messages);
        
      })
    }
  },[token])

  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await getUser(token);
        setUser(response.user.name); 
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };
    if (token) {
      getUserData();
    }
  }, [token]);

  const toggleSidebar = async () => {
    setIsSidebarOpen((prevState) => !prevState);
    try {
      const response = await getAllNotification(token)
      console.log('response notify',response);
      
    } catch (error) {
      console.log('Error while fetching notification', error);
      
    }
  };


  return (
    <div className="bg-purple-600 w-full top-0 text-white fixed z-50 shadow-md">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <div className="flex items-center space-x-2">
          <h1 className="font-bold text-lg">Logo</h1>
        </div>

        <div className="flex items-center space-x-10 ml-auto">
          <div className="relative cursor-pointer">
            <FontAwesomeIcon onClick={toggleSidebar} icon={faBell} className="text-2xl" />
          </div>

          <div className="flex items-center space-x-2 cursor-pointer">
            <FontAwesomeIcon icon={faUser} className="text-2xl mb-1" />
            {user && <h2>{user}</h2>} 
          </div>
        </div>
      </div>

      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-md transform ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 z-50`}
      >
        <div className="p-4">
          <h2 className="font-bold text-lg">Notifications</h2>
          <button
            onClick={toggleSidebar}
            className="text-red-500 font-bold absolute top-4 right-4"
          >
            Close
          </button>
          <ul className="mt-4 space-y-2">
            <li className="p-2 border-b">Notification 1</li>
            <li className="p-2 border-b">Notification 2</li>
            <li className="p-2 border-b">Notification 3</li>
          </ul>
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
