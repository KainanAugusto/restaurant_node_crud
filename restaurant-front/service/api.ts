// service/api
import { Alerts } from "@/util/AlertsContainers";
import axios from "axios";
import Cookies from "js-cookie";
import router from "next/router";

const getApiInstance = () => {
    if (process.env.NODE_ENV === "development") {
        return axios.create({
            baseURL: "http://localhost:3000",
        });
    } else {
        return axios.create({
            baseURL: "https://site.com.br",
        });
    }
};


export const api = getApiInstance();
export const apiI = getApiInstance();

export const getUserDataCookie = async () => {
    return new Promise<any>((resolve, reject) => {
        try {
            const token = Cookies.get("token");

            if (!token) {
                reject(new Error(`No token found in cookies`));
                return;
            }

            resolve({ token });
        } catch (error: any) {
            reject(new Error(`Error fetching data from cookies: ${error.message}`));
        }
    });
};

apiI.interceptors.request.use(async (config) => {
    const userData = await getUserDataCookie();
    const token = userData.token;
    config.headers.Authorization = `Bearer ${token}`;
    return config;
});

apiI.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            router.push("/login");
        } else if (error.message === "No token found in cookies") {
            Alerts.warningLight("🚫 Você não possui credencial de acesso! 🪪");
            router.push("/login");
        }
        else {
            console.log(error);
        }

        return Promise.reject(error);
    },
);
