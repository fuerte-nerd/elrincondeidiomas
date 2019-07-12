const Datastore = require('nedb');
const path = require('path');

let selection = [];
const student_db = new Datastore({
    filename: path.join(__dirname, '../nedb/students.db'),
    autoload: true
})
const class_db = new Datastore({
    filename: path.join(__dirname, '../nedb/class.db'),
    autoload: true
})
const today = new Date();
const thisMonth = today.getMonth();
document.getElementById('month').selectedIndex = thisMonth;
const thisYear = today.getFullYear()
const arr = [];
for (let i = 0; i < 5; i++) {
    arr.push(thisYear - i);
}
arr.forEach(year => {
    document.getElementById('year').innerHTML += `<option value="${year}">${year}</option>`
});
// TODO: Change the query to 'active : true'
student_db.find({}).sort({ second_names: 1 }).exec((err, studentDocs) => {
    if (err) { console.log(err) }
    else {
        const listArea = document.getElementById('list-area');
        studentDocs.forEach((studentDoc, ind) => {
            var amount = 0;
            class_db.find({ attendees: studentDoc._id }, (err, classDocs) => {
                if (err) { throw err }
                else {
                    if (classDocs.length > 0) {
                        classDocs.forEach(classDoc => {
                            amount += parseInt(classDoc.amount)
                        });
                        if (studentDoc.discount) {
                            amount = amount - parseInt(studentDoc.discount)
                        }
                    }
                    listArea.innerHTML += `
                    <td>${studentDoc.first_names} ${studentDoc.second_names}</td>
                    <td>${amount.toFixed(2)}€</td>
                    <td class="input-field">
                        <input type="number" student="${studentDoc._id}" class="reductionaddition" id="red_${studentDoc._id}" />
                    </td>
                    <td class="input-field">
                        <input type="text"  student="${studentDoc._id}" class="comments" id="com_${studentDoc._id}" />
                    </td>
                    <td>
                        <label>
                            <input type="checkbox" class="selector"  student="${studentDoc._id}"/>
                            <span>
                                Select?
                            </span>
                        </label>
                    </td>            
                    `
                    if (ind == studentDocs.length - 1) {
                        const checkboxes = document.getElementsByClassName('selector');
                        // Add listeners to the 'Select' checkboxes
                        for (var i = 0; i < checkboxes.length; i++) {
                            checkboxes[i].addEventListener('change', (e) => {
                                var student_id = e.target.getAttribute('student');
                                if (e.target.checked) {
                                    selection.push(student_id);
                                } else {
                                    selection.splice(selection.indexOf(student_id), 1)
                                }
                            })
                        };
                        const commentInputs = document.getElementsByClassName('comments');
                        for (let input of commentInputs) {
                            input.disabled = true;
                        }
                        const reductionInputs = document.getElementsByClassName('reductionaddition');
                        for (let input of reductionInputs) {
                            input.addEventListener('keyup', (e) => {
                                if (e.target.value != '') {
                                    const studentId = e.target.getAttribute('student');
                                    document.getElementById(`com_${studentId}`).disabled = false;
                                }
                            })
                        }
                    }
                }
            })
        })
    }
    require(path.join(__dirname, '../libs/init/selectInit'))
})
const sendBtn = document.getElementById('prepare-and-send');
const errorTxt = document.getElementById('error');
const checkAll = document.getElementById('check-all');
checkAll.addEventListener('change', (e)=>{
    const selectors = document.getElementsByClassName('selector');
    selection = [];

    for(let selector of selectors){
        if(e.target.checked){
            selector.checked = true;
            selection.push(selector.getAttribute('student'))
        }else{
            selector.checked = false;
        }
      }
})
sendBtn.addEventListener('click', () => {
    if (!selection.length > 0) {
        errorTxt.innerHTML = "Please select at least one student."
        setTimeout(() => {
            errorTxt.innerHTML = "";
        }, 2000)
    } else {
        const selectedMonth = document.getElementById('month').value
        const selectedYear = document.getElementById('year').value
        const date = new Date(selectedYear, selectedMonth, 1);
        if (today < date) {
            errorTxt.innerHTML = "Please select a valid invoice period."
            setTimeout(() => {
                errorTxt.innerHTML = "";
                document.getElementById('month').focus();
            }, 2000)
        }
        else {
            const invoiceArr = [];
            for (let studentId of selection) {
                let studentToInvoice = {
                    id: studentId,
                    reduction: null,
                    reason: null
                }
                let reductionField = document.getElementById(`red_${studentId}`);
                let reasonField = document.getElementById(`com_${studentId}`);
                console.log(selection)
                if (reductionField.value != '') {
                    if (reasonField.value == '') {
                        errorTxt.innerHTML = "Please provide a reason for all reductions/additions";
                        setTimeout(() => {
                            errorTxt.innerHTML = "";
                            reasonField.focus();
                        }, 2000);
                        break;
                    }
                    else {
                        studentToInvoice.reduction = reductionField.value;
                        studentToInvoice.reason = document.getElementById(`com_${studentId}`).value;
                    }
                }
                invoiceArr.push(studentToInvoice);
            }
            
            const invoiceCreator = require(path.join(__dirname, '../libs/utility/invoiceCreator'));
            const invoiceDate = {
                month: selectedMonth,
                year: selectedYear
            }
            invoiceCreator(invoiceArr, invoiceDate);
        }
    }
})