'use-strict'

const conn = require('../config/db')
const bcrypt = require('bcrypt')
const salt = bcrypt.genSaltSync(10)
const {getMaxPage} = require('./page')
const tableName = 'users'

exports.registerUser = req => {
    const body = req.body
    const pass = bcrypt.hashSync(body.password, salt)

    return new Promise((resolve, reject) => {

        conn.query(`INSERT INTO ${tableName} SET fullname = ?, username = ?, password = ?, email = ?`,
            [body.fullname, body.username, pass, body.email],
            (err, result) => {
                if(!err) resolve(result)
                else reject(err)
            })
    })
}

exports.fillDetailUser = req => {
    const body = req.body

    return new Promise((resolve, reject) => {
        conn.query(`INSERT INTO users_detail SET phone_number = ?, store_name = ?, store_address = ?, users_id`,
            [body.phone, body.store_name, pass, body.store_address, body.users_id],
            (err, result) => {
                if(!err) resolve(result)
                else reject(err)
            })
    })
}

exports.loginUser = req => {
    return new Promise((resolve, reject) => {
        conn.query(`SELECT * FROM ${tableName} WHERE email = ?`, [req.body.email],
        (err, result) => {
            if(!err) resolve(result)
            else reject(err)
        })
    })
}

exports.updateUser = req => {
    return new Promise((resolve, reject) => {
        
        conn.query(`UPDATE ${tableName} SET fullname = ?, email = ? WHERE id = ?`, [req.body.fullname, pass, req.body.email, req.params.users_id], (err, result) => {
            if(!err) {
                this.fillDetailUser(req)
                .then(result => {
                    resolve(result)
                })
                .catch(err => {
                    reject(err)
                })
            } else {
                reject(err)
            }
        })
    })
}

exports.getUserList = (req, page) => {
    let sql = `SELECT id, username, role, created_at, updated_at FROM ${tableName}`
    return new Promise((resolve, reject) => {
        getMaxPage(page, null, "tb_users").then(maxPage => {
            const infoPage = {
                currentPage: page.page,
                totalAllUsers: maxPage.totalProduct,
                maxPage: maxPage.maxPage
            }

            conn.query(`${sql} LIMIT ? OFFSET ?`, [page.limit, page.offset], (err, data) => {
                if (!err) resolve({
                    infoPage,
                    data
                })
                else reject(err)
            })
        })
    })
}

exports.getUserById = req => {
    const userId = req.params.user_id || req.body.user_id
    return new Promise((resolve, reject) => {
        conn.query(`SELECT users.id, users.fullname, users.username, users.email, users.created_at, users.updated_at, users_detail.phone_number, users_detail.store_name, users_detail.store_address FROM ${tableName} JOIN users_detail ON users_detail.users_id = users.id WHERE users.id = ?`, [userId],
        (err, result) => {
            if(!err) resolve(result)
            else reject(err)
        })
    })
}

exports.getUserByEmail = req => {
    const email = req.params.email || req.body.emial
    return new Promise((resolve, reject) => {
        conn.query(`SELECT id, username, email, created_at, updated_at FROM ${tableName} WHERE email = ?`, [email],
        (err, result) => {
            if(!err) resolve(result)
            else reject(err)
        })
    })
}

exports.deleteUser = req => {
    return new Promise((resolve, reject) => {
        conn.query(`DELETE FROM ${tableName} WHERE id = ?`, [req.params.user_id], (err, result) => {
            if(!err) resolve(result)
            else reject(err)
        })
    })
}