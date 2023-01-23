import json
import serial
import socketio

priority = 1
pollingTime = 1

reading = "FALSE"

ser = serial.Serial(
	port='/dev/ttyS0',
	baudrate = 9600,
	parity=serial.PARITY_NONE,
	stopbits=serial.STOPBITS_ONE,
	bytesize=serial.EIGHTBITS,
	timeout=1
)

sio = socketio.Server()
app = socketio.WSGIApp(sio, static_files = {
    '/': './build/',
})

@sio.event
def connect(sid, environ):
    print(sid, 'connected')

@sio.event
def disconnect(sid):
    print(sid, 'disconnected')

def readline():
    data = "a"
    global reading
    if reading == "FALSE":
        reading = "TRUE"
        line = ser.readline()
        data = line.decode('utf-8')
        reading = "FALSE"
    return data

@sio.event
def request_data(sid, none):
    print('Loading data...')
    data = readline()
    try:
        jsonObj = json.loads(data)
        return data
    except:
        print('Error not a json string: ', data)
        # data = {}
        data = {"rpm"    : "3500","speed"  :   "75","battery":   "80","pin"    : "1050","pout"   : "1000"}
        return data