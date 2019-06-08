const { BrowserWindow } = require('electron');

module.exports = (()=>{
    return (url, title, onload)=>{
        console.log(typeof(url))
        let win = new BrowserWindow({
            width: 800,
            height: 550,
            webPreferences: {
                nodeIntegration: true
            },
            resizable: false
        });
        win.loadFile(url)
        win.setTitle(title);
        win.on('closed', ()=> { win = null })
        win.webContents.on('did-finish-load', onload)
    }
})();
