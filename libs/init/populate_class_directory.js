const Datastore = require('nedb');
const path = require('path');

const capitalize = require(path.join(__dirname, '../utility/capitalize'));
const get_teacher = require(path.join(__dirname, '../utility/get_teacher'));
const get_students = require(path.join(__dirname, '../utility/get_students'));
const get_level = require(path.join(__dirname, '../utility/get_level'));
const get_average_age = require(path.join(__dirname, '../utility/get_average_age'));
const schedule_extractor = require(path.join(__dirname, '../utility/class_schedule_extractor'));
const {
    remote,
    ipcRenderer
} = require('electron');
const {
    BrowserWindow
} = require('electron').remote;

module.exports = (()=>{
    
    // create the Class datastore
    const class_db = new Datastore({
        filename : path.join(__dirname, '../../nedb/class.db'),
        autoload : true
    });

    // retrieve all records from the class datastore
    class_db.find({}, (err, docs)=>{
        if(err) throw err
        else{
            const tbody = document.getElementById('tbody');
            tbody.innerHTML = '';
            docs.forEach(doc => {

                // grab relevant data from other datastores
                const non_local_data = {};
                    get_teacher(doc.teacher).then((value)=>{
                        non_local_data.teacher = value
                        return get_students(doc.attendees)
                    }).then((value)=>{
                        non_local_data.students = value
                        return get_level(doc.level)
                    }).then((value)=>{ 
                        non_local_data.level = value;
                        return get_average_age(doc.attendees)
                    }).then((value)=>{
                        non_local_data.average_age = value
                    }).then(()=>{
                         // we are now ready to populate data
                        
                        // format schedule string
                        var schedule_string = '';
                        for(let i = 0; i < doc.schedule.length; i++){
                            schedule_string += schedule_extractor(doc.schedule[i])
                        }

                        // populate fields
                        tbody.innerHTML += `<tr>
                        <td>${doc.name}</td>
                        <td>${capitalize(doc.language[0])}</td>
                        <td>${non_local_data.teacher}</td>
                        <td>${non_local_data.students.length}</td>
                        <td>${schedule_string}</td>
                        <td>${non_local_data.level}</td>
                        <td>${non_local_data.average_age}</td>
                        <td><i class="material-icons infoedit" student="${doc._id}">info</i></td>
                        `
                    }).then(()=>{
                        const info_edit_btns = document.getElementsByClassName('infoedit');
                        for(let btn of info_edit_btns){
                            btn.addEventListener('click',(e)=>{
                                class_db.findOne({ _id: e.target.getAttribute('student')}, (err, doc)=>{
                                    let class_info_edit_window = new BrowserWindow({
                                        parent : remote.getCurrentWindow(),
                                        modal: true,
                                        width: 700,
                                        height: 620,
                                        webPreferences: {
                                            nodeIntegration: true
                                        }
                                    });
                                    class_info_edit_window.loadFile(path.join(__dirname, '../../html/class_profile.html'))
                                    class_info_edit_window.setTitle('Class profile');
                                    class_info_edit_window.on('closed', ()=>{
                                        class_info_edit_window = null;
                                    })
                                    class_info_edit_window.webContents.once('dom-ready', ()=>{
                                        class_info_edit_window.webContents.send('sending class data', doc)
                                    })
                                })
                            })
                        }
                    })
            });
        }
    })
});