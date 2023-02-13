var today = new Date();
var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

function getTheDate(){
    var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    return days[today.getDay()]+", "+months[today.getMonth()]+" "+today.getDate();
    
}
module.exports.getDate = getTheDate;

function getTheDay(){
    return days[today.getDay()];
}
module.exports.getDay=getTheDay;

