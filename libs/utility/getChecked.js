 module.exports = (collection)=>{
    const arr = [];
    for(let box of collection){
        if(box.checked){
            arr.push(box.getAttribute('option'))
        }
    }
    return arr;
}