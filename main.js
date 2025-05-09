const { app, BrowserWindow, ipcMain, desktopCapturer, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');

let loadingWindow;
let mainWindow;

function createWindow(options, fileName) {
  const window = new BrowserWindow({
    width: 1100,
    height: 700,
    autoHideMenuBar: true,
    titleBarStyle: 'hidden', // ✅ Keep custom title bar
    titleBarOverlay: options.titleBarOverlay ?? true, // 👈 Only apply if provided
    title: 'Vortex Client',
    icon: path.join(__dirname, 'assets/images/Vortex-Client-App-Logo.png'),
    resizable: true,
    fullscreenable: false, // 🔒 Prevent OS fullscreen
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
    ...options,
  });

  window.loadFile(fileName);

  // Block F11 or programmatic fullscreen
  window.on('enter-full-screen', () => {
    window.setFullScreen(false);
  });

  // Block maximize via button/double-click
  window.on('maximize', () => {
    window.unmaximize();
  });

  window.on('closed', () => {
    if (window === loadingWindow) {
      loadingWindow = null;
    } else if (window === mainWindow) {
      mainWindow = null;
    }
  });

  return window;
}

function createLoadingWindow() {
  loadingWindow = createWindow(
    {
      frame: false,
      titleBarStyle: 'hiddenInset'
    },
    'loading.html'
  );

  setTimeout(() => {
    createMainWindow();
    if (loadingWindow) {
      loadingWindow.close();
    }
  }, 3000);
}

function createMainWindow() {
  mainWindow = createWindow(
    {
      width: 1250,
      height: 800,
      titleBarOverlay: {
        color: '#080808',
        symbolColor: '#FF4D4D'
      }
    },
    'index.html'
  );

  mainWindow.on('close', (event) => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      event.preventDefault();
      mainWindow.destroy();
    }
  });

  ipcMain.on('load-url', (event, url) => {
    if (!url) {
      event.reply('error', 'Invalid URL');
      return;
    }

    createURLWindow(url);
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.close();
    }
  });
}

function createURLWindow(url) {
  const urlWindow = new BrowserWindow({
    width: 1100,
    height: 700,
    autoHideMenuBar: true,
    titleBarStyle: 'default',
    title: 'Vortex Client',
    frame: true,
    icon: path.join(__dirname, 'assets/images/Vortex-Client-App-Logo.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  urlWindow.loadURL(url);

  urlWindow.on('close', (event) => {
    if (urlWindow && !urlWindow.isDestroyed()) {
      event.preventDefault();
      urlWindow.destroy();
    }
  });

  urlWindow.on('closed', () => {
    urlWindow.destroy();
  });
}

app.whenReady().then(() => {
  createLoadingWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createLoadingWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
