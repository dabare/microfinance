package main

import (
	"github.com/gorilla/mux"
	"net/http"
)

func initMemberLoanDeposit(router *mux.Router) {
	router.HandleFunc("/api/viewAllMemberLoanDeposits", viewAllMemberLoanDeposits).Methods("POST", "OPTIONS")
	router.HandleFunc("/api/insertMemberLoanDeposit", insertMemberLoanDeposit).Methods("POST", "OPTIONS")
	router.HandleFunc("/api/cancelMemberLoanDeposit", cancelMemberLoanDeposit).Methods("POST", "OPTIONS")
	router.HandleFunc("/api/updateMemberLoanDeposit", updateMemberLoanDeposit).Methods("POST", "OPTIONS")
}

func viewAllMemberLoanDeposits(w http.ResponseWriter, r *http.Request) {
	query(w, r, `SELECT m.*, date_format(m.req_date,'%Y-%m-%d') AS req_date, u.name AS updated_by, mm.member_id AS member_id
						FROM `+userDbReplaceStr+`.member_loan_deposit AS m LEFT JOIN `+userDB+`.user AS u ON m.req_user=u.id 
						LEFT JOIN `+userDbReplaceStr+`.member_loan AS mm ON m.member_loan_id=mm.id
						WHERE m.status <> 0
						ORDER BY m.id DESC`)
}

func insertMemberLoanDeposit(w http.ResponseWriter, r *http.Request) {
	execute(w, r, `INSERT INTO `+userDbReplaceStr+`.member_loan_deposit
			(member_loan_id, amount, req_date, req_user, note) 
			VALUES(:member_loan_id, :amount, :req_date, :req_user, :note)`)
}

func cancelMemberLoanDeposit(w http.ResponseWriter, r *http.Request) {
	execute(w, r, `UPDATE `+userDbReplaceStr+`.member_loan_deposit SET status=4 where id=(:id)`)
}

func updateMemberLoanDeposit(w http.ResponseWriter, r *http.Request) {
	execute(w, r, `UPDATE `+userDbReplaceStr+`.member_loan_deposit 
SET  member_loan_id=:member_loan_id, amount=:amount, req_date=:req_date, req_user=:req_user, note=:note
						where id=(:id)`)
}
