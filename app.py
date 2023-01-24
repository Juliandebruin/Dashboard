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
    data = ""
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
    print('Data loaded: ', data)
    try:
        jsonObj = json.loads(data)
        return data
    except:
        print('Error not a json string: ', data)
        return {}