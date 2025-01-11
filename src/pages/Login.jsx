import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { authContext } from "../context/AuthContext";
import { loginService } from "../services/userService";

function Login() {
  const [data, setData] = useState({});
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const { setToken } = useContext(authContext);
  const handleChange = (e) => {
    setData({ ...data, [e.target.id]: e.target.value });
  };

  const validate = () => {
    let errors = {};
    if (!data.email) {
      errors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(data.email)) {
      errors.email = "Email not valid";
    }
    if (!data.password) {
      errors.password = "Password is required";
    } else if (data.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (validate()) {
        const response = await loginService(data);

        if (response.status === 200) {
          toast.success(response.data.message, { theme: "colored" });
          setToken(response.data.token);
          navigate("/");
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed", {
        theme: "colored",
      });
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 shadow-md rounded-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-blue-500">Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="text"
              name="email"
              id="email"
              placeholder="Enter email"
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>
          <div className="mb-4">
            <label>Password</label>
            <input
              type="text"
              name="password"
              id="password"
              placeholder="Enter password"
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
            />
              {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
          >
            Login
          </button>
          <p className="text-center mt-2">
            Not have an account?{" "}
            <Link to="/signup" className="text-blue-500 hover:underline">
              SingUp
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
