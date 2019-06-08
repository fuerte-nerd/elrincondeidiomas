setInterval(()=>{
    const date = new Date();
    const hours = date.getHours();
    const mins = (()=>{
        return date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
    })();
    const secs = (()=>{
        return date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds();
    })();
    document.getElementById('date-and-time--date').textContent = date.toLocaleDateString();
    document.getElementById('date-and-time--clock').textContent = `${hours}:${mins}:${secs}`;
}, 1000)