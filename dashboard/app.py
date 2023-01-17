import time
import socketio

sio = socketio.Server()
app = socketio.WSGIApp(sio, 'http://localhost:3000')

@sio.event
def connect(sid, environ):
    print(sid, 'connected')
    sio.emit('rpm'    , {'rpm':   5000}, to=sid)
    sio.emit('speed'  , {'speed':   45}, to=sid)
    sio.emit('battery', {'battery': 80}, to=sid)

@sio.event
def disconnect(sid):
    print(sid, 'disconnected')
