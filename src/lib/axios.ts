import Axios from "axios";

export const axios = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  withCredentials: true,
});

axios.interceptors.request.use(
  (config) => {
    const token = window.localStorage.getItem("accessToken");

    config.headers = config.headers || {};

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null) => {
  failedQueue.forEach((promise) => {
    if (token) {
      promise.resolve(token);
    } else {
      promise.reject(error);
    }
  });
  failedQueue = [];
};

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axios(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = window.localStorage.getItem("refreshToken");
        if (!refreshToken) {
          throw new Error("리프레시 토큰이 로컬스토리지에 없습니다.");
        }

        const { data } = await axios.get("/auth/reissue", {
          params: { REFRESH_TOKEN: refreshToken },
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (data?.isSuccess && data.results) {
          const newAccessToken = data.results.accessToken;
          const newRefreshToken = data.results.refreshToken;

          if (newAccessToken) {
            window.localStorage.setItem("accessToken", newAccessToken);
          }

          if (newRefreshToken) {
            window.localStorage.setItem("refreshToken", newRefreshToken);
          }

          processQueue(null, newAccessToken);

          isRefreshing = false;

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axios(originalRequest);
        } else {
          throw new Error("새로운 토큰을 받아오는 데 실패했습니다.");
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;

        window.localStorage.removeItem("accessToken");
        window.localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
