// In-memory item store and validation logic.
// Kept free of any web-framework code so it is easy to unit test.

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}

function validateNewItem(body) {
  if (body === null || typeof body !== "object" || Array.isArray(body)) {
    throw new ValidationError("Request body must be a JSON object.");
  }

  const { name, quantity } = body;

  if (typeof name !== "string" || name.trim() === "") {
    throw new ValidationError("'name' is required and must be a non-empty string.");
  }
  if (name.length > 100) {
    throw new ValidationError("'name' must be 100 characters or fewer.");
  }

  let qty = 1; // default
  if (quantity !== undefined) {
    if (!Number.isInteger(quantity) || quantity < 0) {
      throw new ValidationError("'quantity' must be a whole number that is 0 or greater.");
    }
    qty = quantity;
  }

  return { name: name.trim(), quantity: qty };
}

function createStore() {
  const items = new Map();
  let nextId = 1;

  return {
    list() {
      return Array.from(items.values());
    },
    get(id) {
      return items.get(id) || null;
    },
    create(body) {
      const { name, quantity } = validateNewItem(body);
      const item = {
        id: nextId++,
        name,
        quantity,
        createdAt: new Date().toISOString(),
      };
      items.set(item.id, item);
      return item;
    },
  };
}

module.exports = { createStore, validateNewItem, ValidationError };
