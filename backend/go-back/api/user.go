package main

import (
	"github.com/gorilla/mux"
	"net/http"
)

func initUser(router *mux.Router)  {
	router.HandleFunc("/api/updateUserDetails", updateUserDetails).Methods("POST","OPTIONS")
	router.HandleFunc("/api/updateUserPassword", updateUserPassword).Methods("POST","OPTIONS")
}

func updateUserDetails(w http.ResponseWriter, r *http.Request) {
	execute(w,r,`UPDATE `+userDB+`.user SET name=(:name), email=(:email), contactNo=(:contactNo) where id=(:id)`)
}

func updateUserPassword(w http.ResponseWriter, r *http.Request) {
	execute(w,r,`UPDATE `+userDB+`.user SET pass=(:pass) where id=(:id)`)
}

