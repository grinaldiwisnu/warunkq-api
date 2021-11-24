'use-strict'

const express = require('express')
const product = require('./product')
const category = require('./category')
const order = require('./order')
const user = require('./user')
const {validateUser} = require('../utils/middleware')

const Router = express.Router()

Router.get('/', (req, res) => {
    res.json({
        message: "WarunkQ Server API",
        author: "Grinaldi Wisnu",
        email: "grinaldi@student.ub.ac.id"
    })
})

Router.use('/product', validateUser, product)
Router.use('/category', validateUser, category)
Router.use('/order', validateUser, order)
Router.use('/user', user)

module.exports = Router