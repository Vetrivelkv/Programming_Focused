import assert from "node:assert/strict";
import test from "node:test";
import { createApp } from "../src/server.js";

test("health stays live and readiness stays unavailable without a database", async (context) => {
  const server = createApp().listen(0, "127.0.0.1");
  context.after(() => new Promise((resolve) => server.close(resolve)));
  await new Promise((resolve) => server.once("listening", resolve));
  const { port } = server.address();

  const health = await fetch(`http://127.0.0.1:${port}/api/health`);
  assert.equal(health.status, 200);
  assert.deepEqual(await health.json(), { status: "ok" });

  const ready = await fetch(`http://127.0.0.1:${port}/api/ready`);
  assert.equal(ready.status, 503);
  const body = await ready.json();
  assert.equal(body.status, "not_ready");
  assert.equal(body.database.initialized, false);
  assert.equal(body.database.connected, false);
  assert.equal(body.database.activeQueries, 0);
});
