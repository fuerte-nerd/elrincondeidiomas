module.exports = (checkboxes)=>{
    let no_selection_made = true;
    for(let field of checkboxes){
        if(field.checked){
            no_selection_made = false;
            break;
        }
    }
    return no_selection_made;
}