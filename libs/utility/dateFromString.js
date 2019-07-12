module.exports = (date_string)=>{
    const dob_array = date_string.split('/');
    const data = {
        day: dob_array[0],
        month: dob_array[1],
        year: dob_array[2]
    }
   return new Date(data.year, data.month - 1, data.day);
}