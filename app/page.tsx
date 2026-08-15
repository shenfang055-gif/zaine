"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AirplaneTiltIcon } from "@phosphor-icons/react/dist/csr/AirplaneTilt";
import { BarbellIcon } from "@phosphor-icons/react/dist/csr/Barbell";
import { BicycleIcon } from "@phosphor-icons/react/dist/csr/Bicycle";
import { BookOpenIcon } from "@phosphor-icons/react/dist/csr/BookOpen";
import { BriefcaseIcon } from "@phosphor-icons/react/dist/csr/Briefcase";
import { CoffeeIcon } from "@phosphor-icons/react/dist/csr/Coffee";
import { FilmSlateIcon } from "@phosphor-icons/react/dist/csr/FilmSlate";
import { ForkKnifeIcon } from "@phosphor-icons/react/dist/csr/ForkKnife";
import { GameControllerIcon } from "@phosphor-icons/react/dist/csr/GameController";
import { MicrophoneStageIcon } from "@phosphor-icons/react/dist/csr/MicrophoneStage";
import { MusicNotesIcon } from "@phosphor-icons/react/dist/csr/MusicNotes";
import { ShoppingBagIcon } from "@phosphor-icons/react/dist/csr/ShoppingBag";
import { TreeIcon } from "@phosphor-icons/react/dist/csr/Tree";

type View = "today" | "calendar" | "notes" | "inbox";
type Note = { id: number; title: string; body: string; tag: string; time: string; color: string; date: string };
type ScheduleIcon = "meal" | "sing" | "coffee" | "study" | "work" | "flight" | "play" | "movie" | "music" | "shop" | "sport" | "ride" | "nature";
type RepeatRule = "none" | "daily" | "weekly" | "monthly" | "batch";
type CalendarEvent = { id: number; date: string; time: string; endTime?: string; title: string; color: string; icon?: ScheduleIcon };
type TodoTag = "工作" | "生活" | "学习" | "灵感";
type Todo = { id: number; title: string; dueDate?: string; tag: TodoTag; done: boolean };
type AttachmentKind = "markdown" | "text" | "image" | "pdf" | "office" | "other";
type KnowledgeAttachment = { id: number; name: string; type: string; kind: AttachmentKind; size: string; content?: string };
type KnowledgeNote = { id: number; title: string; body: string; category: string; updatedAt: string; attachments: KnowledgeAttachment[] };

const Icon = ({ name, size = 18 }: { name: string; size?: number }) => {
  const paths: Record<string, React.ReactNode> = {
    todo: <><rect x="3" y="3" width="18" height="18" rx="4"/><path d="m7 9 2 2 4-4M14 10h3M7 16h10"/></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M8 3v4M16 3v4M3 10h18"/><path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/></>,
    notes: <><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M8 13h8M8 17h6"/></>,
    inbox: <><path d="M4 5h16v14H4z"/><path d="M4 14h4l2 3h4l2-3h4"/></>,
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
    plus: <path d="M12 5v14M5 12h14"/>,
    check: <path d="m5 12 4 4L19 6"/>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    more: <><circle cx="5" cy="12" r="1" fill="currentColor"/><circle cx="12" cy="12" r="1" fill="currentColor"/><circle cx="19" cy="12" r="1" fill="currentColor"/></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></>,
    pen: <><path d="m4 20 4-1 11-11a2 2 0 0 0-3-3L5 16z"/><path d="m14 7 3 3"/></>,
    close: <path d="m6 6 12 12M18 6 6 18"/>,
    arrow: <path d="m9 18 6-6-6-6"/>,
    folder: <path d="M3 6h7l2 2h9v11H3z"/>,
    tag: <><path d="M20 13 13 20 4 11V4h7z"/><circle cx="8.5" cy="8.5" r="1"/></>,
    grid: <><rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/></>,
    list: <><path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r=".8" fill="currentColor"/><circle cx="4.5" cy="12" r=".8" fill="currentColor"/><circle cx="4.5" cy="18" r=".8" fill="currentColor"/></>,
    camera: <><path d="M5 7h3l1.5-2h5L16 7h3a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z"/><circle cx="12" cy="13" r="3.5"/></>,
    upload: <><path d="M12 16V4m0 0L7 9m5-5 5 5"/><path d="M5 14v5h14v-5"/></>,
    paperclip: <path d="m9 12 5-5a3 3 0 0 1 4 4l-7 7a5 5 0 0 1-7-7l7-7"/>,
    file: <><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6"/></>,
    library: <><path d="M5 4h4v16H5zM10 4h4v16h-4zM16 5l3-1 3 15-3 1z"/></>,
    back: <path d="m15 18-6-6 6-6"/>,
  };
  return <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
};

const initialNotes: Note[] = [
  { id: 1, title: "秋日阅读清单", body: "# 秋日阅读清单\n\n想读完《一间自己的房间》，再找一本关于城市与人的散文集。\n\n- 城市观察\n- 女性写作\n- 周末去旧书店", tag: "阅读", time: "10:32", color: "clay", date: dateKey(new Date()) },
  { id: 2, title: "产品灵感：更轻的收件箱", body: "## 一个更轻的入口\n\n临时想法不要立刻要求分类，晚上再用一次温柔的提醒完成整理。\n\n> 先记录，再整理。", tag: "灵感", time: "昨天", color: "sage", date: dateKey(addDays(new Date(), -1)) },
  { id: 3, title: "周末采购", body: "# 周末采购\n\n- [ ] 咖啡豆\n- [ ] 燕麦奶\n- [ ] 花瓶\n- [ ] 打印纸\n\n顺路去旧书店看看。", tag: "生活", time: "周一", color: "mist", date: dateKey(addDays(new Date(), -3)) },
];

const initialKnowledgeNotes: KnowledgeNote[] = [
  { id: 301, title: "桌面随手记产品研究", category: "产品研究", updatedAt: "今天 11:20", body: "# 桌面随手记产品研究\n\n## 核心判断\n\n用户真正需要的是一个**足够快的记录入口**，以及之后不会造成压力的整理方式。\n\n### 设计原则\n\n- 快捷记录不要求立即分类\n- 日程、待办与笔记保持关联\n- 正式资料进入知识库长期保存", attachments: [
    { id: 401, name: "访谈摘要.md", type: "text/markdown", kind: "markdown", size: "3 KB", content: "# 访谈摘要\n\n- 快速记录比复杂分类更重要\n- 用户希望附件与笔记放在一起\n- 桌面小窗适合捕捉临时想法" },
    { id: 402, name: "信息架构.pdf", type: "application/pdf", kind: "pdf", size: "1.8 MB" },
  ] },
  { id: 302, title: "品牌与视觉规范", category: "设计归档", updatedAt: "昨天 16:45", body: "# 品牌与视觉规范\n\n主色采用低饱和的鼠尾草绿、陶土棕与雾灰色。界面应安静、温和，但不失轻松和趣味。", attachments: [
    { id: 403, name: "配色备忘.txt", type: "text/plain", kind: "text", size: "1 KB", content: "鼠尾草绿 #899A8C\n陶土棕 #B58E7E\n雾灰蓝 #7F9697\n纸张白 #F5F2EC" },
  ] },
];

