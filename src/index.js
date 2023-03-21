const express = require('express')
const http = require('http').Server(express);
const io = require("socket.io")(http);
const app = express()

// Backend Request-Response Server
app.get('/', (req, res) => {
  res.send('iLost Backend Running...')
})

// Realtime Server
io.on('connection', function(socket) {
  console.log('A user connected');

  socket.on('disconnect', function () {
     console.log('A user disconnected');
  });
});

app.listen(6885, "0.0.0.0", () => {
  console.log(`Backend Listening on port ${6885}`)
})

http.listen(6886, "0.0.0.0", () => {
  console.log(`Realtime Listening on port ${6886}`)
})