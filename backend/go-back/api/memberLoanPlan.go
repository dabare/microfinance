package main

import (
	"github.com/gorilla/mux"
	"net/http"
)

func initMemberLoanPlan(router *mux.Router) {
	router.HandleFunc("/api/viewAllMemberLoanPlans", viewAllMemberLoanPlans).Methods("POST", "OPTIONS")
	router.HandleFunc("/api/insertMemberLoanPlan", insertMemberLoanPlan).Methods("POST", "OPTIONS")
	router.HandleFunc("/api/deleteMemberLoanPlan", deleteMemberLoanPlan).Methods("POST", "OPTIONS")
	router.HandleFunc("/api/updateMemberLoanPlan", updateMemberLoanPlan).Methods("POST", "OPTIONS")
}

func viewAllMemberLoanPlans(w http.ResponseWriter, r *http.Request) {
	query(w, r, `SELECT m.*, date_format(m.req_date,'%Y-%m-%d') AS req_date, u.name AS updated_by FROM `+userDbReplaceStr+`.member_loan_plan AS m LEFT JOIN `+userDB+`.user AS u ON m.req_user=u.id WHERE m.status <> 0`)
}

func insertMemberLoanPlan(w http.ResponseWriter, r *http.Request) {
	execute(w, r, `INSERT INTO `+userDbReplaceStr+`.member_loan_plan
			(code, description, duration_months, rate, grace_period_days, late_payment_charge, reject_cheque_penalty, charges, req_date, req_user) 
			VALUES(:code, :description, :duration_months, :rate, :grace_period_days, :late_payment_charge, :reject_cheque_penalty, :charges, :req_user)`)
}

func deleteMemberLoanPlan(w http.ResponseWriter, r *http.Request) {
	execute(w, r, `UPDATE `+userDbReplaceStr+`.member_loan_plan SET status=0 where id=(:id)`)
}

func updateMemberLoanPlan(w http.ResponseWriter, r *http.Request) {
	execute(w, r, `UPDATE `+userDbReplaceStr+`.member_loan_plan 
SET code=:code, description=:description, duration_months=:duration_months, rate=:rate, grace_period_days=:grace_period_days, late_payment_charge=:late_payment_charge, reject_cheque_penalty=:reject_cheque_penalty, charges=:charges, req_user=:req_user
						where id=(:id)`)
}
