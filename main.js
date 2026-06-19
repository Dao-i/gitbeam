const { app, BrowserWindow, screen, Tray, Menu, ipcMain, session } = require("electron");
const path = require("path");

let win, tray;
let isMini = false;
const NORMAL_SIZE = { w: 420, h: 620 };
const MINI_SIZE = { w: 180, h: 42 };

function setupProxy() {
  // Set system proxy for GitHub API access (Clash/V2Ray etc.)
  session.defaultSession.setProxy({
    proxyRules: "http://127.0.0.1:7897",
    proxyBypassRules: "<-loopback>",
  }).catch(() => {
    // Proxy not available, fall back to direct
    session.defaultSession.setProxy({ proxyRules: "" }).catch(() => {});
  });
}

function createWindow() {
  const { width: screenW } = screen.getPrimaryDisplay().workAreaSize;

  win = new BrowserWindow({
    width: NORMAL_SIZE.w,
    height: NORMAL_SIZE.h,
    x: screenW - NORMAL_SIZE.w - 16,
    y: 60,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    hasShadow: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  win.setAlwaysOnTop(true, "floating");
  win.loadFile("renderer.html");

  try {
    const iconPath = path.join(__dirname, "icon.png");
    tray = new Tray(iconPath);
    tray.setToolTip("GitBeam — GitHub 项目推送");
    tray.setContextMenu(
      Menu.buildFromTemplate([
        { label: "显示/隐藏", click: () => (win.isVisible() ? win.hide() : win.show()) },
        { label: "展开/折叠", click: () => toggleMini() },
        { label: "下一张", click: () => win.webContents.send("next-card") },
        { type: "separator" },
        { label: "退出", click: () => app.quit() },
      ])
    );
  } catch (e) {
    console.error("Tray init failed:", e.message);
  }

  win.on("close", (e) => {
    e.preventDefault();
    win.hide();
  });

  ipcMain.on("minimize-window", () => { win.minimize(); });
  ipcMain.on("toggle-mini", () => { toggleMini(); });
}

function toggleMini() {
  const { width: screenW } = screen.getPrimaryDisplay().workAreaSize;
  isMini = !isMini;

  if (isMini) {
    win.setSize(MINI_SIZE.w, MINI_SIZE.h);
    win.setPosition(screenW - MINI_SIZE.w - 16, 60);
  } else {
    win.setSize(NORMAL_SIZE.w, NORMAL_SIZE.h);
    win.setPosition(screenW - NORMAL_SIZE.w - 16, 60);
  }
  win.webContents.send("mini-changed", isMini);
}

app.whenReady().then(() => { setupProxy(); createWindow(); });

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (!win) createWindow();
});
