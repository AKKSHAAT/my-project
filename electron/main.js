import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import fs from 'fs';  // File system module for writing to LPT port
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
  
  ipcMain.handle('print-receipt', async (event, receiptText) => {
    console.log("receiptText");
    return printReceipt(receiptText);  // Pass the receipt text to the printer function
  });

  mainWindow.on('closed', () => (mainWindow = null));
}

async function printReceipt(receiptText) {
  try {
    // Write the receipt text to the LPT1 port (adjust if you use LPT2, etc.)
    const lptPort = '\\\\.\\LPT1';  // Windows uses this format for LPT ports

    fs.writeFile(lptPort, receiptText, function (err) {
      if (err) {
        console.error('Error writing to LPT port:', err);
        return { success: false, error: err };
      }
      console.log('Receipt sent to printer successfully!');
      return { success: true };
    });
  } catch (error) {
    console.error('Error during printing:', error);
    return { success: false, error };
  }
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


