import { app, BrowserWindow } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

let mainWindow;

// Create __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    fullscreen: true,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, // Allow using Node APIs in the renderer process
      enableRemoteModule: true, // Needed for remote module usage
    },
  });

  // Load the appropriate URL based on app packaging status
  const startUrl = app.isPackaged
    ? `file://${path.resolve(path.join(__dirname, '../dist/index.html'))}` // Adjust to the dist folder
    : 'http://localhost:5173/'; // Your React development server URL

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
