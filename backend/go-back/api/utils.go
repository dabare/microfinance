package main

import (
	"encoding/json"
	"errors"
	"io/ioutil"
	"log"
	"net/http"
	"regexp"
)

func reqBody2JsonObj(r *http.Request) (map[string]interface{}, error){
	log.Println("reqBody2JsonObj")

	jsonObj := make(map[string]interface{})

	jsonStr, err := ioutil.ReadAll(r.Body)
	if err != nil {
		log.Println(err)
		return jsonObj, err
	}

	log.Println("request :"+string(jsonStr))


	err = json.Unmarshal([]byte(jsonStr), &jsonObj)
	if err != nil {
		log.Println(err)
		return jsonObj, err
	}
	return  jsonObj, nil
}

type requestStruct struct {
	Table   string ""
	Columns string ""
	Values  string ""
	Set     string ""
	Where   string ""
	Group   string ""
	Order   string ""
}

func decodeHTTPBody(r *http.Request) (requestStruct, error) {
	decoder := json.NewDecoder(r.Body)
	var req requestStruct
	err := decoder.Decode(&req)
	if err != nil {
		log.Println(err)
		return req, errors.New("INVALID JSON REQUEST")
	}
	if (checkSQLinjection(req.Values + req.Columns + req.Set + req.Order + req.Group + req.Where + req.Table)) {
		log.Println("SQL INJECTION DETECTED")
		return req, errors.New("SQL INJECTION DETECTED")
	}

	//req.Values = strings.Replace(req.Values, "[", "(", -1)
	//req.Values = strings.Replace(req.Values, "]", ")", -1)

	return req, nil
}

func checkSQLinjection(str string) bool {
	//match, _ := regexp.MatchString(`[;"\0\n\r\t\(\)]`, str)
	match, _ := regexp.MatchString(`[;"\0\n\r\t]`, str)
	return match
}
