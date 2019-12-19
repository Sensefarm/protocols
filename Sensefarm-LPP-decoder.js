/* 
Sensefarm CUBE02 device decoder example.
Licensed, as open source under the Apache license.

Copyright 2019 Sensefarm AB

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

//Node.js
//The program can be run standalone if node.js is installed on the computer. 

//Chripstack
//The https://www.chirpstack.io/ LoRaWAN server can execute decoding scripts to decode and show content as a string.
//This code can be dropped into their LoraWAN server box labeled "Payload codec - Custom Javascript codec function" under "Application-Application fonfiguration"

/* Example of running the program:
Try with data "b006b800013008e898009c18f599009c18f50841a2501a" ( hex )
or "sAe4AAEwDgI=" (base64)
---
$ node Sensefarm-LPP-decoder.js b006b800013008e898009c18f599009c18f50841a2501a
Read from command line: b006b800013008e898009c18f599009c18f50841a2501a
Decoder started with b006b800013008e898009c18f599009c18f50841a2501a
Sensor header byte 0xb0 decoded into type: 0x16 number 0
Sensor parameter byte 0x06
### Reason_for_transmission: Normal
Sensor header byte 0xb8 decoded into type: 0x17 number 0
Sensor parameter byte 0x00
Sensor parameter byte 0x01
### Protocol Version 1
Sensor header byte 0x30 decoded into type: 0x6 number 0
Sensor parameter byte 0x08
Sensor parameter byte 0xe8
### Voltage-0 2.28 V
Sensor header byte 0x98 decoded into type: 0x13 number 0
Sensor parameter byte 0x00
Sensor parameter byte 0x9c
Sensor parameter byte 0x18
Sensor parameter byte 0xf5
### Resistance-0 10230005 Ohm
Sensor header byte 0x99 decoded into type: 0x13 number 1
Sensor parameter byte 0x00
Sensor parameter byte 0x9c
Sensor parameter byte 0x18
Sensor parameter byte 0xf5
### Resistance-1 10230005 Ohm
Sensor header byte 0x08 decoded into type: 0x1 number 0
Sensor parameter byte 0x41
Sensor parameter byte 0xa2
Sensor parameter byte 0x50
Sensor parameter byte 0x1a
### Temperature-0 20.289112091064453 Degree Celcius
Program exit
*/

function Bytes2Float32(bytes) {
    var sign = (bytes & 0x80000000) ? -1 : 1;
    var exponent = ((bytes >> 23) & 0xFF) - 127;
    var significand = (bytes & ~(-1 << 23));

    if (exponent == 128) 
        return sign * ((significand) ? Number.NaN : Number.POSITIVE_INFINITY);

    if (exponent == -127) {
        if (significand == 0) return sign * 0.0;
        exponent = -126;
        significand /= (1 << 22);
    } else significand = (significand | (1 << 23)) / (1 << 23);

    return sign * significand * Math.pow(2, exponent);
}

function toHexString(byteArray) {
  var s = '0x';
  byteArray.forEach(function(byte) {
    s += ('0' + (byte & 0xFF).toString(16)).slice(-2);
  });
  return s;
}

