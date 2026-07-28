import axios, { AxiosInstance } from 'axios';
export interface ApiError {
  message: string;
  status?: number;
}

const axiosInstance: AxiosInstance = axios.create({
  baseURL: 'https://dummyjson.com',
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const toApiError = (error: unknown): ApiError => {
  if (__DEV__) console.warn('[api]', error);

  if (axios.isAxiosError(error)) {
    if (error.response) {
      // prefer the server's own message when it sends one
      const serverMessage = (error.response.data as { message?: string })
        ?.message;
      return {
        message:
          serverMessage ??
          `Request failed (${error.response.status}). Please try again.`,
        status: error.response.status,
      };
    }
    if (error.request) {
      return { message: 'Network error. Check your connection and try again.' };
    }
  }
  return { message: 'Something went wrong. Please try again.' };
};

axiosInstance.interceptors.response.use(
  response => response,
  error => Promise.reject(toApiError(error)),
);

export default axiosInstance;
