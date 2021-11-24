'use-strict'

const express = require('express')
const controller = require('../handler/order')

const Router = express.Router()

Router.get('/', controller.getOrders)
Router.get('/:order_id', controller.getDetailOrderById)
Router.post('/', controller.newOrder)
Router.put('/:order_id', controller.updateStatusOrder)

module.exports = Router