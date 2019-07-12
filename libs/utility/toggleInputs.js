module.exports = (pageTitle, fields)=>{
    switch(pageTitle){
        case 'class' :
            fields.name.disabled = !fields.name.disabled;
            for(let field of fields.language){
            field.disabled = !field.disabled;
            }
            const selects = document.querySelectorAll('.select-wrapper input');
            for(let select of selects){
                select.disabled = !select.disabled;
            }
            fields.amount.disabled = !fields.amount.disabled;
            for(let field of fields.schedule){
                field.disabled = !field.disabled;
                if(field.checked){
                    const day = field.getAttribute('day');
                    document.getElementById(`${day}_time`).disabled = !document.getElementById(`${day}_time`).disabled;
                    document.getElementById(`${day}_duration`).disabled = !document.getElementById(`${day}_duration`).disabled;
                }
            }
            M.updateTextFields();
            break;
    }
    
}