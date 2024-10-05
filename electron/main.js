import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import pkg from 'electron-pos-printer'; // Import the whole package
const { PosPrinter } = pkg;
// Create __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    fullscreen: true,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, // Allows Node.js APIs directly in the renderer
      enableRemoteModule: true, // Enable remote module usage
    },
  });

  const startUrl = app.isPackaged
    ? `file://${path.resolve(path.join(__dirname, "../dist/index.html"))}`
    : "http://localhost:5173/";

  mainWindow.loadURL(startUrl);
  mainWindow.webContents.openDevTools();

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// Handle request for printer list
ipcMain.handle("get-printers", async (event) => {
  const printers = await mainWindow.webContents.getPrintersAsync();
  return printers; // Return printers to renderer process
});

// Listen for print requests from the renderer process
ipcMain.on("print-request", (event, printData) => {
  // Get printer details from the printData and send it to PosPrinter
  const options = {
    preview: false,
    margin: "0 0 0 0",
    copies: 1,
    printerName: printData.printerName,
    timeOutPerLine: 400,
    silent: true,
    pageSize: "72mm", // Use 72mm width
  };

  PosPrinter.print(printData.data, options)
    .then(() => {
      event.reply("print-success", "Print successful");
    })
    .catch((error) => {
      event.reply("print-error", error.message);
    });
});
