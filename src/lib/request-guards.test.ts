import assert from "node:assert/strict";
import test from "node:test";
import {
  isAllowedContactRequest,
  isNonProductionVercel,
  shouldNoIndex,
  validateContactFields,
} from "./request-guards.ts";

const productionHeaders = {
  forwardedHost: "isabellabilliet.com",
  host: "isabellabilliet.com",
  productionHost: "isabellabilliet.com",
};

test("production hosts are indexable", () => {
  assert.equal(
    shouldNoIndex({ vercelEnv: "production", ...productionHeaders }),
    false,
  );
  assert.equal(shouldNoIndex({ vercelEnv: undefined, ...productionHeaders }), false);
});

test("non-production Vercel deploys stay noindex even if the host is spoofed", () => {
  assert.equal(shouldNoIndex({ vercelEnv: "preview", ...productionHeaders }), true);
  assert.equal(shouldNoIndex({ vercelEnv: "development", ...productionHeaders }), true);
});

test("disagreeing or non-production hosts fail closed", () => {
  assert.equal(
    shouldNoIndex({
      vercelEnv: undefined,
      forwardedHost: "isabellabilliet.com",
      host: "preview.vercel.app",
      productionHost: "isabellabilliet.com",
    }),
    true,
  );
  assert.equal(
    shouldNoIndex({
      vercelEnv: "production",
      forwardedHost: "isabellabilliet.com, evil.example",
      host: "isabellabilliet.com",
      productionHost: "isabellabilliet.com",
    }),
    true,
  );
  assert.equal(
    shouldNoIndex({
      vercelEnv: undefined,
      forwardedHost: null,
      host: null,
      productionHost: "isabellabilliet.com",
    }),
    true,
  );
  assert.equal(
    shouldNoIndex({
      vercelEnv: undefined,
      forwardedHost: null,
      host: "localhost:3000",
      productionHost: "isabellabilliet.com",
    }),
    true,
  );
});

test("robots disallow only non-production Vercel environments", () => {
  assert.equal(isNonProductionVercel(undefined), false);
  assert.equal(isNonProductionVercel("production"), false);
  assert.equal(isNonProductionVercel("preview"), true);
});

test("contact requests must be same-origin JSON", () => {
  assert.equal(
    isAllowedContactRequest({
      origin: "https://isabellabilliet.com",
      host: "isabellabilliet.com",
      contentType: "application/json; charset=utf-8",
      secFetchSite: "same-origin",
    }),
    true,
  );
  assert.equal(
    isAllowedContactRequest({
      origin: "http://localhost:3000",
      host: "localhost:3000",
      contentType: "application/json",
      secFetchSite: null,
    }),
    true,
  );
  assert.equal(
    isAllowedContactRequest({
      origin: null,
      host: "isabellabilliet.com",
      contentType: "application/json",
      secFetchSite: null,
    }),
    false,
  );
  assert.equal(
    isAllowedContactRequest({
      origin: "https://evil.example",
      host: "isabellabilliet.com",
      contentType: "application/json",
      secFetchSite: "cross-site",
    }),
    false,
  );
  assert.equal(
    isAllowedContactRequest({
      origin: "http://192.168.1.20:3000",
      host: "192.168.1.20:3000",
      contentType: "application/json",
      secFetchSite: "same-origin",
    }),
    false,
  );
  assert.equal(
    isAllowedContactRequest({
      origin: "https://isabellabilliet.com",
      host: "isabellabilliet.com",
      contentType: "text/plain",
      secFetchSite: "same-origin",
    }),
    false,
  );
});

test("contact fields reject header and recipient injection", () => {
  assert.deepEqual(
    validateContactFields({
      name: "Isabella",
      email: "studio@example.com",
      message: "Hello",
    }),
    {
      ok: true,
      fields: { name: "Isabella", email: "studio@example.com", message: "Hello" },
    },
  );

  assert.equal(
    validateContactFields({
      name: "Ada\r\nBcc: attacker@evil.example",
      email: "ada@example.com",
      message: "Hello",
    }).ok,
    false,
  );
  assert.equal(
    validateContactFields({
      name: "Ada",
      email: "ada@example.com,attacker@evil.example",
      message: "Hello",
    }).ok,
    false,
  );
  assert.equal(validateContactFields(["not", "an", "object"]).ok, false);
  assert.equal(
    validateContactFields({
      name: "Ada",
      email: "ada@example.com",
      message: "x".repeat(5001),
    }).ok,
    false,
  );
});
