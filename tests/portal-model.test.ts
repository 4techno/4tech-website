import test from "node:test";
import assert from "node:assert/strict";
import { parseAmountPaise, safeFileName, timestampMillis, validateQuote, validateUpload } from "../lib/portal-model";

test("INR quotation amounts preserve paise and enforce the supported range", () => {
  assert.equal(parseAmountPaise("12345.67"), 1234567);
  assert.equal(parseAmountPaise("1.01"), 101);
  assert.equal(parseAmountPaise("10000000"), 1000000000);
  for (const value of ["0", "0.99", "10000000.01", "-1", "1e6", "1.234", "NaN", "1,000"]) assert.throws(() => parseAmountPaise(value));
});
test("quotation dates reject impossible dates and expire at the end of the India day", () => {
  const input = { title: "Sensor platform", scope: "Design and test the sensor interface.", amount: "2000", terms: "Two milestones, delivery after review.", validUntil: "2028-02-29" };
  const now = Date.parse("2028-01-01T00:00:00Z");
  assert.equal(validateQuote(input, now).validUntil, Date.parse("2028-02-29T18:29:59Z"));
  for (const validUntil of ["2028-02-30", "2028-04-31", "2027-01-01", "2029-12-01", "29/02/2028", ""]) assert.throws(() => validateQuote({ ...input, validUntil }, now));
});
test("private uploads exclude active formats, empty content and oversize files", () => {
  const file = { name: "engineering.webp", type: "image/webp", size: 2000 };
  assert.doesNotThrow(() => validateUpload(file, true));
  assert.doesNotThrow(() => validateUpload({ ...file, name: "scope.pdf", type: "application/pdf" }, false));
  for (const invalid of [{ ...file, type: "image/svg+xml" }, { ...file, size: 0 }, { ...file, size: 8 * 1024 * 1024 + 1 }, { ...file, type: "application/pdf" }]) assert.throws(() => validateUpload(invalid, true));
  assert.equal(safeFileName("../a\u0000.pdf"), ".._a_.pdf");
});
test("malformed timestamps cannot crash the workspace", () => {
  assert.equal(timestampMillis(null), null);
  assert.equal(timestampMillis({ toMillis: () => Infinity }), null);
  assert.equal(timestampMillis({ toMillis: () => 9e15 }), null);
  assert.equal(timestampMillis({ toMillis: () => { throw new Error("bad data"); } }), null);
  assert.equal(timestampMillis({ toMillis: () => 1234 }), 1234);
});
