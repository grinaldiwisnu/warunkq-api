'use-strict'

const express = require('express')
const controller = require('../handler/customer')

const Router = express.Router()

Router.get('/', controller.getCustomers)
Router.get('/:customer_id', controller.getCustomerById)
Router.post('/', controller.newCustomer)
Router.put('/:customer_id', controller.updateCustomer)
Router.delete('/:customer_id', controller.deleteCustomer)

module.exports = Router