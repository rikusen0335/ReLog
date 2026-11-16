import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { prepareMigration, normalizeLegacyMarkdown } from "../scripts/migrate-pages.mjs";
import { serializePost, imageUrl } from "../src/lib/post-data.ts";

const root = fileURLToPath(new URL("../../", import.meta.url));

test("migrates every existing post, including the private draft, with original slugs and dates", async () => {
  const output = await mkdtemp(resolve(tmpdir(), "relog-seed-"));
  try {
    const seed = await prepareMigration(root, output);
    assert.equal(seed.content.posts.length, 4);
    assert.equal(seed.content.posts.filter((p) => p.status === "published").length, 3);
    const privatePost = seed.content.posts.find((p) => p.slug.includes("best-docker-compose"));
    assert.equal(privatePost.status, "draft");
    const hello = seed.content.posts.find((p) => p.slug === "2020-03-16-hello-world");
    assert.equal(hello.data.publish_date, "2020-03-15T20:35:00.000Z");
    assert.match(hello.data.title, /ブログ/);
    assert.ok(hello.data.content.some((b) => b._type === "code"));
    assert.ok(hello.data.content.some((b) => b._type === "table"));
    const image = hello.data.content.find((b) => b._type === "image");
    assert.ok(image.asset.$media.file);
    assert.ok((await readFile(resolve(output, image.asset.$media.file))).length > 0);
    assert.equal(seed.content.authors[0].data.name, "rikusen0335");
    assert.ok(seed.taxonomies[0].terms.some((t) => t.label === "Minecraft"));
    assert.equal(privatePost.taxonomies.tag.includes("docker-compose"), true);
    assert.equal(JSON.parse(await readFile(resolve(output, "seed.json"), "utf8")).version, "1");
  } finally { await rm(output, { recursive: true, force: true }); }
});

test("converts tips to native blockquotes without modifying fenced examples", () => {
  const fence = String.fromCharCode(96).repeat(3);
  const input = ":::tips\n注意\n:::\n:br\n" + fence + "\n:::tips\n例\n:::\n" + fence;
  const result = normalizeLegacyMarkdown(input);
  assert.match(result, /> 注意/);
  assert.ok(result.includes(fence + "\n:::tips\n例\n:::\n" + fence));
});

test("public serialization excludes drafts and exposes no private metadata", () => {
  assert.equal(serializePost({ status: "draft", title: "秘密" }), null);
  const post = serializePost({
    status: "published", slug: "test", title: "公開記事", publish_date: "2026-01-01",
    terms: { tag: [{ label: "タグ" }] }, draftRevisionId: "secret", author_name: "著者",
  });
  assert.deepEqual(post.tags, ["タグ"]);
  assert.equal(post.draftRevisionId, undefined);
  assert.match(post.coverImage, /^\/assets\//);
  assert.equal(imageUrl({ src: "https://cms.test/_emdash/api/media/file/pic.jpg" }), "/_emdash/api/media/file/pic.jpg");
  assert.equal(imageUrl({ src: "javascript:alert(1)" }), "");
});
