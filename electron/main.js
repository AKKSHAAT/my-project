import { app, BrowserWindow } from 'electron';
import path from 'path';
import isDev from 'electron-is-dev';

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    fullscreen: true,
    frame:false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, // Allow using Node APIs in the renderer process
      enableRemoteModule: true, // Needed for remote module usage
    },
  });

  const startUrl = isDev
    ? 'http://localhost:5173/' // Replace with your React development server URL
    : `file://${path.join(__dirname, '../build/index.html')}`;
  
  mainWindow.loadURL(startUrl);

  mainWindow.on('closed', () => (mainWindow = null));
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
