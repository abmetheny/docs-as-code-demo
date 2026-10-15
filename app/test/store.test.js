const test = require("node:test");
const assert = require("node:assert/strict");
const { createStore, validateNewItem, ValidationError } = require("../src/store");

test("validateNewItem trims the name and defaults quantity to 1", () => {
  assert.deepEqual(validateNewItem({ name: "  Lantern " }), { name: "Lantern", quantity: 1 });
});

test("validateNewItem rejects a missing or blank name", () => {
  assert.throws(() => validateNewItem({}), ValidationError);
  assert.throws(() => validateNewItem({ name: "   " }), ValidationError);
});

test("validateNewItem rejects a bad quantity", () => {
  assert.throws(() => validateNewItem({ name: "Rope", quantity: -1 }), ValidationError);
  assert.throws(() => validateNewItem({ name: "Rope", quantity: 1.5 }), ValidationError);
  assert.throws(() => validateNewItem({ name: "Rope", quantity: "3" }), ValidationError);
});

test("validateNewItem rejects a body that is not an object", () => {
  assert.throws(() => validateNewItem(null), ValidationError);
  assert.throws(() => validateNewItem([]), ValidationError);
  assert.throws(() => validateNewItem("text"), ValidationError);
});

test("store assigns incrementing ids and can list and fetch items", () => {
  const store = createStore();
  const a = store.create({ name: "Tent", quantity: 2 });
  const b = store.create({ name: "Stove" });
  assert.equal(a.id, 1);
  assert.equal(b.id, 2);
  assert.equal(store.list().length, 2);
  assert.equal(store.get(1).name, "Tent");
  assert.equal(store.get(99), null);
});
