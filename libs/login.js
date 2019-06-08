const bcrypt = require('bcryptjs');
// const { BrowserWindow } = require('electron').remote;
const saltRounds = 10;

document.getElementById('login-submit').addEventListener('click', (e)=>{
    e.preventDefault();
    const user = document.getElementById('username');
    const pw = document.getElementById('password');

    //replace these when database created
    var tempUser = 'test'
    var tempPassword = 'test123';
    var tempHashedPassword;
    bcrypt.genSalt(10, (err, salt)=>{
        bcrypt.hash(tempPassword, salt, (err, hash)=>{
            tempHashedPassword = hash;
            var enteredPW = pw.value;
    //////////////////////////////


    

    bcrypt.compare(enteredPW, tempHashedPassword, (err, res)=>{
        if(res){
            var test = require('electron').remote.getCurrentWindow();
            test.loadFile('./html/dashboard.html')
        }else{
            document.getElementById('login-error').textContent = "Sorry.  Those details do not match our records. Please try again."
            setTimeout(()=>{
                document.getElementById('login-error').textContent = ''
        }, 5000)
    }
    })
        })
    })

    
})