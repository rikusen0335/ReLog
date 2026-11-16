import test from "node:test";
import assert from "node:assert/strict";
import { createEmDashClient } from "../lib/emdash-client.ts";

const post = {
  slug: "2021-example", title: "日本語の記事", publishDate: "2021-01-01T00:00:00.000Z",
  updatedDate: null, coverImage: "/assets/images/example.jpg", excerpt: "",
  author: { name: "rikusen0335", picture: "/assets/images/rikusen.png" }, tags: ["Minecraft"],
};
function json(value, status = 200) { return Response.json(value, { status }); }

test("walks every published page, encodes cursors, and sorts by publication date", async () => {
  const calls = [];
  const client = createEmDashClient("http://cms.test", async (url, options) => {
    calls.push([url.href, options]);
    return url.search
      ? json({ posts: [{ ...post, slug: "new", publishDate: "2026-01-01T00:00:00Z" }], nextCursor: null })
      : json({ posts: [post], nextCursor: "a/b+c" });
  });
  assert.deepEqual((await client.getPosts()).map((p) => p.slug), ["new", post.slug]);
  assert.equal(calls[1][0], "http://cms.test/api/relog/posts.json?cursor=a%2Fb%2Bc");
  assert.equal(calls[0][1].cache, "no-store");
  assert.equal(calls[0][1].headers.Authorization, undefined);
  assert.equal(calls[0][1].headers.Cookie, undefined);
});

test("missing/unpublished posts return null; server failures are not turned into 404 or stale data", async () => {
  assert.equal(await createEmDashClient("http://cms.test", async () => new Response(null, { status: 404 })).getPost("private"), null);
  await assert.rejects(createEmDashClient("http://cms.test", async () => new Response(null, { status: 503 })).getPosts(), /503/);
  await assert.rejects(createEmDashClient("http://cms.test", async () => { throw new Error("offline"); }).getPost("p"), /offline/);
});

test("uses published HTML without evaluating it as MDX, and handles unpublishing during reads", async () => {
  let calls = 0;
  const client = createEmDashClient("http://cms.test", async () => ++calls === 1
    ? json(post)
    : new Response("<h2>記事</h2><pre><code>{code}</code></pre>", { headers: { "Content-Type": "text/html" } }));
  assert.match((await client.getPost(post.slug)).bodyHtml, /<h2>記事/);
  calls = 0;
  const removed = createEmDashClient("http://cms.test", async () => ++calls === 1 ? json(post) : new Response(null, { status: 404 }));
  assert.equal(await removed.getPost(post.slug), null);
});

test("rejects malformed responses, repeated cursors, redirects, and non-HTML bodies", async () => {
  await assert.rejects(createEmDashClient("http://cms.test", async () => json({ posts: [{ slug: "bad" }], nextCursor: null })).getPosts(), /metadata/);
  await assert.rejects(createEmDashClient("http://cms.test", async () => json({ posts: [], nextCursor: "same" })).getPosts(), /Repeated/);
  let calls = 0;
  await assert.rejects(createEmDashClient("http://cms.test", async () => ++calls === 1 ? json(post) : json({})).getPost("p"), /invalid post body/);
  for (const url of ["file:///tmp/cms", "https://user:password@cms.test", "https://cms.test/path"]) {
    assert.throws(() => createEmDashClient(url), /HTTP/);
  }
});
