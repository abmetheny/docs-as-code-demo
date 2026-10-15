// HTTP-level tests. These start the real app on a random port and call it with fetch.
// Requires `npm install` first (needs express). Run with: npm test
const test = require("node:test");
const assert = require("node:assert/strict");
const { createApp } = require("../src/app");

let server;
let base;

test.before(async () => {
  await new Promise((resolve) => {
    server = createApp().listen(0, () => {
      base = `http://127.0.0.1:${server.address().port}`;
      resolve();
    });
  });
});

test.after(() => server.close());

test("GET /health returns status ok and a version", async () => {
  const res = await fetch(`${base}/health`);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.status, "ok");
  assert.ok(body.version);
});

test("POST /items creates an item and GET /items/:id returns it", async () => {
  const create = await fetch(`${base}/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Headlamp", quantity: 3 }),
  });
  assert.equal(create.status, 201);
  const item = await create.json();
  assert.equal(item.name, "Headlamp");

  const get = await fetch(`${base}/items/${item.id}`);
  assert.equal(get.status, 200);
  assert.equal((await get.json()).quantity, 3);
});

test("POST /items with a blank name returns 400 INVALID_REQUEST", async () => {
  const res = await fetch(`${base}/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "" }),
  });
  assert.equal(res.status, 400);
  assert.equal((await res.json()).error.code, "INVALID_REQUEST");
});

test("POST /items with malformed JSON returns 400 INVALID_JSON", async () => {
  const res = await fetch(`${base}/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{not json",
  });
  assert.equal(res.status, 400);
  assert.equal((await res.json()).error.code, "INVALID_JSON");
});

test("GET /items/:id for an unknown id returns 404 NOT_FOUND", async () => {
  const res = await fetch(`${base}/items/9999`);
  assert.equal(res.status, 404);
  assert.equal((await res.json()).error.code, "NOT_FOUND");
});
