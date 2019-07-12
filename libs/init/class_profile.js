const ipcRenderer = require('electron').ipcRenderer;
const path = require('path');
const populateAttendees = require(path.join(__dirname, '../libs/init/populateAttendees'))
const populateTeachers = require(path.join(__dirname, '../libs/init/populateTeachers'));
const populateLevels = require(path.join(__dirname, '../libs/init/populateLevels'));

const toggleInputs = require(path.join(__dirname, '../libs/utility/toggleInputs'));

const classDataPackager = require(path.join(__dirname, '../libs/utility/packageClassData'));
const classValidator = require(path.join(__dirname, '../libs/utility/classValidator'));
const Datastore = require('nedb');

ipcRenderer.on('sending class data', (e, data)=>{
        const getById = (string)=>{
            return document.getElementById(`${string}`)
        }
        const getByClass = (string)=>{
            return document.getElementsByClassName(`${string}`)
        }
        const fields = {
            name : getById('class_name'),
            language : getByClass('language'),
            attendees : getById('attendees'),
            teacher : getById('teachers'),
            level : getById('levels'),
            amount: getById('rate'),
            schedule : getByClass('day')
        }
        fields.name.value = data.name;
        getById(data.language[0]).checked = true;
        populateAttendees().then(populateTeachers).then(populateLevels).then(()=>{
            data.attendees.forEach(student => {
                for(let option of fields.attendees.options){
                    if(student == option.value){
                        option.selected = true;
                    }
                }
            });
            fields.teacher.value = data.teacher;
            fields.level.value = data.level;
            fields.amount.value = data.amount;
            require(path.join(__dirname, '../libs/init/schedulingListener'));
            data.schedule.forEach(schedule => {
                document.getElementById(schedule.day).checked = true;
                document.getElementById(`${schedule.day}_time`).value = schedule.start;
                document.getElementById(`${schedule.day}_time`).disabled = false;
                document.getElementById(`${schedule.day}_duration`).value = schedule.duration;
                document.getElementById(`${schedule.day}_duration`).disabled = false;
            });
            require(path.join(__dirname, '../libs/init/selectInit'))
            M.updateTextFields();
            const all_inputs = document.getElementsByTagName('input');
            for(let input of all_inputs){
                input.disabled = true;
            }

            let editMode = false;
            const lockIcon = document.getElementById('lock-icon');

            document.getElementById('edit').addEventListener('click', (e)=>{
                if(editMode){
                    const classData = classDataPackager();
                    classData.date_created = new Date(data.date_created);
                    const validation = classValidator(classData)
                    if(validation.validated){
                        const db = new Datastore({
                            filename : path.join(__dirname, '../nedb/class.db'),
                            autoload : true
                        })
                        db.update({  _id : data._id }, classData, {}, (err, numReplaced)=>{
                            if(err){
                                console.log(err);
                            } 
                            else{
                                ipcRenderer.send('class_db_updated', null);
                            }
                        })
                        toggleInputs('class', fields);
                        editMode = false;
                        lockIcon.innerHTML = 'lock';
                    }else{
                        const error = document.getElementById('error');
                        error.textContent = validation.message;
                        setTimeout(()=>{
                            validation.field.focus();
                            error.textContent = '';
                        }, 3000)
                    }
                }else{
                    editMode = true;
                    lockIcon.innerHTML = 'lock_open';
                    toggleInputs('class', fields)
                }
            })
        });
    })