function DecodePayload(byteArray) {

  function byteToValue(number_of_bytes) {
    value = 0;
    for (j = 0; j < number_of_bytes; j++) {
      value=value*256;
      i++;
      console.log( 'Sensor parameter byte 0x' + ('0' + (byteArray[i] & 0xFF).toString(16)).slice(-2));
      value += ( byteArray[i] & 0xFF );
    }
    return value;
  }

  hexString = toHexString(byteArray);
  console.log("Decoder started with " + hexString);
  str_bytes = "";
  str = "";
  readable_str = hexString + " decoded as";
  decode_state = 'decode_header_byte';  //Each sensors data, in a multisensor message, start with a header describing the sensor type and a sensor number from 0-7. See https://github.com/Sensefarm/protocols/blob/master/Sensefarm-LPP.md
  //If the application crypto keys are typed wrong, which has happened, we might end up with garbage to decode, so we need to check for the protocol version
  known_protocol = false; //Check that we are decoding a protocol we actually know how to handle
  for(var i = 0; i < byteArray.length; i++) { //The multisensor message are read byte by byte and parsed for information on each individual sensor and it's values.
    readable_str += ' ';
    switch( decode_state) {
    case 'decode_header_byte':
      console.log('Sensor header byte 0x' + ('0' + (byteArray[i] & 0xFF).toString(16)).slice(-2) + ' decoded into type: 0x' + ((byteArray[i] & 0xFF) >>> 3).toString(16) + ' number ' + ( byteArray[i] & 0x7 ));
    	switch( ( byteArray[i] & 0xFF) >>> 3 ) {
          case 0x01:
            str = "### Temperature-" + (byteArray[i] & 0x07).toString(10) + " ";
            var bytes = byteToValue(4);
            str += Bytes2Float32(bytes);
            str += " Degree Celcius ";
            console.log ( str );
            readable_str += str;
            break;
          case 0x06: 
            str = "### Voltage-" + (byteArray[i] & 0x07).toString(10) + " ";
            var bytes = byteToValue(2);
            str += (bytes/1000).toString(10);
            str += " V ";
            console.log ( str );
            readable_str += str;
            break;
          case 0x13: 
            str = "### Resistance-" + (byteArray[i] & 0x07).toString(10) + " ";
            var bytes = byteToValue(4);
            str += bytes.toString(10);
            str += " Ohm ";
            console.log ( str );
            readable_str += str;
            break;
          case 0x15: 
            str = "### Soil_moisture-" + (byteArray[i] & 0x07).toString(10) + " ";
            var bytes = byteToValue(2);
            str += bytes.toString(10);
            str += " kPa ";
            console.log ( str );
            readable_str += str;
            break;
          case 0x16: 
            str = "### Reason_for_transmission: ";
            var bytes = byteToValue(1);
            switch(bytes) {
              case 0 :
            	  str += "0x00_unknown_reset";
                break;
              case 1:
                str += "POR/PDR_reset_flag";
                break;
			        case 2:
                str += "Independent_Watchdog_reset_flag";
                break;
              case 3:
                str += "Window_watchdog_reset_flag";
                break;
              case 4:
                str += "Low-Power_reset_flag";
                break;
              case 5:
                str += "POR/PDR_reset_flag";
                break;
              case 6:
                str += "Normal";
                break;
              case 7:
                str += "Wired (button) reset";
                break;
              default:
                str += "0x" + bytes.toString(16);
            }
            str += " ";
            console.log ( str );
            readable_str += str;
            break;
          case 0x17: 
            str = "### Protocol Version "; //+ (byteArray[i] & 0x07).toString(10) + " ";
            var bytes = byteToValue(2);
            str += bytes.toString(10);
            str += " ";
            if ( bytes == 1 ) {
            } else {
              str += 'Unknown protocol version! Aborting.';
              decode_state = 'error';
            }
            console.log ( str );
            readable_str += str;
            known_protocol = true;
            break;
          default:
              str = '### Sensor header byte not recognised. Aborting.';
              console.log(str);
              readable_str += str;
              decode_state = 'error'; //We expected a header byte, but it was not found
              break;
        }
    	break;
    case 'error':
    default:
        decode_state = 'error';
        break;
    }
  }
  if ( known_protocol != true ) 
    readable_str += '#### Unknown protocol. Decoding failed.';
  if (decode_state == 'error') {
    readable_str = 'ERROR: ' + readable_str;
  }
  console.log('');
  console.log(readable_str);
  return readable_str;
}

// Decode decodes an array of bytes into an object.
//  - fPort contains the LoRaWAN fPort number
//  - bytes is an array of bytes, e.g. [225, 230, 255, 0]
// The function must return an object, e.g. {"temperature": 22.5}
function Decode(fPort, bytes) {
  	return { data: DecodePayload(bytes) };
}

/* This code is not working if used in a browser, only when run as node program */
try {
  if (require.main === module) { //Check if program is running from command line
    if (process.argv.length <= 2) { //did we get a payload to work with?
      console.log("Usage: " + __filename + " B0123456789ABCDEF");
      process.exit(-1);
    }
    var param = process.argv[2]; //Skip program name and get data parameter
    console.log("Read from command line: " + param);
    regexp = /^([0-9a-fA-F]{2})+$/; //Is it a correct hexadecimal message?
    if (regexp.test(param)) {
      console.log('Parsed as a hex string')
      var data= Buffer.from( param, 'hex' ); //convert parameter from hex string
    } else {
      console.log('Parsed as a base64 string')
      var data = Buffer.from(param,'base64'); //convert parameter from base64 string   
    }
    Decode(2,data); //2 is default channel
    console.log('Program exit');
  }
} catch(err) { // most likely caused by running in the browser and not as a stand alone node-program. 
  console.log('Node program generated an error' + err );  
}
