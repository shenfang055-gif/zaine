import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${pathname}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the ZAI NE product shell", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>在呢 ZAI NE · 记录此刻<\/title>/i);
  assert.match(html, /急急急？先别急，先记录此刻。/);
  assert.match(html, />待办</);
  assert.match(html, />日历</);
  assert.match(html, />随手记</);
  assert.match(html, />知识库</);
  assert.doesNotMatch(html, /codex-preview|Building your site|react-loading-skeleton/i);
});

test("server-renders the current public download page", async () => {
  const response = await render("/download");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /PUBLIC BETA · 0\.1\.2/);
  assert.match(html, /zai-ne-0\.1\.2-macOS-Apple-Silicon\.dmg/);
  assert.match(html, /zai-ne-0\.1\.2-Windows-x64\.exe/);
  assert.match(html, /每条想法独立保存并按时间倒序排列/);
});

test("keeps every scratch entry independent and time ordered", async () => {
  const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  assert.match(page, /function sortNotes\(notes: Note\[\]\)/);
  assert.match(page, /saveNotes\(\[note, \.\.\.notes\]\)/);
  assert.match(page, /orderedNotes\.map\(note =>/);
  assert.match(page, /selected\.id === note\.id/);
  assert.match(page, /createdAt: now\.toISOString\(\)/);
  assert.doesNotMatch(page, /body: `\$\{selected\.body\.trim\(\)\}/);
});
