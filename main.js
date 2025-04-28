console.log('main process is working');

const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require("path");
const url = require("url");


let win;

//Creating the main window
function createWindow(){
    win = new BrowserWindow({
        minWidth: 1280, 
        minHeight: 720,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        }});
    //opens index.html
    win.loadURL(url.format({
        pathname: path.join(__dirname, "index.html"),
        protocol: "file",
        slashes: true
    }));
    win.maximize();
    //opens devtools upon initiation
    win.webContents.openDevTools();
    //removes menu bar
    win.setMenu(null);
    //closes window and main process
    win.on('closed', () => {
        win = null;
    });
}

//initiates main process
app.on('ready', createWindow);