const Datastore = require('nedb');
const path = require('path');
const {
    remote,
    ipcRenderer
} = require('electron');
const {
    BrowserWindow
} = require('electron').remote;

let selection = [];

// Create/Load the NEDB datastore (table)
let db = new Datastore({
    filename: path.join(__dirname, '../nedb/students.db'),
    autoload: true
})

const getAllRecords = (refreshRecords = false) => {
    if (refreshRecords) {
        db = new Datastore({
            filename: path.join(__dirname, '../nedb/students.db'),
            autoload: true
        })
    }
    db.find({}, (err, docs) => {
        if (err) {
            console.log(err);
        } else {
            populateTable(docs);
        }
    })
}

const populateTable = (docs) => {
    // Insert the HTML for each returned document
    const tBody = document.querySelector('tbody');
    tBody.innerHTML = '';
    docs.forEach(doc => {
        tBody.innerHTML +=
            `
        <tr>
            <td>${doc.first_names}</td>
            <td>${doc.second_names}</td>
            <td>${ageFromDate(doc.dob)}</td>
            <td student_id="${doc._id}"><i class="material-icons open-profile">info</i></td>
            <td student_id="${doc._id}"><i class="material-icons email-student">email</i></td>
            <td class="show-phone" student_id="${doc._id}"><i class="material-icons">phone</i></td>
            <td class="edit-profile" student_id="${doc._id}"><i class="material-icons">edit</i></td>
            <td student_id="${doc._id}"><i class="material-icons delete-student">delete</i></td>
            <td>
                <label>
                    <input type="checkbox" student_id="${doc._id}" class="filled-in checkbox" />
                    <span>Select</span>
                </label>
            </td>
        </tr>
        `
    });

    // Add listeners to the Info/Edit buttons
    const info_buttons = document.getElementsByClassName('open-profile');
    for(let info_button of info_buttons){
        info_button.addEventListener('click', (e)=>{
            const id = e.target.parentElement.getAttribute('student_id')
            db.findOne({ _id : id }, (err, doc)=>{
                let profileWindow = new BrowserWindow({
                    parent: remote.getCurrentWindow(),
                    modal: true,
                    width: 700,
                    height: 620,
                    webPreferences: {
                        nodeIntegration: true
                    }
                })
                profileWindow.maximize();
                profileWindow.loadFile(path.join(__dirname, '/student_profile.html'));
                profileWindow.setTitle(`Student profile: ${doc.first_names} ${doc.second_names}`)
                profileWindow.on('closed', () => {
                    profileWindow = null;
                })
                profileWindow.webContents.once('dom-ready', ()=>{
                    profileWindow.webContents.send('sending student data', doc)
                })
            })
        })
    }
    
    // Add listeners to the 'Email' buttons
    const email_buttons = document.getElementsByClassName('email-student');
    for (let btn of email_buttons) {
        btn.addEventListener('click', (e) => {
            const id = (e.target.parentElement.getAttribute('student_id'))
            // do something with id
        })
    }

    const checkboxes = document.getElementsByClassName('checkbox');

    // Add listeners to the 'Select' checkboxes
    for (let checkbox of checkboxes) {
        checkbox.addEventListener('change', (e) => {
            var student_id = e.target.getAttribute('student_id');
            if (e.target.checked) {
                selection.push(student_id);
            } else {
                selection.splice(selection.indexOf(student_id), 1)
            }
        })
    };

    // Add listener to the 'Select all' checkbox
    document.getElementById('check-all').addEventListener('click', (e) => {
        if (e.target.checked) {
            selection = []
            for (let checkbox of checkboxes) {
                checkbox.checked = true;
                selection.push(checkbox.getAttribute('student_id'));
            }
        } else {
            selection = []
            for (let checkbox of checkboxes) {
                checkbox.checked = false;
            }
        }
    })

    // Add listeners to the delete buttons
    const deleteBtns = document.getElementsByClassName('delete-student')
    for (let btn of deleteBtns) {
        btn.addEventListener('click', (e) => {
            const student_id = e.target.parentElement.getAttribute('student_id')
            db.find({
                _id: student_id
            }, (err, docs) => {
                if (err) {
                    throw err
                } else {
                    const name = docs[0].first_names;
                    remote.dialog.showMessageBox(remote.getCurrentWindow(), {
                        type: 'question',
                        buttons: ['No', 'Yes'],
                        title: 'Delete',
                        message: `Are you sure you want to delete ${name}?`
                    }, (response) => {
                        if (response) {
                            db.remove({
                                _id: student_id
                            }, (err) => {
                                if (err) {
                                    throw err
                                } else {
                                    getAllRecords()
                                }
                            })
                        }
                    })
                }
            })
        })
    }
}

