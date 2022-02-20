'use-strict'

const express = require('express')
const product = require('./product')
const category = require('./category')
const customer = require('./customer')
const order = require('./order')
const user = require('./user')
const {validateUser} = require('../utils/middleware')
const multer = require('multer')
const storage = require('../utils/multer')

const Router = express.Router()

Router.get('/', (req, res) => {
    res.json({
        message: "WarunkQ Server API",
        author: "Grinaldi Wisnu",
        email: "grinaldi@student.ub.ac.id"
    })
})

Router.use(multer({storage}).single('prod_image'))
Router.use('/product', validateUser, product)
Router.use('/category', validateUser, category)
Router.use('/customer', validateUser, customer)
Router.use('/order', validateUser, order)
Router.use('/user', user)

module.exports = Router