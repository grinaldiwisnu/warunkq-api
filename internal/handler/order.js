"use-strict"

const model = require("../models/order")
const response = require("../utils/response")
const { pagination } = require("../models/page")
const { getProductById } = require("../models/product")

exports.getOrders = (req, res) => {
  const page = pagination(req)
  model
    .getOrders(req, page)
    .then(result => {
      response.success(res, result)
    })
    .catch(err => {
      response.error(res, err)
    })
}

exports.newOrder = async (req, res) => {
  if (req.body.user_id == null)
    return response.error(res, "User id can't be empty")
  if (req.body.order_id == null)
    return response.error(res, "Order id can't be empty")
  if (req.body.order_name == null)
    return response.error(res, "Order name can't be empty")
  if (req.body.total_price == null)
    return response.error(res, "Total price can't be empty")
  if (req.body.detail_order == null)
    return response.error(res, "Detail order can't be empty")
  if (!Array.isArray(req.body.detail_order))
    return response.error(res, "Detail order must be array of object")
  if (req.body.discount_amount == null)
    req.body.discount_amount = 0
    if (req.body.discount_total == null)
    req.body.discount_total = 0

  const detailOrder = req.body.detail_order
  const orderProdId = detailOrder.map(item => item.prod_id)

  for (order in detailOrder) {
    const product = await getProductById(req, detailOrder[order].prod_id)
    if (product.length === 0)
      return response.error(
        res,
        `Product id ${detailOrder[order].prod_id} not found`
      )
    if (product[0].quantity < detailOrder[order].quantity)
      return response.error(
        res,
        `Quantity product id ${detailOrder[order].prod_id} not enough`
      )
  }

  model
    .newOrder(req, orderGenerator())
    .then(resultOrder => {
      let status = []
      detailOrder.forEach(async item => {
        await model
          .reduceQtyProduct(detailOrder)
          .then(result => status.push(true))
          .catch(err => status.push(false))
      })

      if (status.includes(false))
        return response.error(res, "Failed to create new order")
      else response.success(res, "Success create new order")
    })
    .catch(err => {
      if (err.code == "ER_DUP_ENTRY") this.newOrder(req, res)
      else response.error(res, err)
    })
}

exports.getDetailOrderById = (req, res) => {
  model
    .getOrderById(req)
    .then(result => {
      if (result.length != 0) {
        model
          .getDetailOrderById(req.params.order_id)
          .then(resultDetail => {
            const data = result.map(item => ({
              admin_id: item.admin_id,
              order_id: item.order_id,
              detail_order: resultDetail,
              total_price: item.total_price,
              discount_amount: item.discount_amount,
              discount_total: item.discount_total,
              status: item.status,
              cancel_reason: item.cancel_reason,
              created_at: item.created_at,
              update_at: item.update_at
            }))

            response.success(res, data)
          })
          .catch(err => {
            response.error(res, err)
          })
      } else {
        response.error(res, "Order Not Found")
      }
    })
    .catch(err => response.error(res, err))
}

exports.updateStatusOrder = (req, res) => {
  if (req.body.status == null)
    return response.error(res, "Status can't be empty")

  if (req.body.status == "cancel") {
    if (req.body.cancel_reason == null) {
      return response.error(res, "Cancel reason can't be empty")
    }
  }

  model
    .updateStatusOrder(req)
    .then(result => {
      model
        .getDetailOrder(req.params.order_id)
        .then(result => {
          const data = result.map(item => ({
            prod_id: item.prod_id,
            quantity: item.quantity
          }))

          model
            .updateQtyProduct(data, req.body.status)
            .then(result => {
              response.success(res, `Order updated to '${req.body.status}'`)
            })
            .catch(err => {
              response.error(res, err)
            })
        })
        .catch(err => {
          response.error(res, err.sqlMessage)
        })
    })
    .catch(err => {
      response.error(res, err.sqlMessage)
    })
}

const orderGenerator = () => {
  const date = new Date()
  const components = [
      date.getYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds()
  ]

  const id = "O-WRQ" + components.join("")
  return id
}
