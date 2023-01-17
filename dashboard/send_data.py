import time
import json
import serial

ser = serial.Serial(
	port='/dev/ttyS0',
	baudrate = 9600,
	parity=serial.PARITY_NONE,
	stopbits=serial.STOPBITS_ONE,
	bytesize=serial.EIGHTBITS,
	timeout=1
)

while 1:
	line = ser.readline()
	data = line.decode('utf-8')
	if data[0] == '{' and data[-3] == '}':
		jsonObj = json.loads(data)
		print(jsonObj['rpm'])
		print(jsonObj['speed'])
		print(jsonObj['battery'])