const weekdays = ["一", "二", "三", "四", "五", "六", "日"];
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const weekNames = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
const timeOptions = Array.from({ length: 49 }, (_, index) => {
  const minutes = index * 30;
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
});

function timeToMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function defaultEndTime(startTime: string) {
  const total = Math.min(timeToMinutes(startTime) + 60, 1440);
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}
const scheduleIconOptions: { id: ScheduleIcon; label: string; icon: React.ComponentType<{ size?: number; weight?: "duotone" | "regular" }> }[] = [
  { id: "meal", label: "吃饭", icon: ForkKnifeIcon },
  { id: "sing", label: "唱歌", icon: MicrophoneStageIcon },
  { id: "coffee", label: "咖啡", icon: CoffeeIcon },
  { id: "study", label: "学习", icon: BookOpenIcon },
  { id: "work", label: "工作", icon: BriefcaseIcon },
  { id: "flight", label: "出行", icon: AirplaneTiltIcon },
  { id: "play", label: "游玩", icon: GameControllerIcon },
  { id: "movie", label: "电影", icon: FilmSlateIcon },
  { id: "music", label: "音乐", icon: MusicNotesIcon },
  { id: "shop", label: "购物", icon: ShoppingBagIcon },
  { id: "sport", label: "运动", icon: BarbellIcon },
  { id: "ride", label: "骑行", icon: BicycleIcon },
  { id: "nature", label: "户外", icon: TreeIcon },
];

function ScheduleGlyph({ name, size = 18 }: { name?: ScheduleIcon; size?: number }) {
  const option = scheduleIconOptions.find(item => item.id === name) ?? scheduleIconOptions[4];
  const Glyph = option.icon;
  return <Glyph size={size} weight="duotone" />;
}

function dateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function addDays(date: Date, amount: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}

function createSeedEvents(today: Date): CalendarEvent[] {
  return [
    { id: 101, date: dateKey(today), time: "09:30", endTime: "10:30", title: "整理本周产品反馈", color: "sage", icon: "work" },
    { id: 102, date: dateKey(today), time: "14:30", endTime: "16:00", title: "专注写作", color: "lavender", icon: "study" },
    { id: 103, date: dateKey(addDays(today, 1)), time: "11:00", endTime: "12:00", title: "与设计师喝咖啡", color: "clay", icon: "coffee" },
    { id: 104, date: dateKey(addDays(today, 3)), time: "17:00", endTime: "18:30", title: "散步与晚间阅读", color: "mist", icon: "nature" },
    { id: 105, date: dateKey(addDays(today, 7)), time: "10:00", endTime: "11:00", title: "周计划回顾", color: "sage", icon: "work" },
  ];
}

function createSeedTodos(today: Date): Todo[] {
  return [
    { id: 201, title: "确认日历图标的排列效果", dueDate: dateKey(today), tag: "工作", done: false },
    { id: 202, title: "整理今天的灵感碎片", dueDate: dateKey(today), tag: "灵感", done: false },
    { id: 203, title: "准备下周计划", dueDate: dateKey(addDays(today, 2)), tag: "工作", done: false },
    { id: 204, title: "读完书桌上的散文集", tag: "学习", done: false },
  ];
}

