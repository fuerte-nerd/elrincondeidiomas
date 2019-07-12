const Datastore = require('nedb');
const path = require('path');
const ageFromDate = require(path.join(__dirname, '../utility/ageFromDate'))

module.exports = ()=>{
    const promise = new Promise((res, rej)=>{
        const students_db = new Datastore({
            filename: path.join(__dirname, '../../nedb/students.db'),
            autoload: true
        });
        students_db.find({},).sort({first_names: 1}).exec((err, docs)=>{
            if(err){ rej(err) }
            else{
                const attendeesSelect = document.getElementById('attendees');
                attendeesSelect.innerHTML = '';
                docs.forEach(doc => {
                    attendeesSelect.innerHTML += `
                    <option value="${doc._id}">${doc.first_names} ${doc.second_names}, ${ageFromDate(doc.dob)}
                    `
                });
                res(true)
            }
        })
    });
    return promise;
}