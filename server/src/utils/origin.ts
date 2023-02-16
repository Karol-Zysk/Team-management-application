export const origin =
  process.env.NODE_ENV === 'production'
    ? 'https://sp-dashboard.netlify.app'
    : 'http://127.0.0.1:5173';
