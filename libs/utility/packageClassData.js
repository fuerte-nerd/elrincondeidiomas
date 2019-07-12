const capitalize = require(path.join(__dirname, '../utility/capitalize'));
const getChecked = require(path.join(__dirname, '../utility/getChecked'));

module.exports = ()=>{
    return {
        name: capitalize(document.getElementById('class_name').value),
        language: getChecked(document.getElementsByClassName('language')),
        attendees: (()=>{
            var instance = M.FormSelect.getInstance(document.getElementById('attendees'));
            return instance.getSelectedValues();
        })(),
        teacher: document.getElementById('teachers').value,
        level: document.getElementById('levels').value,
        amount: document.getElementById('rate').value,
        schedule: (()=>{
            const arr = [];
            const boxes = document.getElementsByClassName('day');
            for(let box of boxes){
                if(box.checked){
                    const day = box.getAttribute('day');
                    arr.push({
                        day : day,
                        start : (()=>{
                            const timepicker = M.Timepicker.getInstance(document.getElementById(`${day}_time`))
                            if(timepicker.time == undefined){
                                console.log('here');
                                return document.querySelector(`#${day}_time`).value;
                            }
                            return timepicker.time
                        })(),
                        duration : document.getElementById(`${day}_duration`).value
                    })
                }
            }
            return arr;
        })(),
        date_created: new Date(),
        date_modified: new Date()
    }
};