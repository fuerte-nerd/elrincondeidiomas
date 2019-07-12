const Datastore = require('nedb');
const path = require('path');
const readline = require('readline');

const teacher_db = new Datastore({
    filename: path.join(__dirname, '../nedb/teachers.db'),
    autoload: true
})

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})
rl.question('What is the name of the teacher you would like to add? ', (answer)=>{
    teacher_db.insert({
        name : answer,
        date_added : new Date()
    })
    rl.close()
})