const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path')
require('electron-watch')(path.join(__dirname, './html'), 'start', path.join(__dirname, './'), 2000);
 
//global variable for window object
let win;

const createWindow = ()=>{
    win = new BrowserWindow({
        fullscreen: true,
        webPreferences: {
            nodeIntegration: true
        }
    });
    // win.loadFile('./html/login.html')
    // win.loadFile('./html/add_payment.html')
    win.loadFile('./html/dashboard.html')
    win.setTitle("El Rincón de Idiomas");
    win.setMinimumSize(800, 600);
    win.on('closed', ()=> { win = null })
    win.webContents.on('did-finish-load', ()=>{
        
    });
    
}

app.on('ready', createWindow)

ipcMain.on('db_update', (e, args)=>{
    win.webContents.send('db_updated', 'updated');
})

ipcMain.on('class_db_updated', (e, args)=>{
    win.webContents.send('db_updated', 'updated');
})