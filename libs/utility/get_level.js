const Datastore = require('nedb');
const path = require('path');

var level_db;

module.exports = (level_id)=>{
    var promise = new Promise((res, rej)=>{
        if(!level_db){
            level_db = new Datastore({
                filename: path.join(__dirname, '../../nedb/level.db'),
                autoload : true
            })
        }
        level_db.findOne({ _id : level_id }, (err, doc)=>{
            if(err) rej(err);
            else{ 
                res(doc.label)
            }
        })
    })
    return promise;
}