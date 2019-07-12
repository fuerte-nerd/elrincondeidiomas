module.exports = (schedule)=>{
    let str;

    // Get first three letters of day and capitalize first letter
    str = schedule.day.charAt(0).toUpperCase() + schedule.day.slice(1, 3);

    // Get the time into a date object
    let time_array = schedule.start.match(/\d+/g);
    let start_time = new Date(1970, 1, 1, time_array[0], time_array[1])
    let finish_time = new Date(1970, 1, 1, time_array[0], time_array[1] + schedule.duration)
    
    // Ensure minutes are formatted correctly if under 10
    const zero_check = (int)=>{ return int < 10 ? `0${int}` : int; }
    str += ` ${start_time.getHours()}:${zero_check(start_time.getMinutes())} - ${finish_time.getHours()}:${zero_check(finish_time.getMinutes())}`
    
    return str
}