export default function Home() {
  const [view, setView] = useState<View>("today");
  const [quickOpen, setQuickOpen] = useState(false);
  const [quickText, setQuickText] = useState("");
  const [notes, setNotes] = useState(initialNotes);
  const [selectedNote, setSelectedNote] = useState(initialNotes[0]);
  const [knowledgeNotes, setKnowledgeNotes] = useState(initialKnowledgeNotes);
  const [selectedKnowledge, setSelectedKnowledge] = useState(initialKnowledgeNotes[0]);
  const [today] = useState(() => new Date());
  const [selectedDateKey, setSelectedDateKey] = useState(() => dateKey(new Date()));
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(() => createSeedEvents(new Date()));
  const [todos, setTodos] = useState<Todo[]>(() => createSeedTodos(new Date()));
  const [calendarAddRequest, setCalendarAddRequest] = useState(0);
  const [toast, setToast] = useState("");
  const [completed, setCompleted] = useState<number[]>([]);
  const [profileName, setProfileName] = useState("Sherry");
  const [profileAvatar, setProfileAvatar] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileDraftName, setProfileDraftName] = useState("Sherry");
  const [profileDraftAvatar, setProfileDraftAvatar] = useState("");
  const quickRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("mori-notes");
    if (saved) {
      const parsed = (JSON.parse(saved) as Note[]).map((note, index) => ({ ...note, date: note.date ?? dateKey(addDays(new Date(), -index)) }));
      setNotes(parsed);
      if (parsed[0]) setSelectedNote(parsed[0]);
    }
    const savedKnowledge = localStorage.getItem("xianbieji-knowledge");
    if (savedKnowledge) {
      const parsed = JSON.parse(savedKnowledge) as KnowledgeNote[];
      setKnowledgeNotes(parsed);
      if (parsed[0]) setSelectedKnowledge(parsed[0]);
    }
    const savedEvents = localStorage.getItem("mori-calendar-events");
    if (savedEvents) {
      const parsed = JSON.parse(savedEvents) as CalendarEvent[];
      setCalendarEvents(parsed.map(event => ({ ...event, endTime: event.endTime ?? defaultEndTime(event.time) })));
    }
    const savedTodos = localStorage.getItem("shiri-todos");
    if (savedTodos) setTodos(JSON.parse(savedTodos));
    const savedProfile = localStorage.getItem("xianbieji-profile");
    if (savedProfile) {
      const parsed = JSON.parse(savedProfile) as { name?: string; avatar?: string };
      if (parsed.name) setProfileName(parsed.name);
      if (parsed.avatar) setProfileAvatar(parsed.avatar);
    }
    const key = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === "n") {
        e.preventDefault(); setQuickOpen(true);
      }
      if (e.key === "Escape") setQuickOpen(false);
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, []);

  useEffect(() => { if (quickOpen) setTimeout(() => quickRef.current?.focus(), 80); }, [quickOpen]);
  const title = useMemo(() => ({ today: "待办事项清单", calendar: "日历", notes: "随手记", inbox: "知识库" }[view]), [view]);

  function notify(message: string) { setToast(message); setTimeout(() => setToast(""), 2100); }
  function addCalendarEvents(events: Omit<CalendarEvent, "id">[]) {
    const now = Date.now();
    const next = [...calendarEvents, ...events.map((event, index) => ({ ...event, id: now + index }))];
    setCalendarEvents(next);
    localStorage.setItem("mori-calendar-events", JSON.stringify(next));
    notify(events.length > 1 ? `已添加 ${events.length} 项日程` : "日程已添加到日历");
  }
  function saveTodos(next: Todo[]) {
    setTodos(next);
    localStorage.setItem("shiri-todos", JSON.stringify(next));
  }
  function saveNotes(next: Note[]) {
    setNotes(next);
    localStorage.setItem("mori-notes", JSON.stringify(next));
  }
  function saveKnowledgeNotes(next: KnowledgeNote[]) {
    setKnowledgeNotes(next);
    try { localStorage.setItem("xianbieji-knowledge", JSON.stringify(next)); }
    catch { notify("附件较大，本次使用中仍可继续预览"); }
  }
  function saveQuick() {
    if (!quickText.trim()) return;
    const firstLine = quickText.trim().split("\n")[0].replace(/^#+\s*/, "");
    const note: Note = { id: Date.now(), title: firstLine.slice(0, 22) || "未命名想法", body: quickText.trim(), tag: "随手记", time: "刚刚", color: "clay", date: dateKey(new Date()) };
    const next = [note, ...notes]; saveNotes(next); setSelectedNote(note);
    setQuickText(""); setQuickOpen(false); notify("已保存到随手记");
  }

  function openProfileEditor() {
    setProfileDraftName(profileName);
    setProfileDraftAvatar(profileAvatar);
    setProfileOpen(true);
  }

  function uploadAvatar(file?: File) {
    if (!file) return;
    if (!file.type.startsWith("image/")) { notify("请选择图片文件"); return; }
    if (file.size > 8 * 1024 * 1024) { notify("图片请小于 8 MB"); return; }
    const reader = new FileReader();
    reader.onload = () => {
      const image = new window.Image();
      image.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = 512;
        canvas.height = 512;
        const context = canvas.getContext("2d");
        if (!context) return;
        const side = Math.min(image.width, image.height);
        context.drawImage(image, (image.width - side) / 2, (image.height - side) / 2, side, side, 0, 0, 512, 512);
        setProfileDraftAvatar(canvas.toDataURL("image/jpeg", .88));
      };
      image.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  }

  function saveProfile(event: React.FormEvent) {
    event.preventDefault();
    const name = profileDraftName.trim();
    if (!name) return;
    setProfileName(name);
    setProfileAvatar(profileDraftAvatar);
    localStorage.setItem("xianbieji-profile", JSON.stringify({ name, avatar: profileDraftAvatar }));
    setProfileOpen(false);
    notify("个人资料已保存");
  }

  return (
    <main className="desktop-shell">
      <section className="app-window">
        <header className="titlebar">
          <div className="traffic"><span/><span/><span/></div>
          <div className="title-drag">在呢 · ZAI NE</div>
          <button className="title-icon" aria-label="通知"><Icon name="bell" size={17}/><i/></button>
        </header>

        <div className="workspace">
          <aside className="sidebar">
            <div className="brand"><div className="brand-mark"><img src="./xianbieji-app-icon-transparent.png" alt="在呢 ZAI NE"/></div><div><strong>在呢 ZAI NE</strong><span>急急急？先别急，先记录此刻。</span></div></div>
            <nav>
              {(["today", "calendar", "notes", "inbox"] as View[]).map((item) => (
                <button key={item} className={view === item ? "active" : ""} onClick={() => setView(item)}>
                  <Icon name={item === "today" ? "todo" : item === "inbox" ? "library" : item}/><span>{{ today: "待办", calendar: "日历", notes: "随手记", inbox: "知识库" }[item]}</span>{item === "inbox" && <em>{knowledgeNotes.length}</em>}
                </button>
              ))}
            </nav>
            <div className="side-section"><span>我的空间</span><button><Icon name="folder" size={16}/> 工作</button><button><Icon name="folder" size={16}/> 生活</button><button><Icon name="tag" size={16}/> 灵感碎片</button></div>
            <button type="button" className="sidebar-bottom" onClick={openProfileEditor} aria-label="编辑个人资料"><div className="avatar">{profileAvatar ? <img src={profileAvatar} alt={`${profileName}的头像`}/> : profileName.slice(0, 1).toUpperCase()}</div><div><strong>{profileName}</strong><span>点击编辑个人资料</span></div><Icon name="more" size={18}/></button>
          </aside>

          <section className="content">
            <header className="content-head">
              <div><p>{today.getFullYear()} 年 {today.getMonth() + 1} 月 {today.getDate()} 日 · {weekNames[today.getDay()]}</p><h1>{title}</h1></div>
              {view === "calendar" && <div className="head-actions"><button className="primary" onClick={() => setCalendarAddRequest(request => request + 1)}><Icon name="plus" size={17}/> 添加日程</button></div>}
            </header>

            {view === "today" && <Today today={today} events={calendarEvents} completed={completed} setCompleted={setCompleted} todos={todos} saveTodos={saveTodos} onAddSchedule={() => { setSelectedDateKey(dateKey(today)); setView("calendar"); setCalendarAddRequest(request => request + 1); }}/>} 
            {view === "calendar" && <Calendar today={today} selectedDateKey={selectedDateKey} setSelectedDateKey={setSelectedDateKey} events={calendarEvents} addEvents={addCalendarEvents} addRequest={calendarAddRequest}/>} 
            {view === "notes" && <ScratchNotes notes={notes} selected={selectedNote} setSelected={setSelectedNote} saveNotes={saveNotes}/>} 
            {view === "inbox" && <KnowledgeBase notes={knowledgeNotes} selected={selectedKnowledge} setSelected={setSelectedKnowledge} saveNotes={saveKnowledgeNotes} notify={notify}/>} 
          </section>
        </div>
      </section>

      <button className="floating-note" onClick={() => setQuickOpen(true)} aria-label="打开随手记"><Icon name="pen" size={23}/><span>随手记</span></button>

      {quickOpen && <div className="quick-overlay" onMouseDown={(e) => e.target === e.currentTarget && setQuickOpen(false)}>
        <section className="quick-card" role="dialog" aria-label="快捷记录">
          <header><div><span className="quick-dot"/> 随手记</div><button onClick={() => setQuickOpen(false)} aria-label="关闭"><Icon name="close" size={18}/></button></header>
          <textarea ref={quickRef} value={quickText} onChange={e => setQuickText(e.target.value)} onKeyDown={e => { if ((e.metaKey || e.ctrlKey) && e.key === "Enter") saveQuick(); }} placeholder="此刻在想什么？"/>
          <footer><div><button className="pill active">随手记</button><button className="pill">今天</button><button className="pill">Markdown</button></div><button className="save" onClick={saveQuick}>保存 <kbd>⌘ ↵</kbd></button></footer>
        </section>
      </div>}
      {profileOpen && <div className="event-modal-overlay" onMouseDown={(e) => e.target === e.currentTarget && setProfileOpen(false)}>
        <form className="event-modal profile-modal" role="dialog" aria-modal="true" aria-labelledby="profile-title" onSubmit={saveProfile}>
          <header><div><Icon name="camera" size={17}/><span id="profile-title">个人资料</span></div><button type="button" onClick={() => setProfileOpen(false)} aria-label="关闭"><Icon name="close" size={18}/></button></header>
          <div className="profile-modal-body">
            <section className="profile-avatar-editor">
              <div className="profile-avatar-preview">{profileDraftAvatar ? <img src={profileDraftAvatar} alt="头像预览"/> : profileDraftName.trim().slice(0, 1).toUpperCase() || "S"}</div>
              <div><strong>个人头像</strong><span>支持 JPG、PNG、WebP，上传后自动裁切为正方形。</span><div className="profile-avatar-actions"><label className="upload-avatar"><Icon name="camera" size={15}/> 选择图片<input type="file" accept="image/png,image/jpeg,image/webp" onChange={event => { uploadAvatar(event.target.files?.[0]); event.target.value = ""; }}/></label>{profileDraftAvatar && <button type="button" className="remove-avatar" onClick={() => setProfileDraftAvatar("")}>移除头像</button>}</div></div>
            </section>
            <label className="profile-name-field"><span>显示名称</span><input autoFocus value={profileDraftName} maxLength={24} placeholder="请输入你的名字" onChange={event => setProfileDraftName(event.target.value)}/><small>{profileDraftName.length}/24</small></label>
            <p className="profile-local-note"><Icon name="check" size={14}/>头像与名称只保存在这台设备上</p>
          </div>
          <footer><span>以后可以随时从左下角重新修改</span><div><button type="button" onClick={() => setProfileOpen(false)}>取消</button><button className="confirm" type="submit" disabled={!profileDraftName.trim()}>保存修改</button></div></footer>
        </form>
      </div>}
      {toast && <div className="toast"><Icon name="check" size={17}/>{toast}</div>}
    </main>
  );
}

