import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserRoute from "./routes/UserRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 
import "./App.css";
import "./index.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/*" element={<UserRoute />} />
      </Routes>

      <ToastContainer
        position="top-right" 
        autoClose={3000} 
        hideProgressBar={false}
        newestOnTop={false} 
        closeOnClick 
        rtl={false} 
        pauseOnFocusLoss
        draggable 
        pauseOnHover 
        theme="light" 
      />
    </Router>
  );
}

export default App;
