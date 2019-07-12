module.exports = (date) => {
    let currentDate = new Date();
    let dob = date;
    let age = currentDate.getFullYear() - dob.getFullYear();
    let m = currentDate.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && currentDate.getDate() < dob.getDate())) {
        age--;
    }
    return age
}