function Today({ today, events, completed, setCompleted, todos, saveTodos, onAddSchedule }: { today: Date; events: CalendarEvent[]; completed: number[]; setCompleted: (v: number[]) => void; todos: Todo[]; saveTodos: (todos: Todo[]) => void; onAddSchedule: () => void }) {
  const [todoOpen, setTodoOpen] = useState(false);
  const [todoTitle, setTodoTitle] = useState("");
  const [todoTag, setTodoTag] = useState<TodoTag>("工作");
  const [hasDueDate, setHasDueDate] = useState(true);
  const [todoDueDate, setTodoDueDate] = useState(dateKey(today));
  const todayKey = dateKey(today);
  const todayEvents = events.filter(event => event.date === todayKey).sort((a, b) => a.time.localeCompare(b.time));
  const todayTodos = todos.filter(todo => todo.dueDate === todayKey).sort((a, b) => Number(a.done) - Number(b.done));
  const laterTodos = todos.filter(todo => todo.dueDate !== todayKey).sort((a, b) => Number(a.done) - Number(b.done) || (a.dueDate ?? "9999").localeCompare(b.dueDate ?? "9999"));
  const finishedSchedules = todayEvents.filter(event => completed.includes(event.id)).length;
  const tagColors: Record<TodoTag, string> = { 工作: "sage", 生活: "clay", 学习: "lavender", 灵感: "mist" };

  function openTodoCreator() {
    setTodoTitle("");
    setTodoTag("工作");
    setHasDueDate(true);
    setTodoDueDate(todayKey);
    setTodoOpen(true);
  }

  function submitTodo(event: React.FormEvent) {
    event.preventDefault();
    if (!todoTitle.trim()) return;
    saveTodos([{ id: Date.now(), title: todoTitle.trim(), dueDate: hasDueDate ? todoDueDate : undefined, tag: todoTag, done: false }, ...todos]);
    setTodoOpen(false);
  }

  function toggleTodo(id: number) {
    saveTodos(todos.map(todo => todo.id === id ? { ...todo, done: !todo.done } : todo));
  }

  function todoMeta(todo: Todo) {
    if (!todo.dueDate) return todo.tag;
    const [dueYear, dueMonth, dueDay] = todo.dueDate.split("-").map(Number);
    const base = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const due = new Date(dueYear, dueMonth - 1, dueDay);
    const days = Math.round((due.getTime() - base.getTime()) / 86400000);
    if (days === 0) return "今天截止";
    if (days > 0) return `还有 ${days} 天`;
    return `已逾期 ${Math.abs(days)} 天`;
  }

  function renderTodo(todo: Todo) {
    return <article className={`todo-item ${todo.done ? "done" : ""}`} key={todo.id}><button className="todo-check" aria-label={todo.done ? "标记为未完成" : "标记为已完成"} onClick={() => toggleTodo(todo.id)}>{todo.done && <Icon name="check" size={12}/>}</button><div><strong>{todo.title}</strong><span className={todo.dueDate ? "deadline" : `tag ${tagColors[todo.tag]}`}>{todoMeta(todo)}</span></div></article>;
  }

  return <>
    <div className="today-grid">
      <section className="day-card hero-card"><div className="date-block"><strong>{today.getDate()}</strong><span>{monthNames[today.getMonth()].slice(0, 3).toUpperCase()} · {weekNames[today.getDay()].replace("星期", "")}</span></div><div><span className="eyebrow">今日寄语</span><h2>慢慢来，比较快。</h2><p>给重要的事情留一点不被打扰的时间。</p></div><div className="sun"><span/></div></section>
      <section className="schedule-panel">
        <div className="section-title"><div><h2>今日安排</h2><span>{finishedSchedules} / {todayEvents.length} 已完成 · 与日历同步</span></div><button onClick={onAddSchedule}><Icon name="plus" size={17}/> 添加安排</button></div>
        <div className="timeline">{todayEvents.length ? todayEvents.map(item => { const done = completed.includes(item.id); const iconLabel = scheduleIconOptions.find(option => option.id === item.icon)?.label ?? "日程"; return <article className={`schedule ${done ? "done" : ""}`} key={item.id}>
          <div className="time"><strong>{item.time}</strong><span>{item.endTime ?? defaultEndTime(item.time)}</span></div><span className={`line-dot ${item.color}`}/><button className="check" onClick={() => setCompleted(done ? completed.filter(id => id !== item.id) : [...completed, item.id])}>{done && <Icon name="check" size={14}/>}</button><div className="schedule-text"><strong>{item.title}</strong><span>同步自日历 · {iconLabel}</span></div><span className={`label ${item.color}`}>{iconLabel}</span><button className="more"><Icon name="more" size={18}/></button>
        </article>}) : <div className="schedule-empty"><Icon name="calendar" size={25}/><strong>今天还没有安排</strong><span>从日历添加后会自动显示在这里</span></div>}</div>
      </section>
      <aside className="todo-panel">
        <header><div><h2>我的待办</h2><span>{todos.filter(todo => !todo.done).length} 项未完成</span></div><button onClick={openTodoCreator}><Icon name="plus" size={15}/> 添加待办</button></header>
        <section className="todo-group"><div className="todo-group-title"><strong>今天截止</strong><span>{todayTodos.length}</span></div><div className="todo-list">{todayTodos.length ? todayTodos.map(renderTodo) : <p>今天没有截止事项</p>}</div></section>
        <section className="todo-group"><div className="todo-group-title"><strong>后续截止</strong><span>{laterTodos.length}</span></div><div className="todo-list">{laterTodos.length ? laterTodos.map(renderTodo) : <p>暂时没有后续事项</p>}</div></section>
      </aside>
    </div>
    {todoOpen && <div className="event-modal-overlay" onMouseDown={event => event.target === event.currentTarget && setTodoOpen(false)}><form className="event-modal todo-modal" role="dialog" aria-modal="true" aria-label="添加待办" onSubmit={submitTodo}>
      <header><div><span className="quick-dot"/> 添加待办</div><button type="button" aria-label="关闭" onClick={() => setTodoOpen(false)}><Icon name="close" size={18}/></button></header>
      <div className="todo-modal-body"><label><span>待办事项</span><input autoFocus required placeholder="写下一件需要完成的事…" value={todoTitle} onChange={event => setTodoTitle(event.target.value)}/></label><fieldset className="todo-tag-picker"><legend>标签</legend><div>{(["工作", "生活", "学习", "灵感"] as TodoTag[]).map(tag => <button type="button" key={tag} className={`${tagColors[tag]} ${todoTag === tag ? "active" : ""}`} onClick={() => setTodoTag(tag)}>{tag}</button>)}</div></fieldset><div className="todo-due-row"><label className="due-toggle"><input type="checkbox" checked={hasDueDate} onChange={event => setHasDueDate(event.target.checked)}/><i/><span>设置截止日期</span></label>{hasDueDate && <div className="date-control"><Icon name="calendar" size={15}/><input aria-label="截止日期" type="date" min={todayKey} value={todoDueDate} onChange={event => setTodoDueDate(event.target.value)}/></div>}</div></div>
      <footer><span>{hasDueDate ? `截止于 ${todoDueDate}` : `不设日期 · ${todoTag}`}</span><div><button type="button" onClick={() => setTodoOpen(false)}>取消</button><button className="confirm" type="submit">保存待办</button></div></footer>
    </form></div>}
  </>;
}

