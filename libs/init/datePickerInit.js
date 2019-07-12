module.exports = (()=>{
        var elems = document.querySelectorAll('.datepicker');
        var date = new Date();
        var options = {
            format: 'dd/mm/yyyy',
            yearRange: [date.getFullYear() - 110, date.getFullYear()]
        }
        var instances = M.Datepicker.init(elems, options);
})();