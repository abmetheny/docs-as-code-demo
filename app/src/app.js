const express = require("express");
const { createStore, ValidationError } = require("./store");
const { version } = require("../package.json");

function createApp(store = createStore()) {
  const app = express();
  app.use(express.json());

  // Health check: used by Kubernetes liveness and readiness probes.
  app.get("/health", (req, res) => {
    res.json({ status: "ok", version });
  });

  // List all items.
  app.get("/items", (req, res) => {
    res.json(store.list());
  });

  // Get one item by id.
  app.get("/items/:id", (req, res) => {
    const id = Number(req.params.id);
    const item = Number.isInteger(id) ? store.get(id) : null;
    if (!item) {
      return res.status(404).json({
        error: { code: "NOT_FOUND", message: `No item with id '${req.params.id}'.` },
      });
    }
    res.json(item);
  });

  // Create an item.
  app.post("/items", (req, res) => {
    try {
      const item = store.create(req.body);
      res.status(201).json(item);
    } catch (err) {
      if (err instanceof ValidationError) {
        return res.status(400).json({
          error: { code: "INVALID_REQUEST", message: err.message },
        });
      }
      throw err;
    }
  });

  // Malformed JSON bodies and other unexpected errors.
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    if (err.type === "entity.parse.failed") {
      return res.status(400).json({
        error: { code: "INVALID_JSON", message: "Request body is not valid JSON." },
      });
    }
    console.error(err);
    res.status(500).json({
      error: { code: "INTERNAL_ERROR", message: "Something went wrong." },
    });
  });

  return app;
}

module.exports = { createApp };
