const Datastore = require('nedb');
const path = require('path');

var teacher_db;

module.exports = (teacher_id)=>{
    console.log(teacher_id)
    var promise = new Promise((res, rej)=>{
        if(!teacher_db){
            teacher_db = new Datastore({
                filename: path.join(__dirname, '../../nedb/teachers.db'),
                autoload : true
            })
        }
        
        teacher_db.findOne({ _id : teacher_id }, (err, doc)=>{
            if(err) rej(err);
            else{ 
                res(doc.name)
            }
        })
    })
    return promise;
}