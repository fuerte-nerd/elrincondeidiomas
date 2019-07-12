const Datastore = require('nedb');
const path = require('path');

module.exports = ()=>{
    const promise = new Promise((res, rej)=>{
        const level_db = new Datastore({
            filename: path.join(__dirname, '../../nedb/level.db'),
            autoload: true
        })
        
        level_db.find({}, (err, docs)=>{
            if(err){
                rej(err);
            }else{
                const levelSelect = document.getElementById('levels');
                levelSelect.innerHTML = '';
                docs.forEach(doc => {
                    levelSelect.innerHTML += `
                    <option value="${doc._id}">${doc.label}
                    `
                });
                res();
            }
        })
    });
    return promise;
}
