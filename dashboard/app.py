import socketio
import time

sio = socketio.Server()
app = socketio.WSGIApp(sio, static_files={
    '/': './build/'
})

@sio.event
def connect(sid, environ):
    print(sid, 'connected')
    sio.emit('rpm'    , {'rpm':   5000}, to=sid)
    sio.emit('speed'  , {'speed':   45}, to=sid)
    sio.emit('battery', {'battery': 80}, to=sid)

@sio.event
def disconnect(sid):
    print(sid, 'disconnected')

# while True:
    
#     sio.emit('speed'  , {'speed':   45}, to=sid)
#     sio.emit('battery', {'battery': 80}, to=sid)
#     print('send update')
#     sio.sleep(1)
