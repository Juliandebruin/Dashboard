import time
import json
import sched
import serial
import socketio

priority = 1
pollingTime = 1

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
        try:
            jsonObj = json.loads(data)
            print('Send data...', data)
            sio.emit('rpm'    , {'rpm'    : jsonObj['rpm'    ]}, to=sid)
            sio.emit('speed'  , {'speed'  : jsonObj['speed'  ]}, to=sid)
            sio.emit('battery', {'battery': jsonObj['battery']}, to=sid)
        except:
            print('Error: ', data)
    
def repeat(task, sid): 
    runnable_task.enter(pollingTime, priority, repeat, (task, sid))

@sio.event
def connect(sid, environ):
    print(sid, 'connected')
    parse_data(sid)
    # task = sched.scheduler(time.time, time.sleep)
    # task.enter(pollingTime, priority, repeat, (task, sid))
    # task.run()

@sio.event
def disconnect(sid):
    print(sid, 'disconnected')
