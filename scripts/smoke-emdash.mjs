import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";
import { resolve } from "node:path";
import { cp, mkdtemp, rm } from "node:fs/promises";
import { createHash, randomBytes } from "node:crypto";
import { backup, DatabaseSync } from "node:sqlite";

const children = [];
let fixture;
let token;
function start(args, cwd, env) {
  const child = spawn(process.execPath, args, { cwd, env: { ...process.env, ...env }, stdio: "inherit" });
  children.push(child);
  return child;
}
async function ready(url) {
  for (let i = 0; i < 90; i++) {
    if (children.some((child) => child.exitCode !== null)) throw new Error("Server exited during startup");
    try { const r = await fetch(url); await r.arrayBuffer(); if (r.ok) return; } catch {}
    await delay(1000);
  }
  throw new Error("Server did not become ready: " + url);
}
try {
  // All editorial writes below use an isolated copy, never the operator's DB.
  fixture = await mkdtemp(resolve("cms/.smoke-"));
  const source = new DatabaseSync(resolve("cms/data.db"), { readOnly: true });
  try { await backup(source, resolve(fixture, "data.db")); } finally { source.close(); }
  await cp(resolve("cms/dist"), resolve(fixture, "dist"), { recursive: true });
  await cp(resolve("cms/uploads"), resolve(fixture, "uploads"), { recursive: true });
  token = "ec_pat_" + randomBytes(32).toString("base64url");
  const db = new DatabaseSync(resolve(fixture, "data.db"));
  try {
    db.prepare("INSERT INTO users (id, email, name, role, email_verified, disabled, created_at, updated_at) VALUES (?, ?, ?, 50, 1, 0, ?, ?)")
      .run("relog-smoke-user", "smoke@relog.invalid", "Smoke test", new Date().toISOString(), new Date().toISOString());
    db.prepare("INSERT INTO _emdash_api_tokens (id, name, token_hash, prefix, user_id, scopes, expires_at) VALUES (?, ?, ?, ?, ?, ?, ?)")
      .run("relog-smoke-token", "Ephemeral smoke test", createHash("sha256").update(token).digest("base64url"), token.slice(0, 11),
        "relog-smoke-user", JSON.stringify(["content:read", "content:write"]), new Date(Date.now() + 600000).toISOString());
  } finally { db.close(); }
  start(["dist/server/entry.mjs"], fixture, {
    HOST: "127.0.0.1", PORT: "4321",
    EMDASH_ENCRYPTION_KEY: "emdash_enc_v1_" + randomBytes(32).toString("base64url"),
  });
  await ready("http://127.0.0.1:4321/api/relog/posts.json");
  start(["node_modules/next/dist/bin/next", "start", "-p", "3112"], process.cwd(), { EMDASH_URL: "http://127.0.0.1:4321" });
  await ready("http://127.0.0.1:3112");

  const feed = await (await fetch("http://127.0.0.1:4321/api/relog/posts.json")).json();
  console.log("Checking public feed and article pages...");
  assert.equal(feed.posts.length, 3);
  assert.ok(feed.posts.every((p) => !p.slug.includes("best-docker-compose")));
  for (const post of feed.posts) {
    console.log("Checking " + post.slug);
    const page = await fetch("http://127.0.0.1:3112/posts/" + post.slug);
    assert.equal(page.status, 200);
    assert.match(page.headers.get("cache-control"), /no-store/);
    const html = await page.text();
    assert.ok(html.includes(post.title), "Japanese title must survive migration");
    assert.ok(html.includes("emdash-content"));
    const body = await fetch("http://127.0.0.1:4321/api/relog/posts/" + post.slug + "/body");
    const bodyHtml = await body.text();
    assert.equal(body.status, 200);
    if (post.slug.includes("hello-world")) {
      assert.match(bodyHtml, /<table/);
      assert.match(bodyHtml, /<pre/);
    }
    const image = bodyHtml.match(/<img[^>]+src="([^"]+)"/);
    if (image && image[1].startsWith("/")) {
      const media = await fetch("http://127.0.0.1:3112" + image[1]);
      assert.equal(media.status, 200, "CMS media must work through Next.js");
      assert.ok((await media.arrayBuffer()).byteLength > 0);
    }
  }
  for (const slug of ["2021-12-04-best-docker-compose-elixir-phoenix", "missing"]) {
    console.log("Checking 404 for " + slug);
    const page = await fetch("http://127.0.0.1:3112/posts/" + slug);
    assert.equal(page.status, 404);
    await page.arrayBuffer();
    const body = await fetch("http://127.0.0.1:4321/api/relog/posts/" + slug + "/body");
    assert.equal(body.status, 404);
    await body.arrayBuffer();
  }
  const admin = await fetch("http://127.0.0.1:3112/_emdash/admin", { redirect: "manual" });
  await admin.arrayBuffer();
  assert.ok([200, 302, 303, 307].includes(admin.status), "CMS admin proxy must respond");
  console.log("Checking publication, draft isolation, edits and unpublishing without a rebuild...");
  async function edit(method, path, data) {
    const response = await fetch("http://127.0.0.1:4321/_emdash/api/content/posts" + path, {
      method,
      headers: { Authorization: "Bearer " + token, "Content-Type": "application/json" },
      ...(data ? { body: JSON.stringify(data) } : {}),
    });
    const result = await response.json();
    assert.ok(result.success, "Editorial API: " + JSON.stringify(result.error));
    return result.data;
  }
  async function pageStatus(slug) {
    const response = await fetch("http://127.0.0.1:3112/posts/" + slug);
    const html = await response.text();
    return { status: response.status, html };
  }
  function paragraph(text) {
    return [{ _type: "block", _key: "p", style: "normal", markDefs: [],
      children: [{ _type: "span", _key: "s", text, marks: [] }] }];
  }
  const slug = "relog-smoke-new-post";
  const created = await edit("POST", "", { slug, status: "draft", data: {
    title: "Smoke test article", publish_date: new Date().toISOString(), author_name: "Smoke test",
    content: paragraph("published version one"),
  } });
  const item = "/" + created.item.id;
  assert.equal((await pageStatus(slug)).status, 404);
  await edit("POST", item + "/publish");
  assert.match((await pageStatus(slug)).html, /published version one/);
  const withNewPost = await (await fetch("http://127.0.0.1:4321/api/relog/posts.json")).json();
  assert.ok(withNewPost.posts.some((post) => post.slug === slug));
  await edit("PUT", item, { data: { content: paragraph("private version two") } });
  const unchanged = await pageStatus(slug);
  assert.match(unchanged.html, /published version one/);
  assert.ok(!unchanged.html.includes("private version two"), "Saved drafts must not leak");
  await edit("POST", item + "/publish");
  assert.match((await pageStatus(slug)).html, /private version two/);
  await edit("POST", item + "/unpublish");
  assert.equal((await pageStatus(slug)).status, 404);
  const withoutPost = await (await fetch("http://127.0.0.1:4321/api/relog/posts.json")).json();
  assert.ok(!withoutPost.posts.some((post) => post.slug === slug));
  console.log("EmDash + Next.js smoke checks passed.");
} finally {
  for (const child of children.reverse()) {
    if (child.exitCode !== null) continue;
    const stopped = new Promise((done) => child.once("exit", done));
    child.kill("SIGTERM");
    await stopped;
  }
  if (fixture) {
    assert.ok(resolve(fixture).startsWith(resolve("cms") + "/.smoke-") ||
      resolve(fixture).startsWith(resolve("cms") + "\\.smoke-"));
    await rm(fixture, { recursive: true, force: true });
  }
}
