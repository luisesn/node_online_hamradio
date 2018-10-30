"use strict";

//const log=require('./log/index.js').log;
const cat=require('../cat/index.js');

const COMMANDS = {
    GET_FREQUENCY_MODE: { hex: 0x03,    expect: 5},
    SET_FREQUENCY_MODE: { hex: 0x01,    expect: 0},
    GET_RX_STATUS:      { hex: 0xE7,    expect: 0}
};

async function connect(port) {
    return cat.connect(port);
}

aysnc function setFrequency(frequency) {
	if (typeof frequency=='undefined') throw new Error('No frequency value');
	let data=[];
data[0]=parseInt(Math.trunc(frequency/10000000).toString(), 16).toString(16);
data[1]=parseInt((Math.trunc(frequency/100000)%100).toString(), 16).toString(16);
data[2]=parseInt((Math.trunc(frequency/1000)%100).toString(), 16).toString(16);
data[3]=parseInt((frequency%100).toString(), 16).toString(16);
	let r=await cat.command.(COMMANDS.SET_FREQUENCY_MODE, data);
}

async function getFrequency() {
    let r=await cat.command(COMMANDS.GET_FREQUENCY_MODE);
    if (r!=null) {
        let freq=parseInt(r.slice(0,4).toString('hex'));
        let mode;
        switch (r.readUInt8(4)) {
            case 0x00:  mode='LSB'; break;
            case 0x01:  mode='USB'; break;
            case 0x02:  mode='CW'; break;
            case 0x03:  mode='CWR'; break;
            case 0x04:  mode='AM'; break;
            case 0x06:  mode='WFM'; break;
            case 0x08:  mode='FM'; break;
            case 0x0A:  mode='DIG'; break;
            case 0x0C:  mode='PKT'; break;
        }
        return {freq:freq, mode: mode};
    } else {
        return null;
    }
}

module.exports.connect=connect;
module.exports.getFrequency=getFrequency;
