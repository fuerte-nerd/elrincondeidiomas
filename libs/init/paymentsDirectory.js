const { BrowserWindow } = require('electron').remote
const { remote } = require('electron');
const path = require('path');

document.getElementById('add_payment').addEventListener('click', ()=>{
    // create a new browserwindow
    const win = new BrowserWindow({
        parent : remote.getCurrentWindow(),
        modal: true,
        height : 640,
        width: 480,
        title : 'Add new payment',
        webPreferences: {
            nodeIntegration: true
        }
    })

    win.loadFile(path.join(__dirname, '../html/add_payment.html'));
    win.on('closed', ()=>{
        win = null;
    })
})

const Datastore = require('nedb');
console.log(__dirname)

// Open the payments and students database
const paymentsDB = new Datastore({
    filename : path.join(__dirname, '../nedb/payments.db'),
    autoload : true
})

const studentsDB = new Datastore({
    filename : path.join(__dirname, '../nedb/students.db'),
    autoload : true
})

// Retrieve all records from payments database
paymentsDB.find({}, (err, records)=>{
    console.log(records)
    records.forEach(paymentRecord => {
        // Retrieve the student details from the students database
        studentsDB.findOne({ _id: paymentRecord.student }, (err, studentRecord)=>{
            // Store the student name in a variable
            const name = `${studentRecord.first_names} ${studentRecord.second_names}`;
            // Determine whether it is paid
            let paid = `
                <div class="switch">
                    <label>
                        No
                        <input type="checkbox" class="check" checked />
                        <span class="lever"></span>
                        Yes
                    </label>
                </div>
            `
            let daysToPay = '-'
            if(!paymentRecord.payment.pay_date){
                paid = `
                    <div class="switch">
                        <label>
                            No
                            <input type="checkbox" class="check" />
                            <span class="lever"></span>
                            Yes
                        </label>
                    </div>
                `
                // If it's not been paid, calculate days outstanding
                    // Get the invoice month
                    const issueDate = new Date(paymentRecord.date_issued)
                    const dueDate = (()=>{
                        if(issueDate.getMonth() == 11){
                            return new Date(issueDate.getFullYear() + 1, 0, 5);
                        }else{
                            return new Date(issueDate.getFullYear(), issueDate.getMonth() + 1, 5)
                        }
                    })()
                    const today = new Date();
                    const dueDateUTC = Date.UTC(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());
                    const nowUTC = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
                    const sum = dueDateUTC - nowUTC
                    const _MS_PER_DAY = 1000 * 60 * 60 * 24;
                    daysToPay = sum / _MS_PER_DAY;
                }

            // Populate the HTML for the record
            document.getElementById('table-body').innerHTML += `
            <td>${paymentRecord._id}</td>
            <td>${name}</td>
            <td>${paymentRecord.date_issued.getDate()}/${paymentRecord.date_issued.getMonth() + 1}/${paymentRecord.date_issued.getFullYear()}</td>
            <td>${paymentRecord.period.getMonth() + 1}/${paymentRecord.period.getFullYear()}</td>
            <td>${paid}</td>
            <td>${daysToPay}</td>
            `
            
            const paidSwitches = document.getElementsByClassName('check');
            for(let paidSwitch of paidSwitches){
                paidSwitch.addEventListener('click', (e)=>{
                    if(!e.target.checked){
                        // launch dialog box
                    };
                })
            }

        })



    });


        
})