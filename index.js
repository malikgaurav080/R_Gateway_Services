const express = require("express");
const dotenv = require("dotenv");

const expressProxy = require("express-http-proxy");
const app = express();
dotenv.config();

app.use("/user", expressProxy(process.env.User_SERVICE_URL));
app.use("/captain", expressProxy(process.env.Captain_SERVICE_URL));
app.use("/ride", expressProxy(process.env.Ride_SERVICE_URL));

// Health check endpoint for deployment monitoring
app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy", timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Gateway running on port ${PORT}`);
})
.on('error', (error) => {
  console.error('Error starting server:', error.message);
  process.exit(1);
});

// Graceful shutdown handling
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

function gracefulShutdown() {
  console.log('Received shutdown signal, closing server...');
  server.close(() => {
    console.log('Server closed successfully');
    process.exit(0);
  });
  
  // Force close after 10s if server hasn't closed gracefully
  setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
}
