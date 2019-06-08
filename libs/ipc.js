const { ipcMain } = require('electron')
const modal = require('./modal')

module.exports = (()=>{
    ipcMain.on('add-student', (event, arg)=>{
        modal(arg.url, arg.title, ()=>{
            // add details to load from db here
            console.log('loaded');
        })
    })
})();
