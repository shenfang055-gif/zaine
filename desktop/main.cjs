const { app, BrowserWindow, ipcMain, screen, shell } = require("electron");
const path = require("path");

app.setName("在呢 ZAI NE");

const COLLAPSED_WIDGET = { width: 82, height: 82 };
const EXPANDED_WIDGET = { width: 390, height: 500 };
let mainWindow = null;
let widgetWindow = null;

function clamp(value, minimum, maximum) {
  return Math.min(Math.max(value, minimum), maximum);
}

function workAreaFor(bounds) {
  return screen.getDisplayNearestPoint({
    x: bounds.x + Math.round(bounds.width / 2),
    y: bounds.y + Math.round(bounds.height / 2),
  }).workArea;
}

function resizeWidget(expanded, animate = true) {
  if (!widgetWindow || widgetWindow.isDestroyed()) return;
  const current = widgetWindow.getBounds();
  const target = expanded ? EXPANDED_WIDGET : COLLAPSED_WIDGET;
  const workArea = workAreaFor(current);
  const right = current.x + current.width;
  const bottom = current.y + current.height;
  widgetWindow.setBounds({
    width: target.width,
    height: target.height,
    x: clamp(right - target.width, workArea.x, workArea.x + workArea.width - target.width),
    y: clamp(bottom - target.height, workArea.y, workArea.y + workArea.height - target.height),
  }, animate);
  widgetWindow.webContents.send("widget:expanded-state", expanded);
  if (expanded) widgetWindow.focus();
}

function showWidget() {
  if (!widgetWindow || widgetWindow.isDestroyed()) createWidgetWindow();
  resizeWidget(false, false);
  widgetWindow.showInactive();
  widgetWindow.moveTop();
}

function hideWidget() {
  if (!widgetWindow || widgetWindow.isDestroyed()) return;
  resizeWidget(false, false);
  widgetWindow.hide();
}

function moveWidget(deltaX, deltaY) {
  if (!widgetWindow || widgetWindow.isDestroyed()) return;
  if (!Number.isFinite(deltaX) || !Number.isFinite(deltaY)) return;
  const bounds = widgetWindow.getBounds();
  const workArea = workAreaFor(bounds);
  const x = clamp(Math.round(bounds.x + deltaX), workArea.x, workArea.x + workArea.width - bounds.width);
  const y = clamp(Math.round(bounds.y + deltaY), workArea.y, workArea.y + workArea.height - bounds.height);
  widgetWindow.setPosition(x, y, false);
}

function createWidgetWindow() {
  const workArea = screen.getPrimaryDisplay().workArea;
  widgetWindow = new BrowserWindow({
    width: COLLAPSED_WIDGET.width,
    height: COLLAPSED_WIDGET.height,
    x: workArea.x + workArea.width - COLLAPSED_WIDGET.width - 22,
    y: workArea.y + workArea.height - COLLAPSED_WIDGET.height - 22,
    transparent: true,
    frame: false,
    resizable: false,
    movable: true,
    maximizable: false,
    minimizable: false,
    fullscreenable: false,
    skipTaskbar: true,
    alwaysOnTop: true,
    hasShadow: false,
    show: false,
    title: "在呢随手记",
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  widgetWindow.setAlwaysOnTop(true, "floating", 1);
  if (process.platform === "darwin") {
    widgetWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  }
  widgetWindow.loadFile(path.join(__dirname, "..", "dist-desktop", "widget.html"));
  widgetWindow.on("closed", () => { widgetWindow = null; });
}

function createWindow() {
  const isMac = process.platform === "darwin";
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 980,
    minHeight: 680,
    backgroundColor: "#f5f2ec",
    show: false,
    title: "在呢 ZAI NE",
    titleBarStyle: isMac ? "hiddenInset" : "hidden",
    titleBarOverlay: isMac ? false : { color: "#e6e2da", symbolColor: "#3f4744", height: 42 },
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  mainWindow.once("ready-to-show", () => mainWindow.show());
  mainWindow.on("minimize", showWidget);
  mainWindow.on("restore", hideWidget);
  mainWindow.on("show", () => { if (!mainWindow.isMinimized()) hideWidget(); });
  mainWindow.on("closed", () => {
    mainWindow = null;
    if (widgetWindow && !widgetWindow.isDestroyed()) widgetWindow.close();
  });
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https://") || url.startsWith("http://")) shell.openExternal(url);
    return { action: "deny" };
  });
  mainWindow.loadFile(path.join(__dirname, "..", "dist-desktop", "index.html"));
  createWidgetWindow();
}

ipcMain.on("widget:set-expanded", (_event, expanded) => resizeWidget(Boolean(expanded)));
ipcMain.on("widget:move", (_event, deltaX, deltaY) => moveWidget(Number(deltaX), Number(deltaY)));
ipcMain.on("widget:show", () => {
  showWidget();
  resizeWidget(true);
});
ipcMain.on("widget:save-note", (_event, note) => {
  if (!note || typeof note.body !== "string" || !note.body.trim()) return;
  if (mainWindow && !mainWindow.isDestroyed()) mainWindow.webContents.send("desktop:quick-note-saved", note);
});

app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (!mainWindow || mainWindow.isDestroyed()) createWindow();
    else mainWindow.show();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
