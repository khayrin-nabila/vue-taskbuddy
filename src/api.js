import axios from 'axios';
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/userStore";

const router = useRouter();
const userStore = useUserStore();

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // Use the environment variable
  withCredentials: true,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const userStore = useUserStore();
      userStore.logout();
      router.push("/");
    }
    return Promise.reject(error);
  }
);

export default api;