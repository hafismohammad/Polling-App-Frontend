import axios from "axios";

const axiosInstance = axios.create({
  baseURL: `https://polling-app.hpc.tw/api/poll`,
  // baseURL: `http://localhost:8000/api/poll`,

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

export const createPoll = async (question, options) => {
  try {
    const payload = { question, options };
    const response = await axiosInstance.post("/", payload);
    return response;
  } catch (error) {
    throw error.response.data.message;
  }
};

export const getpoll = async () => {
  try {
    const response = await axiosInstance.get("/");
    return response;
  } catch (error) {
    throw error.response.data.message;
  }
};

export const addVote = async (pollId, optionId) => {
  try {
    const response = await axiosInstance.post(`/${pollId}`, { optionId });
    return response;
  } catch (error) {
    throw error.response?.data?.message || "Failed to cast vote";
  }
};


export const removeCurrentPoll = async (pollId) => {
  try {
    const response = await axiosInstance.delete(`/${pollId}`);
    return response;
  } catch (error) {
    throw error.response.data.message;
  }
};

export const removeVote = async (pollId) => {
  try {
    const response = await axiosInstance.put(`/${pollId}`);
    return response;
  } catch (error) {
    throw error.response.data.message;
  }
}