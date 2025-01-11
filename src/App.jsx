import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserRoute from "./routes/UserRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import toast styles
import "./App.css";
import "./index.css";

function App() {
  return (
    <Router>
      {/* Your application routes */}
      <Routes>
        <Route path="/*" element={<UserRoute />} />
      </Routes>

      {/* Toast container for displaying notifications */}
      <ToastContainer
        position="top-right" // You can change the position as needed
        autoClose={3000} // Duration (in ms) before the toast disappears
        hideProgressBar={false} // Show or hide the progress bar
        newestOnTop={false} // Show newest toast on top
        closeOnClick // Close toast on click
        rtl={false} // Right-to-left support
        pauseOnFocusLoss // Pause timer on focus loss
        draggable // Allow toast dragging
        pauseOnHover // Pause toast timer on hover
        theme="light" // Light or dark theme
      />
    </Router>
  );
}

export default App;
