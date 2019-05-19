## Payload
Allows for any number of sensors and combinations.

| Sensor | Sensor | Sensor |  ...  |
| :----: | :----: | :----: | :---: |


### Sensor 
Every sensor has 1 header byte and atleast 1 byte for value.

| Header  | Value      |
| :-----: | :--------: |
| 1 Byte  | 1..N Bytes |


### Sensor Header
Sensor header contains the type of sensor and a number to diffrentiate it from other sensors of the same type. This means each device can have a maximum of 8 sensors of the same type.

| Bit 7..3 | Bit 2..0   |
| :------: | :--------: |
| Type     | ID 0..7    |


### Sensor Type (Uplink)
All multi-byte values are Big-endian.

| Hex  | Name               | Size | Format              | Comment                   |
| :---:| :---:              |:---: | :---:               | :---:                     |
| 0x00 | Proprietary        |      |                     | Data following this byte uses proprietary format |
| 0x01 | Temperature        | 4    | Float               |  &deg;C |
| 0x02 | Relative Humidity  | 2    | Unsigned (x/100)    | 0 -> 100.00%               |
| 0x03 | Accelerometer      | 6    | Signed 3(x/1000)    | X,Y,Z -32.767 -> 32.767 G |  
| 0x04 | Illuminance        | 4    | Unsigned, Float     | Lux                       |
| 0x05 | Analog             | 2    | Unsigned            | 0 -> 65535 mV             |
| 0x06 | Battery            | 2    | Unsigned            | 0 -> 65535 mV             |
| 0x07 | Altitude           | 4    | Signed, Float       | Meters                    |
| 0x08 | Pulse              | 2    | Unsigned            | 0-65535 pulses, Difference        |
| 0x09 | Pulse ABS          | 4    | Unsigned, Overflow  | 0-4294967295, Absolute  |
| 0x0A | Rotation           | 2    | Signed              |  –32768 -> +32767         |
| 0x0B | Rotation ABS       | 4    | Signed, Overflow    | -2147483648 -> +2147483647 |
| 0x0C | RSSI + SNR         | 2    | Unsigned (x-215) +  Signed | -215dBm -> +40dBm, -128dBm -> +127dBm |
| 0x0D | GPS                | 8    | Signed, Float 2x    | Latitude, Longitude (Degrees) |
| 0x0E | GPS Detailed       | 16   | Signed, Double 2x   | Latitude, Longitude (Degrees) |
| 0x0F | Wind Speed         | 2    | Unsigned (x/100)    | 0 -> 655.35 m/s |
| 0x10 | Wind Direction     | 2    | Unsigned (x/100)    | 0 -> 360.00 &deg; |
| 0x11 | State              | 1    | Bitmask             | Each bit represents a on/off state of thing. |
| 0x12 | Misc.              | 4    | Signed, Float       |                           |
| 0x13 | Resistance         | 4    | Unsigned            | 0 -> 4294967295 Ohm       |
| 0x14 | 64-bit ID          | 8    |                     | A 64-bit ID for next sensor |
| 0x15 | Soil Moisture      | 2    | Unsigned            | 0 -> 65535 kPa |
| 0x16 | Transmission Reason | 1   |                     | User defined |
| 0x17 | Protocol Version   | 2    | Unsigned            | Version 0 -> 65535 |
| ...  | RFU                |      |                     | Reserved for future use   |


### Actuator Type (Downlink)
The cube series adopted parts of the Elsys format ( see https://www.elsys.se/en/wp-content/uploads/sites/3/2016/09/ELSYS_downlink_payload_v2-1.pdf ) 
Elsys has an online message generator
https://www.elsys.se/en/downlink-generator/

There must be a headerbyte of 0x3E first.

Then follows a byte with number of bytes following that byte. 

Supported commands are:

| Hex  | Name               | Size | Format              | Comment                   |
| :---:| :---:              |:---: | :---:               | :---:                     |
| 0x1F | Send Period        | 4    | Unsigned            | Seconds to sleep until next measurement |
| 0xFE | Reboot             | 0    | -                   | Reboot the device. This forced the device to use new settings. Reboot command should always be last in the command list as it does an immeditate reboot when read. |

* Do not send unsupported Elsys commands. They might work but partly but will void your warranty. Examples are AppSKey, NwkSKey and DevAddr *

Example message:
```
3E061F00000E10FE 

0x3E = Header byte
0x06 = 6 bytes will follow
0x1F = Send period
0x00000E10 = 3600 seconds to sleep
0xFE = Reboot with new settings.

```

