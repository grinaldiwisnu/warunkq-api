"use-strict"

const model = require("../models/order")
const user = require("../models/user")
const qr = require("qrcode")


exports.getReceipt = async (req, res) => {
  if (req.params.order_id === null)
    return response.error(res, "order number can't be empty")

  order = await model.getOrderById(req, req.params.order_id)
  if (order.length != 0) {
    orderDetail = await model.getDetailOrderById(req.params.order_id)
    if (orderDetail.length != 0) {
      const data = order.map(item => ({
        admin_id: item.admin_id,
        order_id: item.order_id,
        order_name: item.order_name,
        total_price: item.total_price,
        discount_amount: item.discount_amount,
        discount_total: item.discount_total,
        status: item.status,
        cancel_reason: item.cancel_reason,
        created_at: item.created_at,
        update_at: item.update_at,
        detail_order: orderDetail,
      }))

      detailUser = await user.getUserById(req, order[0].users_id)
      qr.toDataURL(`${req.protocol}://${req.get('host')}${req.originalUrl}`, (err, src) => {
        if (err) res.send("Error occured");

        res.render('pages/receipt', { user: detailUser[0], order: data, src: src })
      })
    } else {
      res.render('pages/error')
    }
  } else {
    res.render('pages/error')
  }
}
