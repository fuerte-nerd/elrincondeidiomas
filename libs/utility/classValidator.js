module.exports = (data)=>{
    // check the name
    if(data.name == ''){
        return {
            validated : false,
            message : 'Please enter a class name',
            field : document.getElementById('class_name')
        }
    }

    // check the attendees
    if(data.attendees.length == 0){
        return{
            validated : false,
            message : 'Please select at least one attendee',
            field : document.getElementById('attendees')
        }
    }

    // check the rate
    if(!data.amount){
        return {
            validated : false,
            message : 'Please enter a monthly rate',
            field : document.getElementById('rate')
        }
    }

    // check the scheduling
    if(data.schedule.length == 0){
        return{
            validated : false,
            message : 'Please select at least one day for scheduling',
            field : document.getElementsByClassName('day')[0]
        }
    }


    for(let i = 0; i < data.schedule.length; i++){
        const d = data.schedule[i].day;
        if(data.schedule[i].start == undefined || data.schedule[i].duration == ''){
        console.log('herrre')
            return {
                validated : false,
                message : `Please complete scheduling options for ${d}`,
                field : document.getElementById(`${d}_time`)
            }
        }
    }

    // all validation passed!
    return {
        validated : true
    }
}