const express = require('express')
const http = require('http').Server(express);
const io = require("socket.io")(http);
const app = express()
const port = 6885

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

http.listen(port, "0.0.0.0", () => {
  console.log(`Listening on port ${port}`)
})