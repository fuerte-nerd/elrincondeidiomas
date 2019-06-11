const updateClock = ()=>{
    const date = new Date();
    const hours = date.getHours();
    const mins = (()=>{
        return date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
    })();
    const secs = (()=>{
        return date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds();
    })();
    
    document.querySelector('.dashboard--text__dateandtime-date').textContent = date.toLocaleDateString();
    document.querySelector('.dashboard--text__dateandtime-time').textContent = `${hours}:${mins}:${secs}`;
}
updateClock();

setInterval(updateClock, 1000)