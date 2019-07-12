var ipcRenderer = require('electron').ipcRenderer;
const path = require('path');
const validation = require(path.join(__dirname, '../libs/utility/formValidation'));
const getChecked = require(path.join(__dirname, '../libs/utility/getChecked'));
const dateFromString = require(path.join(__dirname, '../libs/utility/dateFromString'));

const init = (()=>{
    let locked = true;
    ipcRenderer.on('sending student data', (e, args)=>{
        fields = {
            first_names : document.getElementById('first_names'),
            second_names : document.getElementById('second_names'),
            preferred_name: document.getElementById('preferred_name'),
            email : document.getElementById('email'),
            mobilephone : document.getElementById('mobilephone'),
            homephone : document.getElementById('homephone'),
            street_address : document.getElementById('street_address'),
            towncity : document.getElementById('towncity'),
            postcode : document.getElementById('postcode'),
            medical : document.getElementById('medical'),
            name_of_parent : document.getElementById('parent_name'),
            parent_emergency : document.getElementById('parent_emergency'),
            school : document.getElementById('school'),
            current_languages : document.getElementsByClassName('current-languages'),
            studying_languages : document.getElementsByClassName('studying-languages'),
            gender : document.getElementsByClassName('gender'),
            dob : document.getElementById('dob'),
            discount : document.getElementById('discount'),
            notes : document.getElementById('notes')
        }
        console.log(fields)

       
        // populate fields
        fields.first_names.value = args.first_names;
        fields.second_names.value = args.second_names;
        fields.preferred_name.value = args.preferred_name;
        fields.email.value = args.email;
        fields.mobilephone.value = args.mobilephone;
        fields.homephone.value = args.homephone;
        fields.street_address.value = args.street_address;
        fields.towncity.value = args.towncity;
        fields.postcode.value = args.postcode;
        fields.medical.value = args.medical;
        fields.name_of_parent.value = args.name_of_parent;
        fields.parent_emergency.value = args.parent_emergency;
        fields.school.value = args.school;
        
        const populateCheckboxes = (data, collection)=>{
            for(let box of collection){
                if(data.includes(box.getAttribute('option'))){
                    box.checked = true;
                }
            }
        }
        populateCheckboxes(args.current_languages, fields.current_languages);
        populateCheckboxes(args.studying_languages, fields.studying_languages);
        
        // populate gender
        if(args.gender){
            document.getElementById(args.gender).checked = true;
        }

            // populate DOB
        const dobDate = new Date(args.dob);
        fields.dob.value = `${dobDate.getDate()}/${dobDate.getMonth() + 1}/${dobDate.getFullYear()}`
        // populate discount
        fields.discount.value = args.discount;
        // populate notes
        fields.notes.value = args.notes

        M.updateTextFields();

        // Apply listener to Edit Profile
        const editProfileBtn = document.getElementById('edit-profile');
        editProfileBtn.addEventListener('click', (e)=>{
            const values = Object.values(fields);
            if(locked){
                locked = false;
                document.getElementById('btn-text').textContent = 'Update Profile';
                values.forEach(value => {
                    if(value instanceof HTMLCollection){
                        for(let i of value){
                            i.disabled = false
                        }
                    }else{
                        value.disabled = false;
                    }
                });
            }else{
                // validation
                if(!validation.checkForm(fields)){ return }
                locked = true;
                document.getElementById('btn-text').textContent = 'Edit Profile';
                
                const Datastore = require('nedb');
                const db = new Datastore({
                    filename: path.join(__dirname, '../nedb/students.db'),
                    autoload: true
                });
                // args.date_modified = new Date();
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
                    date_modified: new Date()
                }
                db.update({ _id : args._id }, data, {}, (err, numOfUpdate)=>{
                    if(err){ console.log(err) }
                    else{
                        console.log('successful!')
                        ipcRenderer.send('db_update', null);
                        values.forEach(value => {
                            if(value instanceof HTMLCollection){
                                for(let i of value){
                                    i.disabled = true
                                }
                            }else{
                                value.disabled = true;
                            }
                        });
                    }
                })

            }
        })
    })
    require(path.join(__dirname, '../libs/init/datePickerInit'));
})();
        
        

                            


