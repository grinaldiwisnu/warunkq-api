'use-strict'

const conn = require('../config/db')
const { getMaxPage } = require('./page')
const tableName = 'orders'

exports.getOrders = (req, page) => {
    let sql = `SELECT * FROM ${tableName}`

    return new Promise((resolve, reject) => {
        getMaxPage(page, null, `${tableName}`).then(maxPage => {
            const infoPage = {
                currentPage: page.page,
                totalAllOrder: maxPage.totalProduct,
                maxPage: maxPage.maxPage
            }

            conn.query(`${sql} LIMIT ? OFFSET ?`, [page.limit, page.offset], (err, data) => {
                if (!err) resolve({
                    infoPage,
                    data
                })
                else reject(err)
            })
        }).catch(err => reject(err))
    })
}

exports.newOrder = async (req, order) => {
    return new Promise((resolve, reject) => {
        conn.query(`INSERT INTO ${tableName} SET users_id = ?, order_id = ?, total_price = ?, status = ?, discount_amount = ?, discount_total = ?`,
            [req.body.user_id, order, req.body.total_price, req.body.status, req.body.discount_amount, req.body.discount_total],
            (err, result) => {
                if (!err) {
                    const values = req.body.detail_order.map(item => [item.quantity, item.sub_total, order, item.prod_id])
                    conn.query('INSERT INTO orders_detail (quantity, sub_total, orders_id, products_id) VALUES ? ',
                        [values],
                        (err, result) => {
                            if (!err) resolve(result)
                            else reject(err)
                        }
                    )
                } else reject(err)
            })
    })
}

exports.updateStatusOrder = req => {
    const body = req.body
    return new Promise((resolve, reject) => {
        conn.query(`UPDATE ${tableName} SET status = ?, cancel_reason = ? WHERE order_id = ?`, [body.status, body.cancel_reason, req.params.order_id],
            (err, result) => {
                if (!err) resolve(result)
                else reject(err)
            })
    })
}

exports.updateQtyProduct = (product, status) => {
    let sql = ''
    const operator = status == 'success' ? '-' : '+'
    console.log(product)
    
    product.forEach((item, index) => {
        sql += `UPDATE ${tableName} SET quantity = quantity ${operator} ${item.quantity} WHERE id = ${item.prod_id}`
    })

    return new Promise((resolve, reject) => {
        conn.query(sql, product, (err, result) => {
            if (!err) resolve(result)
            else reject(err)
        })
    })

}

exports.reduceQtyProduct = (product) => {
    return new Promise((resolve, reject) => {
        conn.query(`UPDATE ${tableName} SET quantity = quantity - ? WHERE id = ?`, [product.quantity, product.prod_id], (err, result) => {
            if(!err) resolve(result)
            else reject(err)
        })
    })
}

exports.getOrderById = (req, order) => {
    const orderId = req.params.order_id || req.body.order_id || order
    return new Promise((resolve, reject) => {
        conn.query(`SELECT * FROM ${tableName} WHERE order_id = ?`, [orderId],
            (err, result) => {
                if (!err) resolve(result)
                else reject(err)
            })
    })
}

exports.getDetailOrderById = orderId => {
    return new Promise((resolve, reject) => {
        conn.query(`SELECT orders_detail.products_id, orders_detail.quantity, orders_detail.sub_total, products.name FROM orders_detail JOIN products ON products.id = orders_detail.products_id WHERE orders_detail.orders_id = ?`, [orderId],
            (err, result) => {
                if (!err) resolve(result)
                else reject(err)
            })
    })
}