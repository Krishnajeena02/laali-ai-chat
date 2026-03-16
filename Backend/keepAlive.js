const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3001";

export const startKeepAlive = () => {
  setInterval(async () => {
    try {
      await fetch(`${BACKEND_URL}/health`);
      console.log("Keep-alive ping sent");
    } catch (err) {
      console.log("Keep-alive failed:", err.message);
    }
  }, 14 * 60 * 1000);
};