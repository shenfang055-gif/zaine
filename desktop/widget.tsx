import { StrictMode, useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import "./widget.css";

const DRAFT_KEY = "zaine-widget-draft";

function PenIcon({ size = 25 }: { size?: number }) {
  return <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m4 20 4-1 11-11a2 2 0 0 0-3-3L5 16z"/><path d="m14 7 3 3"/></svg>;
}

function Widget() {
  const [expanded, setExpanded] = useState(false);
  const [draft, setDraft] = useState(() => localStorage.getItem(DRAFT_KEY) ?? "");
  const [saved, setSaved] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const drag = useRef({ active: false, moved: false, x: 0, y: 0 });

  useEffect(() => window.zaineWidget?.onExpandedState(setExpanded), []);
  useEffect(() => {
    if (draft) localStorage.setItem(DRAFT_KEY, draft);
    else localStorage.removeItem(DRAFT_KEY);
  }, [draft]);
  useEffect(() => {
    if (expanded) setTimeout(() => textareaRef.current?.focus(), 180);
  }, [expanded]);

  function open() {
    setExpanded(true);
    window.zaineWidget?.setExpanded(true);
  }

  function collapse() {
    setExpanded(false);
    window.zaineWidget?.setExpanded(false);
  }

  function pointerDown(event: React.PointerEvent<HTMLButtonElement>) {
    drag.current = { active: true, moved: false, x: event.screenX, y: event.screenY };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function pointerMove(event: React.PointerEvent<HTMLButtonElement>) {
    if (!drag.current.active) return;
    const deltaX = event.screenX - drag.current.x;
    const deltaY = event.screenY - drag.current.y;
    if (Math.abs(deltaX) + Math.abs(deltaY) > 3) drag.current.moved = true;
    if (deltaX || deltaY) window.zaineWidget?.moveBy(deltaX, deltaY);
    drag.current.x = event.screenX;
    drag.current.y = event.screenY;
  }

  function pointerUp() {
    const shouldOpen = !drag.current.moved;
    drag.current.active = false;
    if (shouldOpen) open();
  }

  function save() {
    const body = draft.trim();
    if (!body) return;
    const now = new Date();
    const title = body.split("\n")[0].replace(/^#+\s*/, "").slice(0, 36) || "未命名想法";
    const note: DesktopQuickNote = {
      id: now.getTime(),
      title,
      body,
      tag: "随手记",
      time: `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`,
      color: "clay",
      date: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`,
      createdAt: now.toISOString(),
    };
    window.zaineWidget?.saveNote(note);
    setDraft("");
    setSaved(true);
    setTimeout(() => { setSaved(false); collapse(); }, 650);
  }

  if (!expanded) return <button className="note-bubble" aria-label="打开桌面随手记" title="拖动调整位置，点击随手记" onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerUp} onPointerCancel={() => { drag.current.active = false; }}><PenIcon/><span>{draft.trim() ? "有未保存内容" : "随手记"}</span>{draft.trim() && <i/>}</button>;

  return <main className="widget-stage">
    <section className="note-drawer">
      <header className="drawer-drag"><div><span className="brand-dot"/>在呢 · 随手记</div><button className="no-drag" onClick={collapse} aria-label="收起">收起⌄</button></header>
      <div className="draft-state"><span>{draft.trim() ? "草稿已留在本机" : "先写下来，不急着完整"}</span><time>{new Date().toLocaleDateString("zh-CN", { month: "long", day: "numeric" })}</time></div>
      <textarea ref={textareaRef} value={draft} onChange={event => setDraft(event.target.value)} onKeyDown={event => { if ((event.metaKey || event.ctrlKey) && event.key === "Enter") save(); }} placeholder={"此刻在想什么？\n\n收起后，没保存的内容也会留在这里。"}/>
      <footer><div><span>Markdown</span><em>{draft.length} 字</em></div><button onClick={save} disabled={!draft.trim()}>{saved ? "已保存 ✓" : "保存到随手记"}<kbd>⌘ ↵</kbd></button></footer>
    </section>
  </main>;
}

createRoot(document.getElementById("widget-root")!).render(<StrictMode><Widget/></StrictMode>);
