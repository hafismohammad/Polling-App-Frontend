import axios from "axios";

const axiosInstance = new axios.create({
  // baseURL:  `https://polling-app.hpc.tw/api/user`,
  // baseURL:  `http://localhost:8000/api/user`,
  baseURL: `https://polling-app-backend-qvkg.onrender.com/api/user`,
  withCredentials: true
});

export const signupService = async (data) => {
  try {
    const response = await axiosInstance.post("/signup", data);
    localStorage.setItem("token", response.data.token);
    return response;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const loginService = async (data) => {
  try {
    const response = await axiosInstance.post("/login", data, {
      withCredentials: true,
    });
    localStorage.setItem("token", response.data.token);
    return response;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const logout = async () => {
  try {
    localStorage.clear("token");
  } catch (error) {
    console.error("An error occurred during logout:", error);
    throw error;
  }
};

export const getUser = async (token) => {
  try {
    const response = await axiosInstance.get(`/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("An error occurred while fetching user data:", error);
    throw error;
  }
};

