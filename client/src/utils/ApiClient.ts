import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

export interface ApiResponse<T> {
  access_token: string;
  refreshToken: string;
  data?: T;
  error?: string;
}

export interface AuthResponse {
  access_token: string;
  refreshToken: string;
}

export const baseUrl =
  process.env.NODE_ENV === "production"
    ? "https://clock-app-uyb3.onrender.com/api/v1"
    : "http://127.0.0.1:4000/api/v1";

class ApiClient {
  private baseUrl: string;
  private accessToken: string | null;

  constructor() {
    this.baseUrl = baseUrl;
    this.accessToken = localStorage.getItem("access_token");
  }

  private async request<T>(config: AxiosRequestConfig): Promise<T> {
    try {
      const headers = config.headers || {};
      if (this.accessToken) {
        headers["Authorization"] = `Bearer ${this.accessToken}`;
      }
      const response = await axios.request<ApiResponse<T>>({
        ...config,
        headers,
        baseURL: this.baseUrl,
      });
      //@ts-ignore
      return response.data!;
    } catch (error: any) {
      const message = Array.isArray(error.response.data.message)
        ? error.response.data.message[0]
        : error.response.data.message || "Unknown error occurred";
      throw new Error(message);
    }
  }

  async get<T>(url: string, params?: any): Promise<T> {
    return this.request<T>({
      method: "get",
      url,
      params,
      baseURL: this.baseUrl,
    });
  }

  async post<T>(url: string, data?: any): Promise<T> {
    return this.request<T>({
      method: "post",
      url,
      data,
      baseURL: this.baseUrl,
    });
  }

  async patch<T>(url: string, data?: any): Promise<T> {
    return this.request<T>({
      method: "patch",
      url,
      data,
      baseURL: this.baseUrl,
    });
  }

  async delete<T>(url: string): Promise<T> {
    return this.request<T>({
      method: "delete",
      url,
      baseURL: this.baseUrl,
    });
  }
}

export default ApiClient;
