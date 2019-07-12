module.exports = (()=>{
    const day_boxes = document.getElementsByClassName('day');
    for(let box of day_boxes){
        box.addEventListener('change', (e)=>{
            const day = e.target.getAttribute('day');
                document.getElementById(`${day}_time`).disabled = !document.getElementById(`${day}_time`).disabled;
                document.getElementById(`${day}_duration`).disabled = !document.getElementById(`${day}_duration`).disabled;
                if(!e.target.checked){
                    document.getElementById(`${day}_time`).value = '';
                    document.getElementById(`${day}_duration`).value = '';
                }
        })
    }
})()