const { createApp } = require("./app");

const PORT = process.env.PORT || 8080;
const app = createApp();

const server = app.listen(PORT, () => {
  console.log(`items-api listening on port ${PORT}`);
});

// Shut down cleanly when Kubernetes sends SIGTERM (for example, during a rollout).
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down.");
  server.close(() => process.exit(0));
});
