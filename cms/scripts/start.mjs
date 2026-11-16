// Match the default EMDASH_URL on Windows, where localhost may bind only IPv6.
process.env.HOST ||= "127.0.0.1";
process.env.PORT ||= "4321";
await import("../dist/server/entry.mjs");
