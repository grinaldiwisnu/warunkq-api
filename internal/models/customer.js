"use-strict";

const conn = require("../config/db");
const { getMaxPage } = require("./page");
const tableName = 'customer'

exports.getCustomers = (req, page) => {
  const sql = `SELECT * FROM ${tableName}`;
  return new Promise((resolve, reject) => {
    getMaxPage(page, null, `${tableName}`)
      .then(maxPage => {
        const infoPage = {
          currentPage: page.page,
          totalAllCategories: maxPage.totalProduct,
          maxPage: maxPage.maxPage
        };

        conn.query(
          `${sql} LIMIT ? OFFSET ?`,
          [page.limit, page.offset],
          (err, data) => {
            if (!err) resolve({ infoPage, data });
            else reject(err);
          }
        );
      })
      .catch(err => {
        reject(err);
      });
  });
};

exports.getCustomerById = (req, id) => {
  return new Promise((resolve, reject) => {
    const categoryId = req.params.customer_id || req.body.customer_id || id;

    conn.query(
      `SELECT * FROM ${tableName} WHERE id = ?`,
      [categoryId],
      (err, result) => {
        if (!err) resolve(result);
        else reject(err);
      }
    );
  });
};

exports.getCustomerByName = req => {
  return new Promise((resolve, reject) => {
    const customerName = req.body.customer_name || req.params.customer_name;
    const usersId = req.body.user_id

    conn.query(
      `SELECT * FROM ${tableName} WHERE name = ? AND users_id = ?`,
      [customerName, usersId],
      (err, result) => {
          if(!err) resolve(result);
          else reject(err);
      }
    );
  });
};

exports.newCustomer = req => {
  return new Promise((resolve, reject) => {
    conn.query(
      `INSERT INTO ${tableName} SET name = ?, phone = ?, users_id = ?`,
      [req.body.customer_phone, req.body.customer_phone, req.body.user_id],
      (err, result) => {
        if (!err) resolve(result);
        else reject(err);
      }
    );
  });
};

exports.updateCustomer = req => {
  return new Promise((resolve, reject) => {
    conn.query(
      `UPDATE ${tableName} SET name = ?, phone = ? WHERE id = ?`,
      [req.body.customer_name, req.body.customer_phone, req.params.customer_id],
      (err, result) => {
        if (!err) resolve(result);
        else reject(err);
      }
    );
  });
};

exports.deleteCustomer = req => {
  return new Promise((resolve, reject) => {
    const categoryId = req.params.customer_id;

    conn.query(
      `DELETE FROM ${tableName} WHERE id = ?`,
      [categoryId],
      (err, result) => {
        if (!err) resolve(result);
        else reject(err);
      }
    );
  });
};
