package main

import (
	"github.com/gorilla/mux"
	"net/http"
)

func initMemberLoan(router *mux.Router) {
	router.HandleFunc("/api/viewAllMemberLoans", viewAllMemberLoans).Methods("POST", "OPTIONS")
	router.HandleFunc("/api/viewActiveMemberLoans", viewActiveMemberLoans).Methods("POST", "OPTIONS")
	router.HandleFunc("/api/insertMemberLoan", insertMemberLoan).Methods("POST", "OPTIONS")
	router.HandleFunc("/api/deleteMemberLoan", deleteMemberLoan).Methods("POST", "OPTIONS")
	router.HandleFunc("/api/updateMemberLoan", updateMemberLoan).Methods("POST", "OPTIONS")
	router.HandleFunc("/api/viewDepositsOfLoan", viewDepositsOfLoan).Methods("POST", "OPTIONS")
}

func viewAllMemberLoans(w http.ResponseWriter, r *http.Request) {
	query(w, r, `SELECT m.*, date_format(m.req_date,'%Y-%m-%d') AS req_date, u.name AS updated_by 
						FROM `+userDbReplaceStr+`.member_loan AS m LEFT JOIN `+userDB+`.user AS u ON m.req_user=u.id 
						WHERE m.status <> 0
						ORDER BY m.id DESC`)
}

//ongoing
func viewActiveMemberLoans(w http.ResponseWriter, r *http.Request) {
	query(w, r, `SELECT m.*, date_format(m.req_date,'%Y-%m-%d') AS req_date, u.name AS updated_by, mm.name AS name
						FROM `+userDbReplaceStr+`.member_loan AS m LEFT JOIN `+userDB+`.user AS u ON m.req_user=u.id 
						LEFT JOIN `+userDbReplaceStr+`.member as mm ON m.member_id=mm.id
						WHERE m.status = 1`)
}

func insertMemberLoan(w http.ResponseWriter, r *http.Request) {
	execute(w, r, `INSERT INTO `+userDbReplaceStr+`.member_loan
			(member_id, member_loan_plan_id, req_date, rate, amount, charges, duration_months, grace_period_days, late_payment_charge, reject_cheque_penalty, note, status, req_user) 
			VALUES(:member_id, :member_loan_plan_id, :req_date, :rate, :amount, :charges, :duration_months, :grace_period_days, :late_payment_charge, :reject_cheque_penalty, :note, :status, :req_user)`)
}

func deleteMemberLoan(w http.ResponseWriter, r *http.Request) {
	execute(w, r, `UPDATE `+userDbReplaceStr+`.member_loan SET status=0 where id=(:id)`)
}

func updateMemberLoan(w http.ResponseWriter, r *http.Request) {
	execute(w, r, `UPDATE `+userDbReplaceStr+`.member_loan 
SET  member_loan_plan_id=:member_loan_plan_id, req_date=:req_date, rate=:rate, amount=:amount, charges=:charges, duration_months=:duration_months, grace_period_days=:grace_period_days, late_payment_charge=:late_payment_charge, reject_cheque_penalty=:reject_cheque_penalty, note=:note, req_user=:req_user
						where id=(:id)`)
}

func viewDepositsOfLoan(w http.ResponseWriter, r *http.Request) {
	query(w, r, `SELECT m.*, date_format(m.req_date,'%Y-%m-%d') AS req_date
						FROM `+userDbReplaceStr+`.member_loan_deposit AS m 
						WHERE m.member_loan_id=(:id) AND m.status <> 0
						ORDER BY m.req_date ASC`)
}