function Calendar({ today, selectedDateKey, setSelectedDateKey, events, addEvents, addRequest }: { today: Date; selectedDateKey: string; setSelectedDateKey: (key: string) => void; events: CalendarEvent[]; addEvents: (events: Omit<CalendarEvent, "id">[]) => void; addRequest: number }) {
  const [visibleMonth, setVisibleMonth] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [adding, setAdding] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [eventTime, setEventTime] = useState("09:00");
  const [eventEndTime, setEventEndTime] = useState("10:00");
  const [eventIcon, setEventIcon] = useState<ScheduleIcon>("work");
  const [repeatRule, setRepeatRule] = useState<RepeatRule>("none");
  const [repeatEnd, setRepeatEnd] = useState(() => dateKey(addDays(today, 30)));
  const [batchDates, setBatchDates] = useState<string[]>([selectedDateKey]);
  const [batchDraft, setBatchDraft] = useState(selectedDateKey);
  const year = visibleMonth.getFullYear();
  const month = visibleMonth.getMonth();
  const startOffset = (new Date(year, month, 1).getDay() + 6) % 7;
  const calendarDays = Array.from({ length: 42 }, (_, index) => new Date(year, month, index - startOffset + 1));
  const [selectedYear, selectedMonth, selectedDay] = selectedDateKey.split("-").map(Number);
  const selectedDate = new Date(selectedYear, selectedMonth - 1, selectedDay);
  const selectedEvents = events.filter(event => event.date === selectedDateKey).sort((a, b) => a.time.localeCompare(b.time));

  function changeMonth(amount: number) {
    setVisibleMonth(new Date(year, month + amount, 1));
  }

  function selectDate(date: Date) {
    setSelectedDateKey(dateKey(date));
    if (date.getMonth() !== month) setVisibleMonth(new Date(date.getFullYear(), date.getMonth(), 1));
  }

  function goToday() {
    setVisibleMonth(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDateKey(dateKey(today));
  }

  function openEventCreator() {
    setEventTitle("");
    setEventTime("09:00");
    setEventEndTime("10:00");
    setEventIcon("work");
    setRepeatRule("none");
    setRepeatEnd(dateKey(addDays(selectedDate, 30)));
    setBatchDates([selectedDateKey]);
    setBatchDraft(selectedDateKey);
    setAdding(true);
  }

  useEffect(() => {
    if (addRequest > 0) openEventCreator();
  }, [addRequest]);

  function addBatchDate() {
    if (batchDraft && !batchDates.includes(batchDraft)) setBatchDates([...batchDates, batchDraft].sort());
  }

  function changeStartTime(nextTime: string) {
    setEventTime(nextTime);
    if (timeToMinutes(eventEndTime) <= timeToMinutes(nextTime)) setEventEndTime(defaultEndTime(nextTime));
  }

  function recurringDates() {
    if (repeatRule === "none") return [selectedDateKey];
    if (repeatRule === "batch") return batchDates.length ? batchDates : [selectedDateKey];
    const base = new Date(selectedYear, selectedMonth - 1, selectedDay);
    const [endYear, endMonth, endDay] = repeatEnd.split("-").map(Number);
    const end = new Date(endYear, endMonth - 1, endDay);
    const dates: string[] = [];
    for (let index = 0; index < 180; index += 1) {
      let candidate: Date;
      if (repeatRule === "daily") candidate = addDays(base, index);
      else if (repeatRule === "weekly") candidate = addDays(base, index * 7);
      else {
        const monthStart = new Date(base.getFullYear(), base.getMonth() + index, 1);
        const lastDay = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0).getDate();
        candidate = new Date(monthStart.getFullYear(), monthStart.getMonth(), Math.min(base.getDate(), lastDay));
      }
      if (candidate > end) break;
      dates.push(dateKey(candidate));
    }
    return dates.length ? dates : [selectedDateKey];
  }

  function submitEvent(event?: React.FormEvent) {
    event?.preventDefault();
    if (!eventTitle.trim()) return;
    const colors = ["sage", "clay", "lavender", "mist"];
    const dates = recurringDates();
    addEvents(dates.map((date, index) => ({ date, time: eventTime, endTime: eventEndTime, title: eventTitle.trim(), icon: eventIcon, color: colors[(events.length + index) % colors.length] })));
    setEventTitle("");
    setAdding(false);
  }

  return <div className="calendar-layout">
    <section className="calendar-card">
      <header><button aria-label="上个月" onClick={() => changeMonth(-1)}>‹</button><div><h2>{year} 年 {month + 1} 月</h2><span>{monthNames[month]}</span></div><button aria-label="下个月" onClick={() => changeMonth(1)}>›</button><div className="calendar-header-actions"><button className="today-jump" onClick={goToday}>今天</button></div></header>
      <div className="weekdays">{weekdays.map(w => <span key={w}>周{w}</span>)}</div>
      <div className="month-grid">{calendarDays.map((date, index) => {
        const key = dateKey(date);
        const muted = date.getMonth() !== month;
        const active = key === selectedDateKey;
        const isToday = key === dateKey(today);
        const dayEvents = events.filter(event => event.date === key).sort((a, b) => a.time.localeCompare(b.time));
        return <button key={index} aria-label={`${date.getMonth() + 1} 月 ${date.getDate()} 日，${dayEvents.length} 项日程`} className={`${muted ? "muted" : ""} ${active ? "selected" : ""} ${isToday ? "today" : ""}`} onClick={() => selectDate(date)}><span className="date-half"><strong>{date.getDate()}</strong>{isToday && <em>今天</em>}</span><span className="event-half">{dayEvents.slice(0, 4).map(event => <i className={`calendar-glyph ${event.color}`} title={`${event.time}–${event.endTime ?? defaultEndTime(event.time)} ${event.title}`} key={event.id}><ScheduleGlyph name={event.icon} size={14}/></i>)}{dayEvents.length > 4 && <small>+{dayEvents.length - 4}</small>}</span></button>;
      })}</div>
    </section>
    <aside className="day-detail">
      <span className="eyebrow">{selectedDate.getFullYear()} 年 {selectedDate.getMonth() + 1} 月</span>
      <div className="detail-date"><strong>{selectedDate.getDate()}</strong><span>{weekNames[selectedDate.getDay()]}<br/>{dateKey(selectedDate)}</span></div>
      <h3>这一天的安排</h3>
      {selectedEvents.length > 0 ? selectedEvents.map(event => <article key={event.id}><i className={`detail-event-icon ${event.color}`}><ScheduleGlyph name={event.icon} size={16}/></i><span>{event.time}<small>至 {event.endTime ?? defaultEndTime(event.time)}</small></span><strong>{event.title}</strong></article>) : <div className="calendar-empty">这一天还没有安排</div>}
      <button className="wide-add" onClick={openEventCreator}><Icon name="plus" size={16}/> 添加这一天的日程</button>
    </aside>
    {adding && <div className="event-modal-overlay" onMouseDown={event => event.target === event.currentTarget && setAdding(false)}>
      <form className="event-modal" role="dialog" aria-modal="true" aria-label="添加日程" onSubmit={submitEvent}>
        <header><div><span className="quick-dot"/> 新日程</div><button type="button" aria-label="关闭" onClick={() => setAdding(false)}><Icon name="close" size={18}/></button></header>
        <div className="event-modal-body">
          <div className="event-fields"><label><span>日程名称</span><input autoFocus required placeholder="例如：和朋友喝咖啡" value={eventTitle} onChange={event => setEventTitle(event.target.value)}/></label></div>
          <div className="time-range"><div className="field-caption"><span>日程时间</span><em>{Math.max(30, timeToMinutes(eventEndTime) - timeToMinutes(eventTime))} 分钟</em></div><div className="time-range-controls"><label><span>开始</span><div className="select-control"><Icon name="clock" size={15}/><select aria-label="开始时间" value={eventTime} onChange={event => changeStartTime(event.target.value)}>{timeOptions.slice(0, -1).map(time => <option key={time} value={time}>{time}</option>)}</select></div></label><i>—</i><label><span>结束</span><div className="select-control"><Icon name="clock" size={15}/><select aria-label="结束时间" value={eventEndTime} onChange={event => setEventEndTime(event.target.value)}>{timeOptions.filter(time => timeToMinutes(time) > timeToMinutes(eventTime)).map(time => <option key={time} value={time}>{time}</option>)}</select></div></label></div></div>
          <fieldset className="icon-picker"><legend>选择一个图标</legend><div>{scheduleIconOptions.map(option => <button type="button" key={option.id} aria-label={option.label} aria-pressed={eventIcon === option.id} className={eventIcon === option.id ? "active" : ""} onClick={() => setEventIcon(option.id)}><option.icon size={21} weight="duotone"/><span>{option.label}</span></button>)}</div></fieldset>
          <div className="repeat-row"><label><span>添加方式</span><div className="select-control wide"><Icon name="calendar" size={15}/><select value={repeatRule} onChange={event => setRepeatRule(event.target.value as RepeatRule)}><option value="none">仅这一天</option><option value="daily">每日循环</option><option value="weekly">每周循环</option><option value="monthly">每月循环</option><option value="batch">批量选择日期</option></select></div></label>{repeatRule !== "none" && repeatRule !== "batch" && <label><span>循环至</span><div className="date-control"><Icon name="calendar" size={15}/><input type="date" min={selectedDateKey} value={repeatEnd} onChange={event => setRepeatEnd(event.target.value)}/></div></label>}</div>
          {repeatRule === "batch" && <div className="batch-picker"><div><div className="date-control"><Icon name="calendar" size={15}/><input type="date" value={batchDraft} onChange={event => setBatchDraft(event.target.value)}/></div><button type="button" onClick={addBatchDate}>加入日期</button></div><div className="date-chips">{batchDates.map(date => <button type="button" key={date} onClick={() => setBatchDates(batchDates.filter(item => item !== date))}>{date}<span>×</span></button>)}</div></div>}
        </div>
        <footer><span>{repeatRule === "batch" ? `将添加到 ${batchDates.length} 个日期` : repeatRule === "none" ? `添加到 ${selectedDateKey}` : "将按所选周期自动创建"}</span><div><button type="button" onClick={() => setAdding(false)}>取消</button><button className="confirm" type="submit">保存日程</button></div></footer>
      </form>
    </div>}
  </div>;
}

