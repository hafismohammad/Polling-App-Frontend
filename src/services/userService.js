import axios from "axios";

// baseURL:  `https://polling-app.hpc.tw/api/user`,
const axiosInstance = new axios.create({
  baseURL:  `http://localhost:8000/api/user`,

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
    const response = await axiosInstance.post("/login", data);
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
