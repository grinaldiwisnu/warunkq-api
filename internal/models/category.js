"use-strict";

const conn = require("../config/db");
const { getMaxPage } = require("./page");
const tableName = 'categories'

exports.getCategories = (req, page) => {
  const sql = `SELECT * FROM ${tableName} WHERE users_id = ?`;
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
          [req.body.user_id, page.limit, page.offset],
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

exports.getCategoryById = (req, id) => {
  return new Promise((resolve, reject) => {
    const categoryId = req.params.category_id || req.body.category_id || id;

    conn.query(
      `SELECT * FROM ${tableName} WHERE id = ? AND users_id = ?`,
      [categoryId, req.body.user_id],
      (err, result) => {
        if (!err) resolve(result);
        else reject(err);
      }
    );
  });
};

exports.getCategoryByName = req => {
  return new Promise((resolve, reject) => {
    const categoryName = req.body.category_name || req.params.category_name;
    const usersId = req.body.user_id

    conn.query(
      `SELECT * FROM ${tableName} WHERE name = ? AND users_id = ?`,
      [categoryName, usersId],
      (err, result) => {
          if(!err) resolve(result);
          else reject(err);
      }
    );
  });
};

exports.newCategory = req => {
  return new Promise((resolve, reject) => {
    conn.query(
      `INSERT INTO ${tableName} SET name = ?, users_id = ?`,
      [req.body.category_name, req.body.user_id],
      (err, result) => {
        if (!err) resolve(result);
        else reject(err);
      }
    );
  });
};

exports.updateCategory = req => {
  return new Promise((resolve, reject) => {
    conn.query(
      `UPDATE ${tableName} SET name = ?, description = ? WHERE id = ? AND users_id = ?`,
      [req.body.category_name, req.body.category_description, req.params.category_id, req.body.user_id],
      (err, result) => {
        if (!err) resolve(result);
        else reject(err);
      }
    );
  });
};

exports.updateUncategorized = categoryId => {
    return new Promise((resolve, reject) => {
        conn.query(`UPDATE ${tableName} SET category = 1 WHERE category = ?`, [categoryId], (err, result) => {
            if(!err) resolve(result);
            else reject(err);
        })
    })
}

exports.deleteCategory = req => {
  return new Promise((resolve, reject) => {
    const categoryId = req.params.category_id;

    conn.query(
      `DELETE FROM ${tableName} WHERE id = ? AND users_id = ?`,
      [categoryId, req.body.user_id],
      (err, result) => {
        if (!err) resolve(result);
        else reject(err);
      }
    );
  });
};
