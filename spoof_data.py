import time
import serial

ser = serial.Serial(
	port='/dev/ttyS0',
	baudrate = 9600,
	parity=serial.PARITY_NONE,
	stopbits=serial.STOPBITS_ONE,
	bytesize=serial.EIGHTBITS,
	timeout=1
)

def spoof():
	ser.write(b'{"rpm": "3500","speed": "75","battery": "80","pin": "1000","pout": "1050"}\n')

while(1):
    spoof()
    time.sleep(3)