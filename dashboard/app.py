import time
import serial
import socketio

ser = serial.Serial("/dev/ttyS0", 9600)

sio = socketio.Server()
app = socketio.WSGIApp(sio, static_files = {
    '/': './build/',
})

i = 50

@sio.event
def connect(sid, environ):
    print(sid, 'connected')
    ser.write("Connected".encode())
    print('rpm:     ' + str(i *  80))
    print('speed:   ' + str(i * 0.8))
    print('battery: ' + str(i      ))
    sio.emit('rpm'    , {'rpm':   5000}, to=sid)
    sio.emit('speed'  , {'speed':   45}, to=sid)
    sio.emit('battery', {'battery': 80}, to=sid)

@sio.event
def disconnect(sid):
    print(sid, 'disconnected')
