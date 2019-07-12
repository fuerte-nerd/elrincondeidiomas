const Datastore = require('nedb');
const path = require('path');
const dateFromString = require(path.join(__dirname, '../utility/dateFromString'));
const getAgeFromDate = require(path.join(__dirname, '../utility/ageFromDate'));
var students_db;

console.log(__dirname)

module.exports = (students)=>{
    const promise = new Promise((res, rej)=>{
        const student_arr = [];
        if(!students_db){
            students_db = new Datastore({
                filename : path.join(__dirname, '../../nedb/students.db'),
                autoload : true
            })
        }
        students.forEach((student, indx, arr) => {
            students_db.findOne({ _id : student }, (err, doc)=>{
                if(err) rej(err);
                else{
                    student_arr.push(getAgeFromDate(doc.dob));
                    if(indx == arr.length-1){
                        var sum_array = student_arr.reduce((t, c)=>{
                            return t + c;
                        })
                        res((sum_array / student_arr.length).toFixed(0));
                    }
                }
            })
        });
    })
    return promise;
}
