const path = require('path');
const getChecked = require(path.join(__dirname, '../utility/getChecked'));
const classValidator = require(path.join(__dirname, '../utility/classValidator'));
const capitalize = require(path.join(__dirname, '../utility/capitalize'));
const Datastore = require('nedb');
const { remote } = require('electron');
const { dialog } = require('electron').remote;
const ipcRenderer = require('electron').ipcRenderer;

module.exports = (()=>{
    const button = document.getElementById('add-class');
    button.addEventListener('click', ()=>{
        
        
        const data = {
            name: capitalize(document.getElementById('class_name').value),
            language: getChecked(document.getElementsByClassName('language')),
            attendees: (()=>{
                var instance = M.FormSelect.getInstance(document.getElementById('attendees'));
                return instance.getSelectedValues();
            })(),
            teacher: document.getElementById('teachers').value,
            level: document.getElementById('levels').value,
            schedule: (()=>{
                const arr = [];
                const boxes = document.getElementsByClassName('day');
                for(let box of boxes){
                    if(box.checked){
                        const day = box.getAttribute('day');
                        arr.push({
                            day : day,
                            start : (()=>{
                                const timepicker = M.Timepicker.getInstance(document.getElementById(`${day}_time`))
                                return timepicker.time
                            })(),
                            duration : document.getElementById(`${day}_duration`).value
                        })
                    }
                }
                return arr;
            })(),
            monthly_rate : document.getElementById('rate').value,
            date_created: new Date(),
            date_modified: new Date()
        }
        const validation = classValidator(data);
        if(validation.validated){
            const class_db = new Datastore({
                filename : path.join(__dirname, '../../nedb/class.db'),
                autoload : true
            });
            console.log(data)
            class_db.insert(data, (err, newDoc)=>{
                if(err){ throw err }
                else{
                    // send message to refresh tables and show dialog
                    ipcRenderer.send('class_db_updated', null);

                    dialog.showMessageBox(remote.getCurrentWindow(),{
                        type : 'info',
                        buttons : ['OK'],
                        message : `You have successfully added ${newDoc.name}!`
                    },()=>{
                        remote.getCurrentWindow().close();
                    })
                }
            })

        }else{
            const error = document.getElementById('error');
            error.textContent = validation.message;
            setTimeout(()=>{
                validation.field.focus();
                error.textContent = '';
            }, 3000)
        }
        
    })
    
    
})();


