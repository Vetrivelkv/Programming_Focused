import assert from "node:assert/strict";
import test from "node:test";
import { withBoundedExponentialRetry } from "../src/lib/retry.js";

test("bounded retry doubles delays up to the configured maximum", async () => {
  const delays = [];
  let calls = 0;
  const result = await withBoundedExponentialRetry(async () => {
    calls += 1;
    if (calls < 4) throw new Error("not ready");
    return "ready";
  }, {
    attempts: 4,
    initialDelayMs: 100,
    maxDelayMs: 250,
    sleep: async (milliseconds) => delays.push(milliseconds),
  });

  assert.equal(result, "ready");
  assert.equal(calls, 4);
  assert.deepEqual(delays, [100, 200, 250]);
});

test("bounded retry never exceeds the maximum attempt count", async () => {
  let calls = 0;
  await assert.rejects(withBoundedExponentialRetry(async () => {
    calls += 1;
    throw new Error("still unavailable");
  }, {
    attempts: 3,
    initialDelayMs: 0,
    maxDelayMs: 0,
    sleep: async () => undefined,
  }), /still unavailable/);
  assert.equal(calls, 3);
});
