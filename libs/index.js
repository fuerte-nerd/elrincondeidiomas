document.getElementById('btn-add-student').addEventListener('click', ()=>{
    const ipcRenderer = require('electron').ipcRenderer;
    ipcRenderer.send('add-student', {
        title: 'Add Student',
        url: './html/add_student.html'
    })
})