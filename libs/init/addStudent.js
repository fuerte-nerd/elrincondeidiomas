const { ipcRenderer } = require('electron')
const path = require('path');

const getChecked = require(path.join(__dirname, '../libs/utility/getChecked'));
const validation = require(path.join(__dirname, '../libs/utility/formValidation'))
const dateFromString = require(path.join(__dirname, '../libs/utility/dateFromString'));

document.getElementById('form').onsubmit = (e) => {
    e.preventDefault();
    const fields = {
        first_names: document.getElementById('first_names'),
        second_names: document.getElementById('second_name'),
        preferred_name: document.getElementById('preferred_name'),
        email: document.getElementById('email'),
        mobilephone: document.getElementById('mobilephone'),
        homephone: document.getElementById('homephone'),
        street_address: document.getElementById('street_address'),
        towncity: document.getElementById('towncity'),
        postcode: document.getElementById('postcode'),
        medical: document.getElementById('medical'),
        name_of_parent: document.getElementById('parent_name'),
        parent_emergency: document.getElementById('parent_emergency'),
        school: document.getElementById('school'),
        current_languages: document.getElementsByClassName('current-languages'),
        studying_languages: document.getElementsByClassName('studying-languages'),
        gender: document.getElementsByClassName('gender'),
        dob: document.getElementById('dob'),
        discount: document.getElementById('discount'),
        notes: document.getElementById('notes')
    }

    if(!validation.checkForm(fields)){ return };
    // Check if student is over 18. If not, prompt to complete parent information
    // const dobDateObject = dateFromString(fields.dob.value);
    // if (!overEighteen(dobDateObject)) {
    //     if(!validation.parentalCheck(fields)){ return }
    // };

    // // // Mobile phone validation
    // if(!validation.isMobile(fields.mobilephone)){ return }

    // // Home phone number validation
    // if (fields.homephone.value !== '') { if(!validation.isMobileOrHome(fields.homephone)){ return }; }

    // // Postcode validation
    // if(!validation.isPostcode(fields.postcode)){ return };
   
    // // Current languages
    // if(!validation.currentLanguages(fields.current_languages)){ return };
    
    // // Studying languages
    // if(!validation.studyingLanguages(fields.studying_languages)){ return };
   
    // Data validated.  Time to insert a new record into the database...
    const data = {
        first_names: fields.first_names.value,
        second_names: fields.second_names.value,
        preferred_name: fields.preferred_name.value,
        email: fields.email.value,
        mobilephone: fields.mobilephone.value,
        homephone: fields.homephone.value,
        street_address: fields.street_address.value,
        towncity: fields.towncity.value,
        postcode: fields.postcode.value,
        medical: fields.medical.value,
        name_of_parent: fields.name_of_parent.value,
        parent_emergency: fields.parent_emergency.value,
        school: fields.school.value,
        current_languages: getChecked(fields.current_languages),
        studying_languages: getChecked(fields.studying_languages),
        gender: getChecked(fields.gender)[0],
        dob: dateFromString(fields.dob.value),
        discount: fields.discount.value,
        notes: fields.notes.value,
        date_added: new Date(),
        date_modified: new Date()
    }
    add_record(data);
}

const add_record = (data) => {
    const Datastore = require('nedb');
    const db = new Datastore({
        filename: path.join(__dirname, '../nedb/students.db'),
        autoload: true
    });
    db.insert(data, (err, newDoc) => {
        if (err) {
            throw err
        } else {
            ipcRenderer.send('db_update', null);
            require('electron').remote.dialog.showMessageBox({
                message: `${newDoc.first_names} has been successfully added.  Student ID: ${newDoc._id}.`,
                buttons: ['Add another', 'Exit'],
                title: 'Student added successfully!'
            }, (response) => {
                if (response) {
                    require('electron').remote.getCurrentWindow().close();
                } else {
                    document.getElementById('form').reset();
                    document.getElementById('first_names').focus();
                }
            })
        }
    })
}

require(path.join(__dirname, '../libs/init/datePickerInit'));