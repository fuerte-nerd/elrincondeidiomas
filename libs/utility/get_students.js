const Datastore = require('nedb');
const path = require('path');

var students_db;

module.exports = (student_id_arr)=>{
    var promise = new Promise((res, rej)=>{
        const student_name_arr = [];
        if(!students_db){
            students_db = new Datastore({
                filename: path.join(__dirname, '../../nedb/students.db'),
                autoload : true
            })
        }
        student_id_arr.forEach((student, indx, arr) => {
            students_db.findOne({ _id : student }, (err, doc)=>{
                if(err) rej(err);
                else{ 
                    student_name_arr.push(`${doc.first_names} ${doc.second_names}`);
                    if(indx == arr.length - 1){
                        res(student_name_arr);
                    }
                }
            })    
        });
    })
    return promise;
}