function InlineMarkdown({ text }: { text: string }) {
  return <>{text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g).filter(Boolean).map((part, index) => part.startsWith("**") ? <strong key={index}>{part.slice(2, -2)}</strong> : part.startsWith("`") ? <code key={index}>{part.slice(1, -1)}</code> : part)}</>;
}

function MarkdownPreview({ markdown }: { markdown: string }) {
  return <div className="markdown-preview">{markdown.split("\n").map((line, index) => {
    if (line.startsWith("### ")) return <h3 key={index}><InlineMarkdown text={line.slice(4)}/></h3>;
    if (line.startsWith("## ")) return <h2 key={index}><InlineMarkdown text={line.slice(3)}/></h2>;
    if (line.startsWith("# ")) return <h1 key={index}><InlineMarkdown text={line.slice(2)}/></h1>;
    if (line.startsWith("> ")) return <blockquote key={index}><InlineMarkdown text={line.slice(2)}/></blockquote>;
    if (/^- \[[ xX]\] /.test(line)) return <div className="md-check" key={index}><span className={line[3].toLowerCase() === "x" ? "checked" : ""}>{line[3].toLowerCase() === "x" && <Icon name="check" size={11}/>}</span><InlineMarkdown text={line.slice(6)}/></div>;
    if (line.startsWith("- ")) return <div className="md-list" key={index}><i/> <InlineMarkdown text={line.slice(2)}/></div>;
    if (line.startsWith("```")) return <div className="md-fence" key={index}>代码</div>;
    if (!line.trim()) return <div className="md-space" key={index}/>;
    return <p key={index}><InlineMarkdown text={line}/></p>;
  })}</div>;
}

