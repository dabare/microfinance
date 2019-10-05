package main

import (
	"github.com/gorilla/mux"
	"net/http"
)

func initMemberSavingRate(router *mux.Router) {
	router.HandleFunc("/api/viewAllMemberSavingRates", viewAllMemberSavingRates).Methods("POST", "OPTIONS")
	router.HandleFunc("/api/insertMemberSavingRate", insertMemberSavingRate).Methods("POST", "OPTIONS")
	router.HandleFunc("/api/cancelMemberSavingRate", cancelMemberSavingRate).Methods("POST", "OPTIONS")
	router.HandleFunc("/api/updateMemberSavingRate", updateMemberSavingRate).Methods("POST", "OPTIONS")
}

func viewAllMemberSavingRates(w http.ResponseWriter, r *http.Request) {
	query(w, r, `SELECT m.*, date_format(m.req_date,'%Y-%m-%d') AS req_date, u.name AS updated_by
						FROM `+userDbReplaceStr+`.member_saving_rate AS m LEFT JOIN `+userDB+`.user AS u ON m.req_user=u.id 
						WHERE m.status <> 0
						ORDER BY m.req_date DESC`)
}

func insertMemberSavingRate(w http.ResponseWriter, r *http.Request) {
	execute(w, r, `INSERT INTO `+userDbReplaceStr+`.member_saving_rate
			(description, rate, req_date, req_user) 
			VALUES(:description, :rate, :req_date, :req_user)`)
}

func cancelMemberSavingRate(w http.ResponseWriter, r *http.Request) {
	execute(w, r, `UPDATE `+userDbReplaceStr+`.member_saving_rate SET status=4 where id=(:id)`)
}

func updateMemberSavingRate(w http.ResponseWriter, r *http.Request) {
	execute(w, r, `UPDATE `+userDbReplaceStr+`.member_saving_rate 
SET  description=:description, rate=:rate, req_date=:req_date, req_user=:req_user
						where id=(:id)`)
}
