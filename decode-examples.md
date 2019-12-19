# Complete decoding example
```
$ node Sensefarm-LPP-decoder.js b006b800013009079800005457a800959900000013084118000009410c2773
Read from command line: b006b800013009079800005457a800959900000013084118000009410c2773
Parsed as a hex string
Decoder started with 0xb006b800013009079800005457a800959900000013084118000009410c2773
Sensor header byte 0xb0 decoded into type: 0x16 number 0
Sensor parameter byte 0x06
### Reason_for_transmission: Normal
Sensor header byte 0xb8 decoded into type: 0x17 number 0
Sensor parameter byte 0x00
Sensor parameter byte 0x01
### Protocol Version 1
Sensor header byte 0x30 decoded into type: 0x6 number 0
Sensor parameter byte 0x09
Sensor parameter byte 0x07
### Voltage-0 2.311 V
Sensor header byte 0x98 decoded into type: 0x13 number 0
Sensor parameter byte 0x00
Sensor parameter byte 0x00
Sensor parameter byte 0x54
Sensor parameter byte 0x57
### Resistance-0 21591 Ohm
Sensor header byte 0xa8 decoded into type: 0x15 number 0
Sensor parameter byte 0x00
Sensor parameter byte 0x95
### Soil_moisture-0 149 kPa
Sensor header byte 0x99 decoded into type: 0x13 number 1
Sensor parameter byte 0x00
Sensor parameter byte 0x00
Sensor parameter byte 0x00
Sensor parameter byte 0x13
### Resistance-1 19 Ohm
Sensor header byte 0x08 decoded into type: 0x1 number 0
Sensor parameter byte 0x41
Sensor parameter byte 0x18
Sensor parameter byte 0x00
Sensor parameter byte 0x00
### Temperature-0 9.5 Degree Celcius
Sensor header byte 0x09 decoded into type: 0x1 number 1
Sensor parameter byte 0x41
Sensor parameter byte 0x0c
Sensor parameter byte 0x27
Sensor parameter byte 0x73
### Temperature-1 8.759631156921387 Degree Celcius

0xb006b800013009079800005457a800959900000013084118000009410c2773 decoded as ### Reason_for_transmission: Normal  ### Protocol Version 1  ### Voltage-0 2.311 V  ### Resistance-0 21591 Ohm  ### Soil_moisture-0 149 kPa  ### Resistance-1 19 Ohm  ### Temperature-0 9.5 Degree Celcius  ### Temperature-1 8.759631156921387 Degree Celcius
Program exit
```
# Shorted examples
```
0xb006b8000130098f980000001399000000130840ac00000940e37476 decoded as ### Reason_for_transmission: Normal  ### Protocol Version 1  ### Voltage-0 2.447 V  ### Resistance-0 19 Ohm  ### Resistance-1 19 Ohm  ### Temperature-0 5.375 Degree Celcius  ### Temperature-1 7.107966423034668 Degree Celcius
```
```
0xb006b8000130097098009c18f599009c18f50841abaa49 decoded as ### Reason_for_transmission : Normal  ### Protocol Version 1  ### Voltage-0 2.416 V  ### Resistance-0 10230005 Ohm  ### Resistance-1 10230005 Ohm  ### Temperature-0 21.458147048950195 Degree Celcius
```
```
0xb006b800013009159800005465a8009599000000130841240000094122a248 decoded as ### Reason_for_transmission: Normal  ### Protocol Version 1  ### Voltage-0 2.325 V  ### Resistance-0 21605 Ohm  ### Soil_moisture-0 149 kPa  ### Resistance-1 19 Ohm  ### Temperature-0 10.25 Degree Celcius  ### Temperature-1 10.164619445800781 Degree Celcius
```
``` 
0xb006b800013009179800005989a8009f99000000130840de00000940e47c0a decoded as ### Reason_for_transmission: Normal  ### Protocol Version 1  ### Voltage-0 2.327 V  ### Resistance-0 22921 Ohm  ### Soil_moisture-0 159 kPa  ### Resistance-1 19 Ohm  ### Temperature-0 6.9375 Degree Celcius  ### Temperature-1 7.140141487121582 Degree Celcius
```
Raw data to try if you need to confirm your own decoder (from filtered log, 2019-dec-19, see below for explanation of messages that does not start with b0 )
```
     payload_hex: 'b006b8000130098a980000001399000000130840b000000940b0a92e',
     payload_hex: '300da70841ac0000',
     payload_hex: '300d950840c000000940aa0000',
     payload_hex: 'b006b800013008e8980000001399000000130840ba00000940c2d9c3',
     payload_hex: 'b006b8000130091d9800005665a80099990000001308410a00000940fff0d7',
     payload_hex: '300d1a0840a00000',
     payload_hex: 'b006b8000130097c980000001399000000130840b000000940b5cf14',
     payload_hex: '300dac0841ac0000',
     payload_hex: 'b006b80001300912980000001399000000140840b600000940c7ffa9',
     payload_hex: 'b006b80001300912980000551ba8009699000000130841130000094106a9b1',
     payload_hex: '300d8a0840c60000',
     payload_hex: 'b006b80001300986980000001399000000130840ca00000940ace2b8',
     payload_hex: '300d950840c600000940a60000',
     payload_hex: 'b006b80001300972980000001399000000130840b000000940b9958a',
     payload_hex: '300daa0841ac0000',
     payload_hex: 'b006b800013008f8980000001399000000140840b800000940cccdb3',
     payload_hex: '300d1a0840a00000',
     payload_hex: 'b006b800013009079800005457a800959900000013084118000009410c2773',
     payload_hex: 'b006b800013009b2980000001399000000130840ca00000940b2607b',
     payload_hex: 'b006b8000130099598009c18f599009c18f50841ab526d',
     payload_hex: '300d8a0840c60000',
     payload_hex: 'b006b8000130097b980000001399000000130840b000000940be6394',
     payload_hex: '300dac0841ac0000',
     payload_hex: '300d970840ca00000940a40000',
     payload_hex: 'b006b800013008f0980000001399000000140840b800000940d1f39a',
     payload_hex: 'b006b800013009aa980000001399000000130840cc00000940b8361a',
     payload_hex: '300da3980000035299000002a2',
     payload_hex: '300d1d0840a00000',
     payload_hex: 'b006b8000130096f980000001399000000130840ae00000940c4e8ec',
     payload_hex: '300daa0841a80000',
     payload_hex: 'b006b800013008f5980000001399000000130840b800000940d50a57',
     payload_hex: 'b006b800013009389800005363a80093990000001308411f0000094114e7e1',
     payload_hex: '300d8d0840c60000',
     payload_hex: '300d970840d000000940a40000',
     payload_hex: '300d52980000033b99000002fb',
     payload_hex: 'b006b80001300963980000001399000000130840ae00000940cccdb3',
     payload_hex: 'b006b80001300900980000533ea8009299000000130841210000094117a6c3',
     payload_hex: '300d2a98000003509900000310',
     payload_hex: 'b006b800013009b7980000001399000000130840ca00000940c5f080',
     payload_hex: '300d8f0840c60000',
     payload_hex: '300daa0841a80000',
     payload_hex: 'b006b8000130097b980000001399000000130840b000000940d56233',
     payload_hex: '300d9a0840d800000940a20000',
     payload_hex: 'b006b800013008f0980000001399000000130840b800000940d611ec',
     payload_hex: 'b006b80001300908980000533ea8009299000000130841220000094119b5ec',
 ```
# CUBE01 protocol (old version ) decoded with CUBE02 decoder (newer version)
See sticker on side of CUBE for info about version. As can be seen, the data can still be extracted, but safety guards are not working. Thus a packet with wrong application decryption key can not be detected which can in turn lead to a lot of false sensors showing up ( it is a common mistake to read or enter the wrong decryption keys into the LoRa servers ).
```
$ node Sensefarm-LPP-decoder.js 300dac0841ac0000
Read from command line: 300dac0841ac0000
Parsed as a hex string
Decoder started with 0x300dac0841ac0000
Sensor header byte 0x30 decoded into type: 0x6 number 0
Sensor parameter byte 0x0d
Sensor parameter byte 0xac
### Voltage-0 3.5 V
Sensor header byte 0x08 decoded into type: 0x1 number 0
Sensor parameter byte 0x41
Sensor parameter byte 0xac
Sensor parameter byte 0x00
Sensor parameter byte 0x00
### Temperature-0 21.5 Degree Celcius

0x300dac0841ac0000 decoded as ### Voltage-0 3.5 V  ### Temperature-0 21.5 Degree Celcius #### Unknown protocol. Decoding failed.
```