const filterQueryBuilder = () => {
    const filterName = document.getElementById('filter-name')
    query = {}

    filterName.addEventListener('keyup', (e) => {
        query.$or = [{
            first_names: new RegExp(filterName.value, 'i')
        }, {
            second_names: new RegExp(filterName.value, 'i')
        }]
        runFilterQuery(query);
    })

    const filterAges = {
        lowest: document.getElementById('filter-age-lowest'),
        highest: document.getElementById('filter-age-highest')
    }
    for (let filter in filterAges) {
        const ageFilterListener = () => {
            query.dob = {
                $lt: dateFromAge(filterAges.lowest.value),
                $gt: dateFromAge(filterAges.highest.value)
            }
            runFilterQuery(query);
        }
        filterAges[filter].addEventListener('keyup', ageFilterListener)
        filterAges[filter].addEventListener('change', ageFilterListener)
    }
    runFilterQuery(query);
}

const runFilterQuery = (query) => {
    selection = [];
    db.find(query, (err, docs) => {
        if (err) {
            throw err
        } else {
            populateTable(docs);
        }
    })
}

const dateFromAge = (age) => {
    let currentDate = new Date();
    let comparisonDate = new Date();
    comparisonDate.setFullYear(currentDate.getFullYear() - age);
    return comparisonDate;
}

const ageFromDate = (date) => {
    let currentDate = new Date();
    let dob = date;
    let age = currentDate.getFullYear() - dob.getFullYear();
    let m = currentDate.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && currentDate.getDate() < dob.getDate())) {
        age--;
    }
    return age
}

const getChecked = (collection) => {
    console.log('called getchecked')
    let selected_ids = [];
    for (let box of collection) {
        if (box.checked) {
            selected_ids.push(box.getAttribute('student_id'))
        }
    }
    return selected_ids;
}

// Initialise the directory
const _init = (() => {
    // Add New Student listener
    document.getElementById('student_add').addEventListener('click', () => {
        let test = new BrowserWindow({
            modal: true,
            width: 700,
            height: 620,
            webPreferences: {
                nodeIntegration: true
            }
        })
        test.loadFile('./html/student_add.html');
        test.setTitle('Add New Student')
        test.on('closed', () => {
            test = null;
        })
    })

    // Add toggle listener for filters checkbox
    const filters = document.querySelector('.filter');
    document.getElementById('toggle-filter').addEventListener('change', (e) => {
        if (e.target.checked) {
            filters.classList.remove('hide');
            filterQueryBuilder();
        } else {
            filters.classList.add('hide');
            getAllRecords();
        }
    })

    // Add listener to the email all/group button
    document.getElementById('group-email').addEventListener('click', () => {
        // do something with checked_ids
        console.log(selection)
    })

    // Add listener to the delete all/group button
    document.getElementById('group-delete').addEventListener('click', () => {
        remote.dialog.showMessageBox(remote.getCurrentWindow(), {
            title: 'Delete',
            message: `You are about to delete ${selection.length} record(s).  You cannot undo this operation.  Are you sure you want to proceed?`,
            buttons: ['Yes', 'No']
        }, (response) => {
            if (response === 0) {
                const multiDeleteQuery = [];
                selection.forEach(id => {
                    multiDeleteQuery.push({
                        _id: id
                    })
                });
                db.remove({
                    $or: multiDeleteQuery
                }, {
                    multi: true
                }, (e) => {
                    if (e) throw e;
                    else {
                        selection = []
                        getAllRecords(true)
                    }
                })
            }
        })
    })

    // Get all records in the datastore by default
    getAllRecords();
})();

ipcRenderer.on('db_updated', () => {
    getAllRecords(true);
})