package main

import (
	"github.com/gorilla/mux"
	"net/http"
)

func initMember(router *mux.Router) {
	router.HandleFunc("/api/viewAllMembers", viewAllMembers).Methods("POST", "OPTIONS")
	router.HandleFunc("/api/insertMember", insertMember).Methods("POST", "OPTIONS")
	router.HandleFunc("/api/deleteMember", deleteMember).Methods("POST", "OPTIONS")
	router.HandleFunc("/api/updateMember", updateMember).Methods("POST", "OPTIONS")
}

func viewAllMembers(w http.ResponseWriter, r *http.Request) {
	query(w, r, `SELECT *, date_format(dob,'%m-%d-%Y') AS dob, date_format(req_date,'%m-%d-%Y') AS req_date FROM `+userDbReplaceStr+`.member WHERE status = 1`)
}

func insertMember(w http.ResponseWriter, r *http.Request) {
	execute(w, r, `INSERT INTO `+userDbReplaceStr+`.member(code, name, nic, dob, tel, address, email, representative, bondsman, bondsman_nic, req_user) 
						VALUES(:code, :name, :nic, :dob, :tel, :address, :email, :representative, :bondsman, :bondsman_nic, :req_user)`)
}

func deleteMember(w http.ResponseWriter, r *http.Request) {
	execute(w, r, `UPDATE `+userDbReplaceStr+`.member SET status=0 where id=(:id)`)
}

func updateMember(w http.ResponseWriter, r *http.Request) {
	execute(w, r, `UPDATE `+userDbReplaceStr+`.member 
						SET code=:code, name=:name, nic=:nic, dob=:dob, tel=:tel, address=:address, email=:email, representative=:representative, bondsman=:bondsman, bondsman_nic=:bondsman_nic, req_user=:req_user 
						where id=(:id)`)
}
