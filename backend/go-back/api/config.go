package main

const defaultDB = "finance"
const userDB = "user"
const userDbReplaceStr = "@--DB-NAME--@"
const driverName = "mysql"
const dataSourceName = "root:1234@tcp(localhost:3306)/"
//const dataSourceName = "k123456789123456:qwertyui@tcp(devmysql.cbq5miudf693.us-east-2.rds.amazonaws.com)/"
const maxOpenCon = 10
const maxIdleCon = 10
const port = ":3000"
const jwtTokenValidMunites = 60
