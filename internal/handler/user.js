"use-strict"

const model = require("../models/user")
const response = require("../utils/response")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const secretKey = process.env.SECRET_KEY || "270400"
const { pagination } = require("../models/page")

exports.registerUser = (req, res) => {
  if (req.body.email === null || req.body.email === "")
    return response.error(res, "email can't be empty")
  if (!isUsernameValid(req.body.email))
    return response.error(
      res,
      "email cannot contain special character except underscore ( _ ) and minimal 6 digits"
    )
  if (req.body.password === null || req.body.password === "")
    return response.error(res, "password can't be empty")
  if (!isPasswordValid(req.body.password))
    return response.error(
      res,
      "password must have lower case, upper case, number, and minimal 8 digits"
    )
  
  model
    .getUserByEmail(req)
    .then((result) => {
      if (result.length != 0)
        return response.error(
          res,
          "email has been taken, please change your email"
        )
      model
        .registerUser(req)
        .then((result) => {
          req.body.users_id = result.insertId
          model.insertDetailUser(req)
          .then(result => {
            response.success(res, "User created successfully")
          })
          .catch(err => {
            response.error(res, err)
          })
        })
        .catch((err) => {
          response.error(res, err)
        })
    })
    .catch((err) => response.error(res, err))
}

const isPasswordValid = (password) => {
  const tester = /(?=.*\d)(?=.*[a-zA-Z]).{8,}/
  return password.match(tester) == null ? false : true
}

const isUsernameValid = (email) => {
  const tester = /[a-zA-Z]{2,4}$/
  return email.match(tester) == null ? false : true
}

exports.loginUser = (req, res) => {
  if (req.body.email == null || req.body.email === "")
    return response.error(res, "email can't be empty")
  if (!isUsernameValid(req.body.email))
    return response.error(
      res,
      "email cannot contain special character except underscore ( _ ) and minimal 6 digits"
    )
  if (req.body.password == null || req.body.password === "")
    return response.error(res, "Password can't be empty")
  if (!isPasswordValid(req.body.password))
    return response.error(
      res,
      "password must have lower case, upper case, number, and minimal 8 digits"
    )

  model.loginUser(req).then((result) => {
    if (result.length != 0) {
      if (bcrypt.compareSync(req.body.password, result[0].password)) {
        const token = jwt.sign(
          {
            id: result[0].id,
            username: result[0].username,
          },
          secretKey,
          {
            expiresIn: "1w",
          }
        )
        const { id, password, ...userData } = result[0]
        response.success(res, {
          ...userData,
          user_id: id,
          token: token,
        })
      } else {
        response.error(res, "Password incorrect")
      }
    } else {
      response.error(res, "User not found")
    }
  })
}

exports.updateUser = (req, res) => {
  model
    .getUserById(req)
    .then((result) => {
      if (result.length == 0) return response.error(res, "User not found")

      model
        .updateUser(req)
        .then((result) => {
          model.updateDetailUser(req)
          .then(result => {
            response.success(res, "Updated user successfully")
          })
          .catch(err => {
            response.error(res, err)
          })
        })
        .catch((err) => {
          response.error(res, err)
        })
    })
    .catch((err) => response.error(res, err))
}

exports.getUserList = (req, res) => {
  const page = pagination(req)
  model
    .getUserList(req, page)
    .then((result) => response.success(res, result))
    .catch((err) => response.error(res, err))
}

exports.getUserById = (req, res) => {
  model
    .getUserById(req)
    .then((result) => {
      response.success(res, result)
    })
    .catch((err) => response.error(res, err))
}

exports.deleteUser = (req, res) => {
  model
    .deleteUser(req)
    .then((result) => {
      response.success(res, "Deleted user successfully")
    })
    .catch((err) => result.error(res, err))
}
