'use-strict'

const express = require('express')
const controller = require('../handler/order')

const Router = express.Router()

Router.get('/', controller.getOrders)
Router.get('/:order_id', controller.getDetailOrderById)
Router.post('/', controller.newOrder)
Router.put('/:order_id', controller.updateStatusOrder)
Router.get('/report/summary', controller.getMonthlySummary)
Router.get('/report/selling', controller.getTopSellingItemMonthly)

module.exports = Router