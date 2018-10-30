"use strict";

/**
 * Simple helper so we can disable logs later
 * @param {String} txt 
 */
function log(txt) {
    console.log(gDT()+' '+txt);
}

/**
 * Returns a formatted time
 * @returns {String}
 */
function gDT() {
    let date = new Date();

    let hour = date.getHours();
    let hourStr = (hour < 10 ? "0" : "") + hour;

    let min = date.getMinutes();
    let minStr = (min < 10 ? "0" : "") + min;

    let sec = date.getSeconds();
    let secStr = (sec < 10 ? "0" : "") + sec;

    let yearStr = date.getFullYear().toString();

    let month = date.getMonth() + 1;
    let monthStr = (month < 10 ? "0" : "") + month;

    let day = date.getDate();
    let dayStr = (day < 10 ? "0" : "") + day;

    return dayStr + '/' + monthStr + '/' + yearStr + " " + hourStr + ":" + minStr + ":" + secStr;
}


module.exports.log=log;