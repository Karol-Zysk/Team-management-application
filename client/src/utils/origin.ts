export const origin =
  process.env.NODE_ENV === "production"
    ? "https://sp-dashboard.netlify.app"
    : "http://127.0.0.1:5173";

export const baseUrl =
  process.env.NODE_ENV === "production"
    ? "https://clock-app-uyb3.onrender.com/api/v1"
    : "http://127.0.0.1:4000/api/v1";
