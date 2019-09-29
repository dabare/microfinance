package main

import (
	"errors"
	"fmt"
	_ "github.com/go-sql-driver/mysql"
	"github.com/jmoiron/sqlx"
	"log"
	"net/http"
	"reflect"
	"strconv"
	"strings"
)

var db *sqlx.DB
var dbErr error

func createConnection() {
	db, dbErr = sqlx.Connect(driverName, dataSourceName)
	if dbErr != nil {
		log.Fatal(dbErr)
	} else {
		log.Println("Connection established")
	}
	db.SetMaxOpenConns(maxOpenCon)
	db.SetMaxIdleConns(maxIdleCon)
}

func initDB() {
	if db != nil {
		dbErr = db.Ping()
		if dbErr != nil {
			createConnection()
		}
	} else {
		createConnection()
	}
}

func selectQuery(database, table, where, group, order string) (string, error) {
	log.Println("selectQuery")
	initDB()

	if group != "" {
		group = " GROUP BY " + group
	}

	if order != "" {
		order = " ORDER BY " + order
	}

	if where != "" {
		where = " WHERE " + where
	}

	qry := "select * from " + database + "." + table + " " + where + " " + group + " " + order
	log.Println(qry)
	rows, err := db.Queryx(qry)
	if err != nil {
		log.Println(err)
		return "", err
	}
	defer rows.Close()
	return MyJsonify(rows)
}

func insert(database, table, columns, values string) (string, error) {
	initDB()
	qry := "INSERT INTO " + database + "." + table + "( " + columns + " ) VALUES " + values
	log.Println(qry)
	res, err := db.Exec(qry)
	if err != nil {
		log.Println(err)
		return "", err
	}
	rowsAffected, err := res.RowsAffected()
	if err != nil {
		log.Println(err)
		return "", err
	}
	return `{"rowsAffected":` + strconv.Itoa(int(rowsAffected)) + `}`, nil
}

func updatee(database, table, set, where string) (string, error) {
	initDB()
	if where != "" {
		where = " WHERE " + where
	}
	qry := "UPDATE " + database + "." + table + " SET " + set + where
	log.Println(qry)
	res, err := db.Exec(qry)
	if err != nil {
		log.Println(err)
		return "", err
	}
	rowsAffected, err := res.RowsAffected()
	if err != nil {
		log.Println(err)
		return "", err
	}
	return `{"rowsAffected":` + strconv.Itoa(int(rowsAffected)) + `}`, nil
}

func delete(database, table, where string) (string, error) {
	initDB()
	if where != "" {
		where = " WHERE " + where
	}
	qry := "DELETE FROM " + database + "." + table + where
	log.Println(qry)
	res, err := db.Exec(qry)
	if err != nil {
		log.Println(err)
		return "", err
	}

	rowsAffected, err := res.RowsAffected()
	if err != nil {
		log.Println(err)
		return "", err
	}
	return `{"rowsAffected":` + strconv.Itoa(int(rowsAffected)) + `}`, nil
}

//manage cors
func fixCorsProblems(w http.ResponseWriter) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Origin, Content-Length, Accept-Encoding, X-CSRF-Token, Token")
}

func Respond(w http.ResponseWriter, data string) {
	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte(data))
}

func selection(w http.ResponseWriter, r *http.Request) {
	fixCorsProblems(w)
	if r.Method == "OPTIONS" {
		Respond(w, "OK")
		return
	}

	selectReq, err := decodeHTTPBody(r)
	if err != nil {
		http.Error(w, `{ "error":"`+strings.ToUpper(err.Error())+`"}`, http.StatusInternalServerError)
		return
	}

	res, err := selectQuery(defaultDB, selectReq.Table, selectReq.Where, selectReq.Group, selectReq.Order)

	if err != nil {
		http.Error(w, `{ "error":"`+strings.ToUpper(err.Error())+`"}`, http.StatusInternalServerError)
	} else {
		Respond(w, res)
	}
}

func insertion(w http.ResponseWriter, r *http.Request) {
	fixCorsProblems(w)
	if r.Method == "OPTIONS" {
		Respond(w, "OK")
		return
	}
	selectReq, err := decodeHTTPBody(r)
	if err != nil {
		http.Error(w, `{ "error":"`+strings.ToUpper(err.Error())+`"}`, http.StatusInternalServerError)
		return
	}

	res, err := insert(defaultDB, selectReq.Table, selectReq.Columns, selectReq.Values)

	if err != nil {
		http.Error(w, `{ "error":"`+strings.ToUpper(err.Error())+`"}`, http.StatusInternalServerError)
	} else {
		Respond(w, res)
	}
}

func update(w http.ResponseWriter, r *http.Request) {
	fixCorsProblems(w)
	if r.Method == "OPTIONS" {
		Respond(w, "OK")
		return
	}

	selectReq, err := decodeHTTPBody(r)
	if err != nil {
		http.Error(w, `{ "error":"`+strings.ToUpper(err.Error())+`"}`, http.StatusInternalServerError)
		return
	}
	res, err := updatee(defaultDB, selectReq.Table, selectReq.Set, selectReq.Where)

	if err != nil {
		http.Error(w, `{ "error":"`+strings.ToUpper(err.Error())+`"}`, http.StatusInternalServerError)
	} else {
		Respond(w, res)
	}
}

