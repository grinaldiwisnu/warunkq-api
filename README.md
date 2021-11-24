# WarunkQ RESTful API
## Documentation
  - [Introduction](#introduction)
    - [Tech Stack](#tech-stack)
  - [Getting Started](#getting-started)
    - [Requirements](#requirements)
    - [Installation](#installation)
  - [Setup .env file](#setup-environment)
  - [Setup Database](#setup-database)
  - [Endpoints](#api-docs)
  - [QNA](#qna)

## Introduction

Point of Sales API is an API that helps users to run their trading business. There're some features included in the API. User can handle management stock of product and store the order transaction

### Tech Stack

[![Node.js](https://img.shields.io/badge/Node.js-v.10.16.2-green.svg?style=flat-square&logo=javascript)](https://nodejs.org/) [![Express.js](https://img.shields.io/badge/Express.js-4.x-orange.svg?style=flat-square&logo=express)](https://expressjs.com/en/starter/installing.html) [![MySQL](https://img.shields.io/badge/mysql-v2.17.1-blue?style=flat-square&logo=mysql)](https://www.npmjs.com/package/mysql) [![docker](https://img.shields.io/badge/docker-v4.1.0-blue?style=flat-square&logo=docker)](https://docker.com)

## Getting Started

### Requirements

1. <a href="https://nodejs.org/en/download/">Node Js</a>
2. <a href="https://docker.com/">Docker</a>
3. <a href="https://www.npmjs.com/">NPM</a> / <a href="https://www.yarn.com/">Yarn</a>
4. <a href="https://www.getpostman.com/">Postman</a>

### Installation

1. Clone or download this repository
2. Open app's directory in CMD or Terminal.
3. Type in Terminal `yarn install` or `npm install` to install the required packages from `package.json`.
4. Make a new file, **.env** and setup the file.
5. Make sure you run docker in system, then type in Terminal `docker-compose up`
6. Setup the database. [instruction here](#setup-database)
7. Open **Postman** desktop application or Chrome web extension (Install **Postman** if you haven't yet)
8. Import the collection [here](#api-docs)

## Setup Environment

Duplicate **.env.example** file to **.env** on code editor and change the variable or copy the code below :

```
DB_HOST = 'localhost'
DB_USER = 'username'
DB_PASSWORD = 'password'
DB_DATABASE = 'database'
PORT = 5000
SECRET_KEY = 'JFDFHSKFJHSKFHSDFKSDFJKSDF'
```

## Setup Database

You can import file **`db.sql`** to **mysql** using database connection on your IDE.

## API Docs
You can check and import my published collection about this API [here](https://documenter.getpostman.com/view/3935201/UVJYLzKP)

### QNA
For further consideration, you can contact me at `grinaldifoc@gmail.com`
