const Datastore = require('nedb');
const path = require('path');
const readline = require('readline');

const level_db = new Datastore({
    filename: path.join(__dirname, '../nedb/level.db'),
    autoload: true
})

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

rl.question('Level identifier (e.g. A1, B2): ', (answer)=>{
    let identifier = answer;
    rl.question('Description: ', (answer)=>{
        level_db.insert({
            label : identifier,
            description : answer,
            date_added : new Date()
        })
        rl.close();
    })
})