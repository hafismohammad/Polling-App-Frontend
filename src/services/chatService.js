import axios from "axios";

const axiosInstance = axios.create({
  baseURL: `https://polling-app-backend-qvkg.onrender.com`,
  // baseURL: `http://localhost:8000/api/chat`,
  // baseURL: `https://polling-app.hpc.tw/api/chat`,


});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const getAllMessages = async (token) => {
  try {
    const response = await axiosInstance.get("/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    throw error.response.data.message;
  }
};

export const getAllNotification = async (token) => {
  try {
    const response = await axiosInstance.get("/notifications", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Fetched Notifications:", response.data);

    return response;
  } catch (error) {
    throw error.response.data.message;
  }
};

export const clearNotifications = async (token) => {
  try {
    const response = await axiosInstance.delete("/clearNotifications", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("response", response.data);

    return response;
  } catch (error) {
    throw error.response.data.message;
  }
};
