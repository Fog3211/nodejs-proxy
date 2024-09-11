import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import cors from "cors";

const app = express();

const isDevelopment = process.env.NODE_ENV !== "production";

// Enable CORS
app.use(cors());

const targetUrl = "https://shop.huanghanlian.com";

// Configure proxy
const setupProxy = (targetUrl) => {
  return createProxyMiddleware({
    target: targetUrl,
    changeOrigin: true,
    onProxyRes: (proxyRes, req, res) => {
      // Preserve original response headers
      Object.keys(proxyRes.headers).forEach((key) => {
        res.setHeader(key, proxyRes.headers[key]);
      });
      // Ensure CORS header is present
      res.setHeader("Access-Control-Allow-Origin", "*");
    },
    onError: (err, req, res) => {
      console.error("Proxy error:", err);
      res.status(500).json({
        error: "Proxy Error",
        message: err.message
      });
    },
    // Add logging for debugging
    logLevel: isDevelopment ? "debug" : "info",
    onProxyReq: (proxyReq, req, res) => {
      console.log("Proxying:", req.method, req.url, "->", targetUrl + proxyReq.path);
    }
  });
};

// Handle only /api routes
app.use("/api", setupProxy(targetUrl));

// Add the following code for local debugging
if (isDevelopment) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Proxy server is running on http://localhost:${PORT}`);
    console.log("API routes are being proxied to", targetUrl);
    console.log("Hot reloading is enabled. The server will restart on file changes.");
  });
}

// Export app for Vercel
export default app;