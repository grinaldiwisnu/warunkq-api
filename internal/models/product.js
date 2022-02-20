"use-strict"

const conn = require("../config/db")
const { getMaxPage } = require("./page")
const tableName = 'products'

const sortBy = (req, sql) => {
  const sortBy = req.query.sortby
  const orderBy = req.query.orderby

  if (sortBy == "name") {
    sql += `ORDER BY product.name `
  } else if (sortBy == "category") {
    sql += `ORDER BY category.name `
  } else if (sortBy == "updated") {
    sql += `ORDER BY product.updated_at `
  } else {
    sql += `ORDER BY product.id `
  }

  if (sortBy != null) {
    if (orderBy == "asc" || orderBy == null) {
      sql += "ASC"
    } else if ("desc") {
      sql += "DESC"
    }
  }

  return sql
}

const searchProduct = (req, sql) => {
  const keyword = req.query.search

  if (keyword != null) {
    sql += ` AND product.name LIKE ? `
  }

  return {
    sql,
    keyword
  }
}

exports.getProducts = (req, page) => {
  let sql = `SELECT product.id, product.name as product_name, product.description, product.image,
            category.name as category, product.price,  product.sell_price, product.quantity, product.created_at, product.updated_at FROM ${tableName} as product, 
            categories as category WHERE product.categories_id = category.id AND product.users_id = ? `

  const query = searchProduct(req, sql)
  sql = sortBy(req, query.sql)

  return new Promise((resolve, reject) => {
    getMaxPage(page, query.keyword, `${tableName}`)
      .then(maxPage => {
        const infoPage = {
          currentPage: page.page,
          totalAllProduct: maxPage.totalProduct,
          maxPage: maxPage.maxPage
        }

        conn.query(
          `${sql} LIMIT ? OFFSET ?`,
          query.keyword == null
            ? [req.body.user_id, page.limit, page.offset]
            : ["%" + query.keyword + "%", page.limit, page.offset],
          (err, data) => {
            if (!err)
              resolve({
                infoPage,
                data
              })
            else reject(err)
          }
        )
      })
      .catch(err => reject(err))
  })
}

exports.getProductById = (req, orderProdId) => {
  return new Promise((resolve, reject) => {
    const prodId = req.params.prod_id || orderProdId || req.body.prod_id
    const sql = `SELECT product.id, product.name as product_name, product.description, product.image,
        category.name as category, product.price, product.sell_price, product.quantity, product.created_at, product.updated_at FROM ${tableName} as product, 
        categories as category WHERE product.categories_id = category.id AND product.id IN (?) AND product.users_id = ?`

    conn.query(sql, [prodId, req.body.user_id], (err, result) => {
      if (!err) resolve(result)
      else reject(err)
    })
  })
}

exports.getProductByName = req => {
  return new Promise((resolve, reject) => {
    const prodName = req.body.prod_name || req.params.prod_name

    conn.query(
      `SELECT product.id, product.name as product_name, product.description, product.image,
        category.name as category, product.price, product.sell_price, product.quantity, product.created_at, product.updated_at FROM ${tableName} as product, 
        categories as category WHERE product.categories_id = category.id AND product.name = ? AND product.users_id = ?`,
      [prodName, req.body.user_id],
      (err, result) => {
        if (!err) resolve(result)
        else reject(err)
      }
    )
  })
}

exports.getProductByCategoryId = req => {
    return new Promise((resolve, reject) => {
        conn.query(`SELECT product.id, product.name as product_name, product.description, product.image,
        category.name as category, product.price, product.sell_price, product.quantity, product.created_at, product.updated_at FROM ${tableName} as product, 
        categories as category WHERE product.categories_id = category.id AND category.id = ? AND product.users_id = ?`), [req.query.prod_categories_id, req.body.user_id],
        (err, result) => {
            if(!err) resolve(result)
            else reject(err)
        }
    })
}

exports.newProduct = req => {
  const body = req.body
  return new Promise((resolve, reject) => {
    conn.query(
      `INSERT INTO ${tableName} SET name = ?, description = ?, image = ?, categories_id = ?, users_id = ?, price = ?, sell_price = ?, quantity = ?`,
      [
        body.prod_name,
        body.prod_desc,
        body.cloud_image,
        body.prod_categories_id,
        body.user_id,
        body.prod_price,
        body.prod_sell_price,
        body.prod_quantity
      ],
      (err, result) => {
        if (!err) resolve(result)
        else reject(err)
      }
    )
  })
}

exports.updateProduct = req => {
  const body = req.body
  return new Promise((resolve, reject) => {
    conn.query(
      `UPDATE ${tableName} SET name = ?, description = ?, image = ?, categories_id = ?, price = ?, sell_price = ?, quantity = ? WHERE id = ? AND users_id = ?`,
      [
        body.prod_name,
        body.prod_desc,
        body.cloud_image,
        body.prod_categories_id,
        body.prod_price,
        body.prod_sell_price,
        body.prod_quantity,
        req.params.prod_id,
        req.body.user_id
      ],
      (err, result) => {
        if (!err) resolve(result)
        else reject(err)
      }
    )
  })
}

exports.deleteProduct = req => {
  return new Promise((resolve, reject) => {
    const prodId = req.params.prod_id

    conn.query(
      `DELETE FROM ${tableName} WHERE id = ?`,
      [prodId],
      (err, result) => {
        if (!err) resolve(result)
        else reject(err)
      }
    )
  })
}
