#!/usr/bin/env python3

import time
import json
import serial

reading = "FALSE"

ser = serial.Serial(
	port='/dev/ttyS0',
	baudrate = 9600,
	parity=serial.PARITY_NONE,
	stopbits=serial.STOPBITS_ONE,
	bytesize=serial.EIGHTBITS,
	timeout=1
)

def readline():
	data = ""
	global reading
	if reading == "FALSE":
		reading = "TRUE"
		line = ser.readline()
		data = line.decode('utf-8')
		reading = "FALSE"
	return data

def read_func():
	line = ser.read()
	data = line
	print(data)
	# if len(data) > 0:
	# 	if data[0] == '{' and data[-3] == '}':
	# 		jsonObj = json.loads(data)
	# 		print(jsonObj['rpm'])
	# 		print(jsonObj['speed'])
	# 		print(jsonObj['battery'])
	# 		print(jsonObj['pin'])
	# 		print(jsonObj['pout'])

while 1:
	# print("Line: " + readline())
	myStr = ser.read()
	print("Byte: ", myStr)#.decode())
	time.sleep(0.1)