import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {toast} from "react-toastify"
import { signupService } from "../services/userService"
import { authContext } from "../context/AuthContext";

const SignUp = () => {
  const [data, setData] = useState({}); 
  const [errors, setErrors] = useState({}); 

  const navigate = useNavigate()
  const {setToken} = useContext(authContext)
  const handleChange = (e) => {
    setData({ ...data, [e.target.id]: e.target.value });
  };

  const validate = () => {
    let errors = {};
    if (!data.name) {
      errors.name = "Name is required";
    }
    if (!data.email) {
      errors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(data.email)) {
      errors.email = "Email is not valid";
    }
    if (!data.phone) {
      errors.phone = "Phone number is required";
    } else if (data.phone.length !== 10) {
      errors.phone = "Enter a valid 10-digit phone number";
    }
    
    if (!data.password) {
      errors.password = "Password is required";
    } else if (data.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    if (!data.cpassword) {
      errors.cpassword = "Confirm password is required";
    } else if (data.cpassword !== data.password) {
      errors.cpassword = "Passwords do not match";
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    try {
      if (validate()) {
        const response = await signupService(data);
        
        if(response.status === 200) {
          toast.success(response.data.message,{theme: 'colored'})
          setToken(response.data.token)
          navigate('/')
        }
      }
    } catch (error) {
      toast.error(error.message,{theme:"colored"});
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 shadow-md rounded-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-blue-500 mb-6">
          SignUp
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-  mb-1medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              placeholder="Enter name"
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="text"
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="phone"
              id="phone"
              placeholder="Enter mobile number "
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter password"
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              id="cpassword"
              placeholder="Enter confirm password"
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
            />
            {errors.cpassword && (
              <p className="text-red-500 text-sm mt-1">{errors.cpassword}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
          >
            SignUp
          </button>
          <p className="text-center mt-2">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500 hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
