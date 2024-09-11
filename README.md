# Vercel Proxy App

This project is a simple proxy server designed to run on Vercel, primarily used to forward API requests to a specified target URL while handling CORS issues.

## Features

- Proxies API requests to a target URL
- Handles CORS (Cross-Origin Resource Sharing)
- Configurable for both development and production environments
- Logging for debugging purposes
- Error handling for proxy requests

## Prerequisites

- Node.js (>= 14.0.0)
- npm or yarn

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/Fog3211/nodejs-proxy.git
   cd nodejs-proxy
   ```

2. Install dependencies:
   ```
   yarn install
   ```

## Usage

### Development

To run the server locally with hot reloading:

```
npm run dev
```

The server will start on `http://localhost:3000` (or the port specified in your environment variables).

### Production

For production deployment on Vercel, simply push your changes to the connected Git repository. Vercel will automatically deploy your app.

## Configuration

- The target URL is set in `proxy.js`. Modify the `targetUrl` constant to change the destination of proxied requests.
- CORS is enabled by default and allows all origins (`