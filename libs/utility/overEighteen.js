module.exports = (dob)=>{
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    if(today.getMonth() < dob.getMonth()){
        age--;
    }
    else if(today.getMonth() === dob.getMonth() && today.getDay() < dob.getDay()){
        age--;
    }
    return age > 18;
}