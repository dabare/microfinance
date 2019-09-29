package main

import (
	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/mux"
	"log"
	"net/http"
)

func main() {
	initDB()
	var router = mux.NewRouter()

	initLogin(router)
	initUser(router)
	initMember(router)

	log.Println("Running server on port" + port)
	log.Fatal(http.ListenAndServe(port, router))
}
