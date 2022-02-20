'use-strict'

require('dotenv/config')

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const logger = require('morgan')

const Router = require('./internal/routes/index')

const server = express()
const port = process.env.PORT || 5000
const nodeEnv = 'Development'

server.use(cors())

server.use(logger('dev'))
server.use(bodyParser.json())
server.use(bodyParser.urlencoded({
    extended:true
}))

server.use('/', Router)

server.listen(port, () => {
    console.log(`Server is running with port ${port} in ${nodeEnv}`)
})

module.exports = server
