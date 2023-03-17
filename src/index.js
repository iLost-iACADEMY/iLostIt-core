const express = require('express')
const app = express()
const port = 6885

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})