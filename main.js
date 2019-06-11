const { app, BrowserWindow } = require('electron');
const path = require('path')
// require('electron-watch')(__dirname, 'start', path.join(__dirname, './'), 2000);
 
//global variable for window object
let win;

const createWindow = ()=>{
    win = new BrowserWindow({
        width: 900,
        height: 650,
        webPreferences: {
            nodeIntegration: true
        }
    });
    win.loadFile('./html/login.html')
    // win.loadFile('./html/student_directory.html')
    win.setTitle("El Rincón de Idiomas");
    win.setMinimumSize(800, 600);
    win.on('closed', ()=> { win = null })
    win.webContents.on('did-finish-load', ()=>{

    })
}

app.on('ready', createWindow)
