package main

import (
	"github.com/gorilla/mux"
	"net/http"
)

func initMemberSaving(router *mux.Router) {
	router.HandleFunc("/api/viewAllMemberSavings", viewAllMemberSavings).Methods("POST", "OPTIONS")
	router.HandleFunc("/api/insertMemberSaving", insertMemberSaving).Methods("POST", "OPTIONS")
	router.HandleFunc("/api/cancelMemberSaving", cancelMemberSaving).Methods("POST", "OPTIONS")
	router.HandleFunc("/api/updateMemberSaving", updateMemberSaving).Methods("POST", "OPTIONS")
	router.HandleFunc("/api/insertMemberWithdraw", insertMemberWithdraw).Methods("POST", "OPTIONS")
	router.HandleFunc("/api/cancelMemberWithdraw", cancelMemberWithdraw).Methods("POST", "OPTIONS")
	router.HandleFunc("/api/updateMemberWithdraw", updateMemberWithdraw).Methods("POST", "OPTIONS")
}

func viewAllMemberSavings(w http.ResponseWriter, r *http.Request) {
	query(w, r, `SELECT m.*, date_format(m.req_date,'%Y-%m-%d') AS req_date, u.name AS updated_by
						FROM `+userDbReplaceStr+`.member_saving_ledger AS m LEFT JOIN `+userDB+`.user AS u ON m.req_user=u.id 
						WHERE m.status <> 0
						ORDER BY m.req_date DESC`)
}

func insertMemberSaving(w http.ResponseWriter, r *http.Request) {
	execute(w, r, `INSERT INTO `+userDbReplaceStr+`.member_saving
			(member_id, amount, req_date, req_user, note) 
			VALUES(:member_id, :amount, :req_date, :req_user, :note)`)
}

func cancelMemberSaving(w http.ResponseWriter, r *http.Request) {
	execute(w, r, `UPDATE `+userDbReplaceStr+`.member_saving SET status=4 where id=(:id)`)
}

func updateMemberSaving(w http.ResponseWriter, r *http.Request) {
	execute(w, r, `UPDATE `+userDbReplaceStr+`.member_saving 
SET  amount=:amount, req_date=:req_date, req_user=:req_user, note=:note
						where id=(:id)`)
}

func insertMemberWithdraw(w http.ResponseWriter, r *http.Request) {
	execute(w, r, `INSERT INTO `+userDbReplaceStr+`.member_withdraw
			(member_id, amount, req_date, req_user, note) 
			VALUES(:member_id, :amount, :req_date, :req_user, :note)`)
}

func cancelMemberWithdraw(w http.ResponseWriter, r *http.Request) {
	execute(w, r, `UPDATE `+userDbReplaceStr+`.member_withdraw SET status=4 where id=(:id)`)
}

func updateMemberWithdraw(w http.ResponseWriter, r *http.Request) {
	execute(w, r, `UPDATE `+userDbReplaceStr+`.member_withdraw 
SET  amount=:amount, req_date=:req_date, req_user=:req_user, note=:note
						where id=(:id)`)
}
