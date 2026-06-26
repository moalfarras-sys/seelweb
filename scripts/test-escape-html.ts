/**
 * HTML-injection tests for the shared escapeHtml() used in all e-mail templates.
 * Run: npx tsx scripts/test-escape-html.ts
 */
import assert from "node:assert";
import { escapeHtml } from "../src/lib/escape-html";

let passed = 0;
let failed = 0;
const t = (name: string, fn: () => void) => {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (e) {
    console.log(`  ✗ ${name}\n      ${(e as Error).message}`);
    failed++;
  }
};

console.log("=== escapeHtml HTML-injection tests ===");

t("<script> is neutralised", () => {
  const out = escapeHtml("<script>alert(1)</script>");
  assert.ok(!out.includes("<script>"), out);
  assert.ok(out.includes("&lt;script&gt;"), out);
});

t("<img onerror> is neutralised", () => {
  const out = escapeHtml('<img src=x onerror=alert(1)>');
  assert.ok(!out.includes("<img"), out);
  assert.ok(out.includes("&lt;img"), out);
});

t("double quotes escaped (attribute breakout)", () => {
  const out = escapeHtml('" onmouseover="alert(1)');
  assert.ok(!out.includes('"'), out);
  assert.ok(out.includes("&quot;"), out);
});

t("single quotes escaped", () => {
  assert.strictEqual(escapeHtml("O'Brien"), "O&#39;Brien");
});

t("ampersand escaped first (no double-encoding artifacts)", () => {
  assert.strictEqual(escapeHtml("Tom & Jerry"), "Tom &amp; Jerry");
});

t("pre-existing HTML entity is re-escaped safely", () => {
  // &amp; should become &amp;amp; so it renders literally, not as &
  assert.strictEqual(escapeHtml("&amp;"), "&amp;amp;");
});

t("unicode is preserved", () => {
  assert.strictEqual(escapeHtml("Müller – Schöne Grüße 你好 😀"), "Müller – Schöne Grüße 你好 😀");
});

t("multiline text preserved (no tag injection)", () => {
  const out = escapeHtml("Zeile1\nZeile2 <b>x</b>");
  assert.ok(out.includes("\n"), out);
  assert.ok(!out.includes("<b>"), out);
});

t("long text handled", () => {
  const long = "<x>".repeat(5000);
  const out = escapeHtml(long);
  assert.ok(!out.includes("<x>"));
  assert.ok(out.length > long.length);
});

t("null/undefined -> empty string (no 'undefined')", () => {
  assert.strictEqual(escapeHtml(null), "");
  assert.strictEqual(escapeHtml(undefined), "");
});

t("combined payload fully neutralised", () => {
  const out = escapeHtml(`<script>x</script><img src=x onerror="y">'"&`);
  assert.ok(!/[<>]/.test(out), out);
});

console.log(`\n=== Ergebnis: ${passed} bestanden, ${failed} fehlgeschlagen ===\n`);
process.exit(failed > 0 ? 1 : 0);
