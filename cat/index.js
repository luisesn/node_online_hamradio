"use strict";

const log=require('../log/index.js').log;
const SerialPort = require("serialport");

let serialPort=null;
let connected=false;
let baud=38400;



/**
 * Inicializa el puerto serie
 * @param {String} port 
 */
async function connect(port) {
    return new Promise((resolve, reject) => {
        log("Opening serial port...");
        serialPort = new SerialPort(port, {
            baudRate: baud,
            autoOpen: false,
            stopBits: 2,
            parity: 'none',
            dataBits: 8,
        });
        serialPort.open(function (err) {
            if (err) {
                log('Serial port opening error: '+ err.toString());
                reject(err);
            } else {
                log("Serial port opened OK");
                connected=true;
                serialPort.on('error', function (error) {
                    //if (error.toString() == 'Error: Port is opening') return;
                    log('Serial port error:'+error.toString());
                    console.error(error);
                    //socketServer.broadcast('{"0":"Serial port failed to open: ' + error + '"}');
                    //clearTimeout(st);
                    //st = setTimeout(serialPortOpen, 15000);
                });

                serialPort.on('data', serialData);
                /*this.write("s11x", function(e) {
                    if (e) {
                        log(gDT() + ' Serial port error: ', e, e.stack.split("\n"));
                    }
                });*/
                resolve(true);
            }
        });
    });
}

function wait (timeout) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, timeout);
    });
}

let waitingAnswer=false;
/**
 * 
 * @param {COMMANDS} cmd 
 * @param {*} parameter 
 * @param {*} timeout 
 * @returns {Buffer}
 */
async function command(cmd, parameter, timeout) {
    log('Sending command');
    if (!connected) throw new Error('Not connected');
    if (waitingAnswer) throw new Error('Waiting answer');
    waitingAnswer=true;
    resetBuffer();
    let b=new Buffer.from([0,0,0,0,cmd.hex]);
    serialPort.write(b);
    log('Serial TX: 0x' + b.toString('hex'));
    if (cmd.expect>0) {
        timeout = timeout || 250;
        let t=0;
        while (t<(timeout/10)) {
            if (serialBuffer.length==cmd.expect) {
		waitingAnswer=false;
                return Buffer.from(serialBuffer);
            }
            log("W"+t+","+serialBuffer.length);
            t++;
            await wait(25);
        }
    }
    waitingAnswer=false;
    return null;
}

function resetBuffer() {
    serialBuffer=Buffer.alloc(0);
}

let serialBuffer=Buffer.alloc(0);
function serialData(data) {
    serialBuffer=Buffer.concat([serialBuffer, data]);
    log('Serial RX: 0x' + serialBuffer.toString('hex'));
}

module.exports.connect=connect;
module.exports.command=command;
