/**
	 _   _ ___________ _____ _____ _____ _____ _____  _   _ 
	| \ | |_   _|  ___|_   _|_   _|_   _|  ___/  __ \| | | |
	|  \| | | | | |_    | |   | |   | | | |__ | /  \/| |_| |
	| . ` | | | |  _|   | |   | |   | | |  __|| |    |  _  |
	| |\  |_| |_| |     | |  _| |_  | | | |___| \__/\| | | |
	\_| \_/\___/\_|     \_/  \___/  \_/ \____/ \____/\_| |_/
															
	Converted by Daniel and Simon in November 2022. 
	To used at The Things Network for decoding Sensefarm 
	data sent from their devices.
	
	Based on payload decoder found here:
	https://github.com/Sensefarm/protocols
	
	Copyright 2022 Niftitech

  Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
	
 */

function Bytes2Float32(bytes) {
  var sign = bytes & 0x80000000 ? -1 : 1;
  var exponent = ((bytes >> 23) & 0xff) - 127;
  var significand = bytes & ~(-1 << 23);

  if (exponent == 128)
    return sign * (significand ? Number.NaN : Number.POSITIVE_INFINITY);

  if (exponent == -127) {
    if (significand == 0) return sign * 0.0;
    exponent = -126;
    significand /= 1 << 22;
  } else significand = (significand | (1 << 23)) / (1 << 23);

  return sign * significand * Math.pow(2, exponent);
}

function DecodeSenseFarmPayload(byteArray) {
  function byteToValue(number_of_bytes) {
    value = 0;
    for (j = 0; j < number_of_bytes; j++) {
      value = value * 256;
      i++;
      value += byteArray[i] & 0xff;
    }
    return value;
  }

  var obj = new Object();
  decode_state = "decode_header_byte"; //Each sensors data, in a multisensor message, start with a header describing the sensor type and a sensor number from 0-7. See https://github.com/Sensefarm/protocols/blob/master/Sensefarm-LPP.md
  //If the application crypto keys are typed wrong, which has happened, we might end up with garbage to decode, so we need to check for the protocol version
  known_protocol = false; //Check that we are decoding a protocol we actually know how to handle
  for (var i = 0; i < byteArray.length; i++) {
    //The multisensor message are read byte by byte and parsed for information on each individual sensor and it's values.
    switch (decode_state) {
      case "decode_header_byte":
        switch ((byteArray[i] & 0xff) >>> 3) {
          case 0x01:
            var bytes = byteToValue(4);
            obj.temperature = Math.round(Bytes2Float32(bytes) * 100) / 100;
            break;
          case 0x06:
            var bytes = byteToValue(2);
            obj.voltage = (bytes / 1000).toString(10);
            break;
          case 0x13:
            var bytes = byteToValue(4);
            obj.resistance = bytes.toString(10);
            break;
          case 0x15:
            var bytes = byteToValue(2);
            obj.soil_moisture = bytes.toString(10);
            break;
          case 0x16:
            var reason = "";
            var bytes = byteToValue(1);
            switch (bytes) {
              case 0:
                reason = "0x00_unknown_reset";
                break;
              case 1:
                reason = "POR/PDR_reset_flag";
                break;
              case 2:
                reason = "Independent_Watchdog_reset_flag";
                break;
              case 3:
                reason = "Window_watchdog_reset_flag";
                break;
              case 4:
                reason = "Low-Power_reset_flag";
                break;
              case 5:
                reason = "POR/PDR_reset_flag";
                break;
              case 6:
                reason = "Normal";
                break;
              case 7:
                reason = "Wired (button) reset";
                break;
              default:
                reason = "0x" + bytes.toString(16);
            }
            obj.reason_for_transmission = reason;
            break;
          case 0x17:
            var protocol_version = ""; //+ (byteArray[i] & 0x07).toString(10) + " ";
            var bytes = byteToValue(2);
            protocol_version += bytes.toString(10);
            if (bytes == 1) {
            } else {
              protocol_version += "Unknown protocol version! Aborting.";
              decode_state = "error";
            }
            known_protocol = true;

            obj.protocol_version = protocol_version;
            break;
          default: //We expected a header byte, but it was not found
            obj = { error: "Sensor header byte not recognised." };
            break;
        }
        break;
      case "error":
      default:
        decode_state = "error";
        break;
    }
  }

  return obj;
}

function decodeUplink(input) {
  return {
    data: DecodeSenseFarmPayload(input.bytes),
  };
}