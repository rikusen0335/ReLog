import { copyFile, mkdir, readFile, readdir, realpath, writeFile } from "node:fs/promises";
import { dirname, isAbsolute, relative, resolve, sep } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import matter from "gray-matter";
import { markdownToPortableText } from "emdash/client";
import { validateSeed } from "emdash/seed";

const cmsRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

export function normalizeLegacyMarkdown(markdown) {
  // Preserve examples of directives inside fenced code.
  let fence = null;
  let tip = false;
  return markdown.split(/\r?\n/).map((line) => {
    const marker = line.match(/^\s*([`~]{3,})/);
    if (marker) {
      if (!fence) fence = marker[1][0];
      else if (marker[1][0] === fence) fence = null;
      return line;
    }
    if (fence) return line;
    if (/^:::tips\s*$/.test(line)) { tip = true; return ""; }
    if (tip && /^:::\s*$/.test(line)) { tip = false; return ""; }
    if (tip) return "> " + line;
    if (/^:br\s*$/.test(line)) return "\n";
    return line;
  }).join("\n");
}

function termSlug(value) {
  return value.normalize("NFKC").toLowerCase().trim().replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-|-$/g, "") || "tag";
}
function termKey(value) {
  return value.normalize("NFKC").toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");
}
function date(value) {
  if (!value) return null;
  const result = new Date(value);
  if (Number.isNaN(result.getTime())) throw new Error("Invalid post date: " + value);
  return result.toISOString();
}

export async function prepareMigration(sourceRoot = resolve(cmsRoot, ".."), outputRoot = resolve(cmsRoot, ".emdash")) {
  const seed = JSON.parse(await readFile(resolve(cmsRoot, "seed/schema.json"), "utf8"));
  const publicRoot = await realpath(resolve(sourceRoot, "public"));
  const media = new Map();
  await mkdir(outputRoot, { recursive: true });

  async function mediaReference(src) {
    if (!src) return null;
    if (media.has(src)) return media.get(src);
    if (/^https?:\/\//.test(src)) {
      const ref = { $media: { url: src } };
      media.set(src, ref);
      return ref;
    }
    if (!src.startsWith("/") || src.startsWith("//")) throw new Error("Unsupported media path: " + src);
    const source = await realpath(resolve(publicRoot, "." + decodeURIComponent(src)));
    const rel = relative(publicRoot, source);
    if (rel.startsWith(".." + sep) || rel === ".." || isAbsolute(rel)) {
      throw new Error("Media path escapes public/: " + src);
    }
    const target = resolve(outputRoot, "media", rel);
    await mkdir(dirname(target), { recursive: true });
    await copyFile(source, target);
    const ref = { $media: { file: "media/" + rel.split(sep).join("/") } };
    media.set(src, ref);
    return ref;
  }

  async function importImages(value) {
    if (!value || typeof value !== "object") return;
    if (Array.isArray(value)) { await Promise.all(value.map(importImages)); return; }
    if (value._type === "image" && value.asset?.url) {
      value.asset = await mediaReference(value.asset.url);
    }
    if (value._type === "code" && value.language) {
      const info = value.language.trim().split(/\s+/)[0];
      const split = info.indexOf(":");
      value.language = split < 0 ? info : info.slice(0, split);
      if (split >= 0) value.filename = info.slice(split + 1);
    }
    for (const child of Object.values(value)) {
      if (Array.isArray(child)) await Promise.all(child.map(importImages));
    }
  }

  const terms = new Map();
  function addTerm(label) {
    const key = termKey(label);
    if (!terms.has(key)) terms.set(key, { slug: termSlug(label), label });
    return terms.get(key).slug;
  }
  const tagsDir = resolve(sourceRoot, "_contents/tags");
  for (const name of (await readdir(tagsDir)).filter((name) => name.endsWith(".md")).sort()) {
    const { data } = matter(await readFile(resolve(tagsDir, name), "utf8"));
    if (data.name) addTerm(data.name);
  }

  const authors = new Map();
  const authorFile = JSON.parse(await readFile(resolve(sourceRoot, "_contents/authors/authors.json"), "utf8"));
  for (const author of authorFile.authors ?? []) authors.set(author.name, author);

  const postsDir = resolve(sourceRoot, "_contents/posts");
  for (const name of (await readdir(postsDir)).filter((name) => /\.mdx?$/.test(name)).sort()) {
    const { data, content } = matter(await readFile(resolve(postsDir, name), "utf8"));
    const slug = name.replace(/\.mdx?$/, "");
    if (!data.title || !data["publish-date"]) throw new Error("Missing title or publish-date: " + name);
    const blocks = markdownToPortableText(normalizeLegacyMarkdown(content));
    await importImages(blocks);
    const author = data.author || { name: "rikusen0335" };
    authors.set(author.name, author);
    seed.content.posts.push({
      id: "post:" + slug,
      slug,
      status: data.public === false ? "draft" : "published",
      data: {
        title: data.title,
        content: blocks,
        excerpt: data.excerpt || "",
        cover_image: await mediaReference(data["cover-image"]),
        publish_date: date(data["publish-date"]),
        update_date: date(data["update-date"]),
        author_name: author.name,
        author_picture: await mediaReference(author.picture),
      },
      taxonomies: { tag: (data.tags || []).map(addTerm) },
    });
  }
  for (const [name, author] of authors) {
    seed.content.authors.push({
      id: "author:" + name,
      status: "published",
      data: { name, picture: await mediaReference(author.picture) },
    });
  }
  seed.taxonomies[0].terms = [...terms.values()];
  const validation = validateSeed(seed);
  if (!validation.valid) throw new Error(validation.errors.join("\n"));
  await writeFile(resolve(outputRoot, "seed.json"), JSON.stringify(seed, null, 2) + "\n");
  return seed;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const seed = await prepareMigration();
  const posts = seed.content.posts;
  console.log("Prepared " + posts.length + " posts (" + posts.filter((post) => post.status === "draft").length + " draft), authors, tags and media.");
  console.log("Output: cms/.emdash/seed.json (source MDX is unchanged)");
}
