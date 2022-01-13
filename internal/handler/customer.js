"use-strict"

const model = require("../models/customer")
const response = require("../utils/response")
const { pagination } = require("../models/page")

exports.getCustomers = (req, res) => {
  const page = pagination(req)
  model
    .getCustomers(req, page)
    .then(result => {
      response.success(res, result)
    })
    .catch(err => {
      response.error(res, err)
    })
}

exports.getCustomerById = (req, res) => {
  model
    .getCustomerById(req)
    .then(result => {
      if (result.length != 0) response.success(res, result)
      else response.error(res, "Customer id not found")
    })
    .catch(err => {
      response.error(res, err)
    })
}

exports.newCustomer = (req, res) => {
  if (req.body.customer_name == null || req.body.customer_name == "")
    return response.error(res, "Customer name can't be empty")
  if (req.body.customer_phone == null || req.body.customer_phone == "")
    return response.error(res, "Customer phone can't be empty")

  model.getCustomerByName(req).then(resultName => {
    if (resultName.length !== 0)
      return response.error(res, "Customer name already exist")
    model
      .newCustomer(req)
      .then(resultNew => {
        // response.success(res, "Category added successfully")
        model
          .getCustomerById(req, resultNew.insertId)
          .then(result => response.success(res, result))
          .catch(err => response.error(res, err))
      })
      .catch(err => {
        response.error(res, err)
      })
  })
}

exports.updateCustomer = (req, res) => {
  if (req.body.customer_name == null || req.body.customer_name == "")
    return response.error(res, "Customer name can't be empty")
  if (req.body.customer_phone == null || req.body.customer_phone == "")
    return response.error(res, "Customer phone can't be empty")

  model
    .getCustomerById(req)
    .then(resultId => {
      if (resultId.length === 0) response.error(res, "Customer id not found")
      model.getCustomerByName(req).then(resultName => {
        if (
          resultName.length !== 0 &&
          resultName[0].id !== Number(req.params.customer_id)
        )
          return response.error(res, "Customer name already exist")
        model
          .updateCustomer(req)
          .then(resultUpdate => {
            model
              .getCustomerById(req)
              .then(result => response.success(res, result))
              .catch(err => response.error(res, err))
          })
          .catch(err => {
            response.error(res, err)
          })
      })
    })
    .catch(err => {
      response.error(res, err)
    })
}

exports.deleteCustomer = (req, res) => {
  model
    .getCustomerById(req)
    .then(data => {
      if (data.length != 0) {
        model
          .updateUncategorized(req.params.customer_id)
          .then(result => {
            model
              .deleteCustomer(req)
              .then(result => {
                response.success(res, {
                  message: "Customer deleted successfully",
                  id: req.params.customer_id
                })
              })
              .catch(err => {
                response.error(res, err)
              })
          })
          .catch(err => response.error(res, err))
      } else {
        response.error(res, {
          message: "Customer id not found",
          id: req.params.customer_id
        })
      }
    })
    .catch(err => {
      response.error(res, err)
    })
}
