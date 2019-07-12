const { ipcMain } = require('electron')
const modal = require('./modal')

module.exports = (()=>{
    ipcMain.on('delete-student', (event, arg)=>{
        modal(arg.url, arg.title, ()=>{
            // add details to load from db here
            console.log('loaded');
        })
    })
})();
