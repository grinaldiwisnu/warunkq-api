'use-strict'

const express = require('express')
const controller = require('../handler/user')
const {validateUser} = require('../utils/middleware')

const Router = express()

Router.get('/', controller.getUserList)
Router.post('/register', controller.registerUser)
Router.post('/login', controller.loginUser)
Router.get('/:user_id', validateUser, controller.getUserById)
Router.put('/:user_id', validateUser, controller.updateUser)
Router.delete('/:user_id', validateUser, controller.deleteUser)

module.exports = Router