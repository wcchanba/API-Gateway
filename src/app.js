const https = require('https')
const fs = require('fs')
const express = require('express')
// const bcrypt = require('bcryptjs')
// const jwt = require('jsonwebtoken')
require('./db/mongoose') 
const User = require('./models/user')
const userRouter = require('./routers/user')
const elkRouter = require('./routers/elk')

const app = express()
// const port = 3000 // localhost
const port = 443 // prod https

// app.use((req, res, next) => {
//     next()
// })

app.use(express.json())
app.use(userRouter)
app.use(elkRouter)

// =============================================
// localhost
// app.listen(port, () => {
//     console.log('Server is up on port ' + port)
// })

// prod https
https
.createServer(
{
    cert: fs.readFileSync("/etc/letsencrypt/live/yellow-api-gateway.southeastasia.cloudapp.azure.com/fullchain.pem"),
    key: fs.readFileSync("/etc/letsencrypt/live/yellow-api-gateway.southeastasia.cloudapp.azure.com/privkey.pem")
},
app
)
.listen(port, () => {
    console.log('Server is up on port ' + port)
})