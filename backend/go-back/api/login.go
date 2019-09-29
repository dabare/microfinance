package main

import (
	"encoding/json"
	"fmt"
	"github.com/dgrijalva/jwt-go"
	"github.com/gorilla/mux"
	"log"
	"net/http"
	"time"
)

func initLogin(router *mux.Router)  {
	router.HandleFunc("/api/login", login).Methods("POST","OPTIONS")
}

// Create a struct to read the username and password from the request body
type Credentials struct {
	Password string `json:"password"`
	Username string `json:"username"`
}

// Create a struct that will be encoded to a JWT.
// We add jwt.StandardClaims as an embedded type, to provide fields like expiry time
type Claims struct {
	User User 	`json:"user"`
	jwt.StandardClaims
}


func login(w http.ResponseWriter, r *http.Request) {
	fixCorsProblems(w)
	if r.Method == "OPTIONS" {
		Respond(w, "OK")
		return
	}
	var creds Credentials
	// Get the JSON body and decode into credentials
	err := json.NewDecoder(r.Body).Decode(&creds)
	if err != nil {
		// If the structure of the body is wrong, return an HTTP error
		log.Println(err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	//
	//// Get the expected password from our in memory map
	//expectedPassword, ok := users[creds.Username]

	user, res, err := checkUser(creds.Username, creds.Password)

	// If a password exists for the given user
	// AND, if it is the same as the password we received, the we can move ahead
	// if NOT, then we return an "Unauthorized" status
	//if !ok || expectedPassword != creds.Password {
	//	w.WriteHeader(http.StatusUnauthorized)
	//	return
	//}

	if err != nil{
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	// Declare the expiration time of the token
	// here, we have kept it as 5 minutes
	expirationTime := time.Now().Add(jwtTokenValidMunites * time.Minute)
	// Create the JWT claims, which includes the username and expiry time
	claims := &Claims{
		User: user,
		StandardClaims: jwt.StandardClaims{
			// In JWT, the expiry time is expressed as unix milliseconds
			ExpiresAt: expirationTime.Unix(),
		},
	}

	// Declare the token with the algorithm used for signing, and the claims
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	// Create the JWT string
	tokenString, err := token.SignedString(jwtKey)
	if err != nil {
		log.Println(err)
		// If there is an error in creating the JWT return an internal server error
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	Respond(w,fmt.Sprintf(`{"token":"%s","expirationTime":"%d","user":%s}`,  tokenString, expirationTime.Unix(), res))
}
