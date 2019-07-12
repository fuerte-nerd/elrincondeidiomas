const path = require('path');
const Datastore = require('nedb')

module.exports = ()=>{
    const promise = new Promise((res, rej)=>{
        const teacher_db = new Datastore({
            filename : path.join(__dirname, '../../nedb/teachers.db'),
            autoload: true
        })
        
        teacher_db.find({}, (err, docs)=>{
            if(err){ rej(err) }
            else{
                const teacherSelect = document.getElementById('teachers');
                teacherSelect.innerHTML = '';
                docs.forEach(doc => {
                    teacherSelect.innerHTML += `
                    <option value="${doc._id}">${doc.name}
                    `
                });
                res(true)
            }
        })
    });
    return promise;
}