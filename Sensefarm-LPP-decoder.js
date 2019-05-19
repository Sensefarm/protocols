//The Open Source LoRaWAN server can execute scripts to decode and show content as a string.
//This code can be used as a drop in replacement

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
  console.log("Running and logging to console");
  str = "";
  readable_str = "Decoded as: ";
  decode_state = 'start';
  for(var i = 0; i < byteArray.length; i++) {
    str += ' 0x'+ ('0' + (byteArray[i] & 0xFF).toString(16)).slice(-2);
    switch(decode_state) {
    case 'start':
    	switch( ( byteArray[i] & 0xFF) >>> 3 ) {
          case 0x01:
            readable_str += "###Temperature-" + (byteArray[i] & 0x07).toString(10) + " ";
            var bytes = (byteArray[i+1] & 0xFF)*256*256*256 + (byteArray[i+2] & 0xFF)*256*256 + (byteArray[i+3] & 0xFF)*256 + (byteArray[i+4] & 0xFF);
            readable_str += Bytes2Float32(bytes);
            readable_str += " Degree Celcius ";
            decode_state = '4';
            break;
          case 0x06: 
            readable_str += "###Voltage-" + (byteArray[i] & 0x07).toString(10) + " ";
            readable_str += (((byteArray[i+1] & 0xFF)*256 + (byteArray[i+2] & 0xFF))/1000).toString(10);
            readable_str += " V ";
            decode_state = '2';
            break;
          case 0x13: 
            readable_str += "###Resistance-" + (byteArray[i] & 0x07).toString(10) + " ";
            readable_str += ((byteArray[i+1] & 0xFF)*256*256*256 + (byteArray[i+2] & 0xFF)*256*256 + (byteArray[i+3] & 0xFF)*256 + (byteArray[i+4] & 0xFF)).toString(10);
            readable_str += " Ohm ";
            decode_state = '4';
            break;
          case 0x15: 
            readable_str += "###Soil_moisture-" + (byteArray[i] & 0x07).toString(10) + " ";
            readable_str += ((byteArray[i+1] & 0xFF)*256 + (byteArray[i+2] & 0xFF)).toString(10);
            readable_str += " kPa ";
            decode_state = '2';
            break;
          case 0x16: 
            readable_str += "###Reason_for_transmission-" + (byteArray[i] & 0x07).toString(10) + " ";
            switch(byteArray[i+1] & 0xFF) {
              case 0 :
            	readable_str += "0x00_unknown_reset";
                break;
              case 1:
                readable_str += "POR/PDR_reset_flag";
                break;
			        case 2:
                readable_str += "Independent_Watchdog_reset_flag";
                break;
              case 3:
                readable_str += "Window_watchdog_reset_flag";
                break;
              case 4:
                readable_str += "Low-Power_reset_flag";
                break;
              case 5:
                readable_str += "POR/PDR_reset_flag";
                break;
              case 6:
                readable_str += "Normal";
                break;
              case 7:
                readable_str += "Wired (button) reset";
                break;
              default:
                readable_str += "0x" + ("0"+(byteArray[i+1] & 0xFF)).toString(10);
            }
            readable_str += " ";
            decode_state = '1';
            break;
        case 0x17: 
            readable_str += "###Protocol Version-" + (byteArray[i] & 0x07).toString(10) + " ";
            readable_str += ((byteArray[i+1] & 0xFF)*256 + (byteArray[i+2] & 0xFF)).toString(10);
            readable_str += " ";
            decode_state = '2';
            break;
        }
    	break;
    case '4':
      decode_state = '3';
      break;
    case '3':
      decode_state = '2';
      break;
    case '2':
      decode_state = '1';
      break;
    case '1': 
      decode_state = 'start';
      break;
    }
  }
  return str + "\n" + readable_str;
}

// Decode decodes an array of bytes into an object.
//  - fPort contains the LoRaWAN fPort number
//  - bytes is an array of bytes, e.g. [225, 230, 255, 0]
// The function must return an object, e.g. {"temperature": 22.5}
function Decode(fPort, bytes) {
  	return { data: toHexString(bytes) };
}
