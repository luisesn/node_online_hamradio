"use strict";

const ft817nd=require('./ft817nd/index.js');
//module.exports.COMMANDS=COMMANDS;

async function start() {
    try {
        if (await ft817nd.connect("/dev/ttyUSB0")) {
            console.log(await ft817nd.getFrequency());
        } else {
		console.log('No se pudo abrir');
	}
    } catch (e) {
        console.error(e);
    }
}

start();
