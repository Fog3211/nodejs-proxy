import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import cors from "cors";

const app = express();

const isDevelopment = process.env.NODE_ENV !== "production";

// Enable CORS
app.use(cors());

// Default target URL
const DEFAULT_TARGET_URL = "https://shop.huanghanlian.com";

// Configure proxy
const setupProxy = (req, res, next) => {
  // Get target URL from query parameter or use default
  /**
   * support query parameter: target
   * example: http://localhost:3000/api/common/OneFilm?target=https://api.oioweb.cn/api/common/OneFilm
   */
  const targetUrl = req.query.target || DEFAULT_TARGET_URL;

  // Validate target URL
  if (!isValidUrl(targetUrl)) {
    return res.status(400).json({
      error: "Invalid Target URL",
      message: "The provided target URL is not valid."
    });
  }

  const proxyMiddleware = createProxyMiddleware({
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

  // Call the proxy middleware
  return proxyMiddleware(req, res, next);
};

// Handle only /api routes
app.use("/api", setupProxy);

// URL validation helper function
function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

// Add the following code for local debugging
if (isDevelopment) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Proxy server is running on http://localhost:${PORT}`);
    console.log("API routes are ready to be proxied");
    console.log("Hot reloading is enabled. The server will restart on file changes.");
  });
}

// Export app for Vercel
export default app;