import time
import json
import serial
import socketio

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

def parse_data(sid):
    line = ser.readline()
    data = line.decode('utf-8')
    if data[0] == '{' and data[-3] == '}':
        jsonObj = json.loads(data)
        sio.emit('rpm'    , {'rpm'    : jsonObj['rpm'    ]}, to=sid)
        sio.emit('speed'  , {'speed'  : jsonObj['speed'  ]}, to=sid)
        sio.emit('battery', {'battery': jsonObj['battery']}, to=sid)

@sio.event
def connect(sid, environ):
    print(sid, 'connected')
    parse_data(sid)

@sio.event
def disconnect(sid):
    print(sid, 'disconnected')
