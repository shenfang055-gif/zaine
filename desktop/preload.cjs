const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("zaineDesktop", {
  isDesktop: true,
  showQuickWidget: () => ipcRenderer.send("widget:show"),
  onQuickNoteSaved: (callback) => {
    const handler = (_event, note) => callback(note);
    ipcRenderer.on("desktop:quick-note-saved", handler);
    return () => ipcRenderer.removeListener("desktop:quick-note-saved", handler);
  },
});

contextBridge.exposeInMainWorld("zaineWidget", {
  setExpanded: (expanded) => ipcRenderer.send("widget:set-expanded", expanded),
  moveBy: (deltaX, deltaY) => ipcRenderer.send("widget:move", deltaX, deltaY),
  saveNote: (note) => ipcRenderer.send("widget:save-note", note),
  onExpandedState: (callback) => {
    const handler = (_event, expanded) => callback(Boolean(expanded));
    ipcRenderer.on("widget:expanded-state", handler);
    return () => ipcRenderer.removeListener("widget:expanded-state", handler);
  },
});