func deletion(w http.ResponseWriter, r *http.Request) {
	fixCorsProblems(w)
	if r.Method == "OPTIONS" {
		Respond(w, "OK")
		return
	}

	selectReq, err := decodeHTTPBody(r)
	if err != nil {
		http.Error(w, `{ "error":"`+strings.ToUpper(err.Error())+`"}`, http.StatusInternalServerError)
		return
	}
	res, err := delete(defaultDB, selectReq.Table, selectReq.Where)
	if err != nil {
		http.Error(w, `{ "error":"`+strings.ToUpper(err.Error())+`"}`, http.StatusInternalServerError)
	} else {
		Respond(w, res)
	}
}

type User struct {
	Id       string `db:"id"`
	Username string `db:"uname"`
	Password string `db:"pass"`
	Schema   string `db:"db"`
}

func checkUser(username string, password string) (User, string, error) {
	log.Println("checkUser")
	log.Println("username:" + username + " password:" + password)
	// You can also get a single result, a la QueryRow
	user := User{}
	err := db.Get(&user, "SELECT id, uname, pass, db FROM "+userDB+".user WHERE uname=? AND pass=?", username, password)

	if err != nil {
		log.Println(err)
		return user, "", err
	}

	if username != user.Username || password != user.Password {
		log.Println("INVALID CREDENTIALS")
		return user, "", errors.New("INVALID CREDENTIALS")
	}

	res, resErr := selectQuery(userDB, "user", "id = '"+user.Id+"'", "", "")
	return user, res, resErr
}

func query(w http.ResponseWriter, r *http.Request, query string) {
	log.Println("query")
	fixCorsProblems(w)
	if r.Method == "OPTIONS" {
		Respond(w, "OK")
		return
	}

	user, status := checkJWT(w, r)

	query = strings.Replace(query, userDbReplaceStr, user.Schema, -1)

	if status != http.StatusOK {
		log.Println("AUTHENTICATION FAILED")
		http.Error(w, `{ "error":"AUTHENTICATION FAILED"}`, http.StatusUnauthorized)
		return
	}

	jsonObj, err := reqBody2JsonObj(r)
	if err != nil {
		log.Println(err)
		http.Error(w, `{ "error":"`+strings.ToUpper(err.Error())+`"}`, http.StatusInternalServerError)
		return
	}

	rows, err := db.NamedQuery(query, jsonObj)

	if err != nil {
		log.Println(err)
		http.Error(w, `{ "error":"`+strings.ToUpper(err.Error())+`"}`, http.StatusInternalServerError)
		return
	}
	defer rows.Close()
	json, err := MyJsonify(rows)
	if err != nil {
		log.Println(err)
		http.Error(w, `{ "error":"`+strings.ToUpper(err.Error())+`"}`, http.StatusInternalServerError)
		return
	}
	Respond(w, json)
}

func execute(w http.ResponseWriter, r *http.Request, query string) {
	log.Println("execute")
	fixCorsProblems(w)
	if r.Method == "OPTIONS" {
		Respond(w, "OK")
		return
	}

	user, status := checkJWT(w, r)

	query = strings.Replace(query, userDbReplaceStr, user.Schema, -1)

	if status != http.StatusOK {
		log.Println("AUTHENTICATION ERROR")
		http.Error(w, `{ "error":"AUTHENTICATION ERROR"}`, http.StatusUnauthorized)
		return
	}

	jsonObj, err := reqBody2JsonObj(r)
	if err != nil {
		log.Println(err)
		http.Error(w, `{ "error":"`+strings.ToUpper(err.Error())+`"}`, http.StatusInternalServerError)
		return
	}

	log.Println("Query: " + query)

	res, err := db.NamedExec(query, jsonObj)
	if err != nil {
		log.Println(err)
		http.Error(w, `{ "error":"`+strings.ToUpper(err.Error())+`"}`, http.StatusInternalServerError)
		return
	}

	rowsAffected, err := res.RowsAffected()
	if err != nil {
		log.Println(err)
		http.Error(w, `{ "error":"`+strings.ToUpper(err.Error())+`"}`, http.StatusInternalServerError)
		return
	}
	Respond(w, `{"rowsAffected":`+strconv.Itoa(int(rowsAffected))+`}`)
}

func MyJsonify(rows *sqlx.Rows) (string, error) {
	log.Println("MyJsonify")
	data := "["
	c := 0
	for rows.Next() {
		row := make(map[string]interface{})
		err := rows.MapScan(row)
		if err != nil {
			log.Println("DB ROW SCAN ERROR")
			return "", errors.New("DB ROW SCAN ERROR")
		}
		if c > 0 {
			data += ","
		}
		i := 0
		data += "{"
		for key, value := range row {
			if i > 0 {
				data += ","
			}
			data += fmt.Sprintf(`"%s":`, key)
			d := `""`
			if value != nil {
				if reflect.TypeOf(value).String() == "[]uint8" {
					d = fmt.Sprintf(`"%s"`, value)
				} else if reflect.TypeOf(value).String() == "float64" {
					d = fmt.Sprintf(`"%g"`, value)
				} else if reflect.TypeOf(value).String() == "int64" {
					d = fmt.Sprintf(`"%d"`, value)
				} else {
					log.Println("Unhandled type: "+reflect.TypeOf(value).String(), ",fix this by adding new type")
				}
			}
			data += d
			i++
		}
		data += "}"
		c++
	}
	return data + "]", nil
}
