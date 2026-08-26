import assert from "node:assert/strict";
import test from "node:test";
import { fetchWithColdStartRetry } from "../src/api.js";

const response = (status) => ({ status });

test("idempotent cold-start responses are retried exactly once", async () => {
  const calls = [];
  const result = await fetchWithColdStartRetry("/api/courses", {
    method: "GET",
    headers: { "X-Test": "preserved" },
    credentials: "include",
  }, {
    fetchImpl: async (url, options) => {
      calls.push({ url, options });
      return response(calls.length === 1 ? 503 : 200);
    },
    retryDelayMs: 0,
    sleep: async () => undefined,
  });

  assert.equal(result.status, 200);
  assert.equal(calls.length, 2);
  assert.deepEqual(calls[1], calls[0]);
});

test("non-idempotent requests are never retried", async () => {
  let calls = 0;
  const result = await fetchWithColdStartRetry("/api/auth/register", {
    method: "POST",
    body: "{}",
  }, {
    fetchImpl: async () => {
      calls += 1;
      return response(503);
    },
    retryDelayMs: 0,
    sleep: async () => undefined,
  });

  assert.equal(result.status, 503);
  assert.equal(calls, 1);
});
