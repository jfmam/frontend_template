const express = require('express');
const app = express()
const port = 3001
const path = require('path')

app.use(express.static(path.join(__dirname, '../build')))
app.get('*', (_, res) => {
    res.sendFile(path.join(__dirname, '../build/index.html'))
})

app.listen(port, () => console.log('app listening'))