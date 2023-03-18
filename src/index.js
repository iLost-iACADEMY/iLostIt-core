const express = require('express')
const app = express()
const port = 6885

app.get('/', (req, res) => {
  res.send('iLost Backend Running...')
})

app.listen(port, "0.0.0.0", () => {
  console.log(`Listening on port ${port}`)
})