function scratchDateLabel(value: string) {
  const noteDate = new Date(`${value}T00:00:00`);
  const now = new Date();
  const base = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const days = Math.round((base.getTime() - noteDate.getTime()) / 86400000);
  if (days === 0) return "今天";
  if (days === 1) return "昨天";
  return `${noteDate.getMonth() + 1} 月 ${noteDate.getDate()} 日`;
}

function ScratchNotes({ notes, selected, setSelected, saveNotes }: { notes: Note[]; selected: Note; setSelected: (note: Note) => void; saveNotes: (notes: Note[]) => void }) {
  const [mode, setMode] = useState<"preview" | "edit">("preview");
  const [ideaOpen, setIdeaOpen] = useState(false);
  const [idea, setIdea] = useState("");
  const sorted = [...notes].sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id);
  const groups = sorted.reduce<Record<string, Note[]>>((result, note) => { (result[note.date] ??= []).push(note); return result; }, {});

  function updateSelected(changes: Partial<Note>) {
    const updated = { ...selected, ...changes, time: "刚刚" };
    setSelected(updated);
    saveNotes(notes.map(note => note.id === selected.id ? updated : note));
  }
  function createNote() {
    const note: Note = { id: Date.now(), title: "未命名随手记", body: "# 未命名随手记\n\n从这里写下一点想法……", tag: "随手记", time: "刚刚", color: "sage", date: dateKey(new Date()) };
    saveNotes([note, ...notes]);
    setSelected(note);
    setMode("edit");
  }
  function appendIdea() {
    if (!idea.trim()) return;
    updateSelected({ body: `${selected.body.trim()}\n\n${idea.trim()}` });
    setIdea("");
    setIdeaOpen(false);
    setMode("preview");
  }

  return <div className="scratch-layout">
    <section className="scratch-list">
      <div className="scratch-toolbar"><div><strong>{notes.length}</strong><span>篇随手记</span></div><button onClick={createNote}><Icon name="plus" size={15}/> 新建文件</button></div>
      <div className="scratch-groups">{Object.entries(groups).map(([date, group]) => <section key={date}><header><strong>{scratchDateLabel(date)}</strong><span>{date}</span></header>{group.map(note => <button key={note.id} className={selected.id === note.id ? "active" : ""} onClick={() => { setSelected(note); setMode("preview"); }}><span className={`note-swatch ${note.color}`}/><div><strong>{note.title}</strong><p>{note.body.replace(/[#>*`\[\]-]/g, " ").replace(/\s+/g, " ").trim()}</p><span>{note.time} · Markdown</span></div></button>)}</section>)}</div>
    </section>
    <article className="scratch-document">
      <header><div><span className={`note-swatch ${selected.color}`}/><span>{selected.date} · {selected.tag}</span></div><div className="document-actions"><button onClick={() => setIdeaOpen(!ideaOpen)}><Icon name="plus" size={15}/> 添加想法</button><div className="mode-switch"><button className={mode === "edit" ? "active" : ""} onClick={() => setMode("edit")}>编辑</button><button className={mode === "preview" ? "active" : ""} onClick={() => setMode("preview")}>预览</button></div></div></header>
      {ideaOpen && <div className="idea-composer"><textarea autoFocus value={idea} onChange={event => setIdea(event.target.value)} placeholder="补充一段想法，支持 Markdown…"/><div><button onClick={() => setIdeaOpen(false)}>取消</button><button className="confirm" onClick={appendIdea}>添加到文末</button></div></div>}
      {mode === "edit" ? <div className="markdown-editor"><input value={selected.title} onChange={event => updateSelected({ title: event.target.value })}/><textarea value={selected.body} onChange={event => updateSelected({ body: event.target.value })}/><footer><span>Markdown 编辑</span><span>已自动保存</span></footer></div> : <div className="markdown-document"><MarkdownPreview markdown={selected.body}/><footer><span>Markdown 预览</span><span>最后编辑于 {selected.time}</span></footer></div>}
    </article>
  </div>;
}

function attachmentKind(file: File): AttachmentKind {
  const extension = file.name.split(".").pop()?.toLowerCase();
  if (extension === "md" || extension === "markdown") return "markdown";
  if (file.type.startsWith("text/") || extension === "txt") return "text";
  if (file.type.startsWith("image/")) return "image";
  if (file.type === "application/pdf" || extension === "pdf") return "pdf";
  if (["doc", "docx", "xls", "xlsx", "ppt", "pptx"].includes(extension ?? "")) return "office";
  return "other";
}

function fileSizeLabel(size: number) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${Math.ceil(size / 1024)} KB`;
  return `${(size / 1024 / 1024).toFixed(1)} MB`;
}

async function makeAttachment(file: File): Promise<KnowledgeAttachment> {
  const kind = attachmentKind(file);
  const content = kind === "markdown" || kind === "text" ? await file.text() : await new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = () => reject(reader.error); reader.readAsDataURL(file); });
  return { id: Date.now() + Math.round(Math.random() * 10000), name: file.name, type: file.type, kind, size: fileSizeLabel(file.size), content };
}

function AttachmentPreview({ attachment }: { attachment: KnowledgeAttachment }) {
  if ((attachment.kind === "markdown" || attachment.kind === "text") && attachment.content) return <div className="attachment-text"><MarkdownPreview markdown={attachment.content}/></div>;
  if (attachment.kind === "image" && attachment.content) return <div className="attachment-image"><img src={attachment.content} alt={attachment.name}/></div>;
  if (attachment.kind === "pdf" && attachment.content) return <iframe className="attachment-pdf" src={attachment.content} title={attachment.name}/>;
  return <div className="attachment-unavailable"><Icon name="file" size={34}/><strong>{attachment.name}</strong><span>{attachment.kind === "pdf" ? "PDF 可在导入真实文件后直接预览" : attachment.kind === "office" ? "Word、Excel、PPT 文件可以留存，但需要调用系统应用打开" : "这个格式暂不支持在页面内预览"}</span>{attachment.content && <a href={attachment.content} download={attachment.name}>下载或用其他应用打开</a>}</div>;
}

function KnowledgeBase({ notes, selected, setSelected, saveNotes, notify }: { notes: KnowledgeNote[]; selected: KnowledgeNote; setSelected: (note: KnowledgeNote) => void; saveNotes: (notes: KnowledgeNote[]) => void; notify: (message: string) => void }) {
  const [attachmentId, setAttachmentId] = useState<number | null>(null);
  const importRef = useRef<HTMLInputElement>(null);
  const attachmentRef = useRef<HTMLInputElement>(null);
  const activeAttachment = selected.attachments.find(item => item.id === attachmentId);

  function selectNote(note: KnowledgeNote) { setSelected(note); setAttachmentId(null); }
  function updateKnowledge(changes: Partial<KnowledgeNote>) {
    const updated = { ...selected, ...changes, updatedAt: "刚刚" };
    setSelected(updated);
    saveNotes(notes.map(note => note.id === selected.id ? updated : note));
  }
  function createKnowledgeNote() {
    const note: KnowledgeNote = { id: Date.now(), title: "未命名知识笔记", category: "未分类", updatedAt: "刚刚", body: "# 未命名知识笔记\n\n开始整理一份值得长期保留的内容。", attachments: [] };
    saveNotes([note, ...notes]);
    selectNote(note);
  }
  async function importFiles(files: FileList | null) {
    if (!files?.length) return;
    const imported = await Promise.all(Array.from(files).map(async file => {
      const attachment = await makeAttachment(file);
      const title = file.name.replace(/\.[^.]+$/, "");
      const textBody = attachment.kind === "markdown" || attachment.kind === "text" ? attachment.content ?? "" : `# ${title}\n\n已从电脑导入 **${file.name}**。你可以在这里补充摘要、来源和自己的理解。`;
      return { id: Date.now() + Math.round(Math.random() * 10000), title, category: "电脑导入", updatedAt: "刚刚", body: textBody, attachments: [attachment] } as KnowledgeNote;
    }));
    saveNotes([...imported, ...notes]);
    selectNote(imported[0]);
    notify(`已导入 ${imported.length} 篇知识笔记`);
  }
  async function addAttachments(files: FileList | null) {
    if (!files?.length) return;
    const incoming = await Promise.all(Array.from(files).map(makeAttachment));
    updateKnowledge({ attachments: [...selected.attachments, ...incoming] });
    setAttachmentId(incoming[0].id);
    notify(`已添加 ${incoming.length} 个附件`);
  }

  return <div className="knowledge-layout">
    <section className="knowledge-list"><header><div><strong>知识库</strong><span>{notes.length} 篇正式笔记</span></div><div><button onClick={createKnowledgeNote} aria-label="新建笔记"><Icon name="plus" size={15}/></button><button className="import-button" onClick={() => importRef.current?.click()}><Icon name="upload" size={15}/> 导入</button><input ref={importRef} className="hidden-file" type="file" multiple accept=".md,.markdown,.txt,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,image/*" onChange={event => { void importFiles(event.target.files); event.target.value = ""; }}/></div></header><div className="knowledge-items">{notes.map(note => <button key={note.id} className={selected.id === note.id ? "active" : ""} onClick={() => selectNote(note)}><span className="knowledge-file-icon"><Icon name="file" size={17}/></span><div><strong>{note.title}</strong><p>{note.body.replace(/[#>*`]/g, " ").replace(/\s+/g, " ").trim()}</p><footer><span>{note.category}</span><em><Icon name="paperclip" size={11}/>{note.attachments.length}</em></footer></div></button>)}</div></section>
    <section className="knowledge-workspace">
      <aside className="attachment-rail"><header><div><strong>附件</strong><span>{selected.attachments.length} 个文件</span></div><button onClick={() => attachmentRef.current?.click()} aria-label="添加附件"><Icon name="plus" size={14}/></button><input ref={attachmentRef} className="hidden-file" type="file" multiple onChange={event => { void addAttachments(event.target.files); event.target.value = ""; }}/></header><button className={!activeAttachment ? "active" : ""} onClick={() => setAttachmentId(null)}><Icon name="notes" size={17}/><span><strong>笔记正文</strong><small>Markdown</small></span></button>{selected.attachments.map(file => <button key={file.id} className={attachmentId === file.id ? "active" : ""} onClick={() => setAttachmentId(file.id)}><Icon name={file.kind === "image" ? "camera" : file.kind === "markdown" || file.kind === "text" ? "notes" : "file"} size={17}/><span><strong>{file.name}</strong><small>{file.size} · {file.kind.toUpperCase()}</small></span></button>)}<div className="format-note"><strong>可直接预览</strong><span>MD、TXT、PDF、JPG、PNG、WebP</span><strong>调用系统打开</strong><span>Word、Excel、PPT 与其他格式</span></div></aside>
      <article className="knowledge-document">{activeAttachment ? <><header><div><button onClick={() => setAttachmentId(null)}><Icon name="back" size={16}/> 返回正文</button><span>{activeAttachment.name}</span></div>{activeAttachment.content && <a href={activeAttachment.content} download={activeAttachment.name}>下载附件</a>}</header><div className="attachment-stage"><AttachmentPreview attachment={activeAttachment}/></div></> : <><header><div><span className="knowledge-category">{selected.category}</span><span>{selected.updatedAt}</span></div><button onClick={() => attachmentRef.current?.click()}><Icon name="paperclip" size={15}/> 添加附件</button></header><div className="knowledge-note-body"><input value={selected.title} onChange={event => updateKnowledge({ title: event.target.value })}/><textarea value={selected.body} onChange={event => updateKnowledge({ body: event.target.value })}/><div className="knowledge-preview-label"><span>Markdown 预览</span><em>自动保存</em></div><MarkdownPreview markdown={selected.body}/></div></>}</article>
    </section>
  </div>;
}
