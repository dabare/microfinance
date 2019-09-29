package main

import (
	"github.com/dgrijalva/jwt-go"
	"log"
	"net/http"
	"time"
)

// Create the JWT key used to create the signature
var jwtKey = []byte("god b13ss y0u a11 ")

func checkJWT(w http.ResponseWriter, r *http.Request) (User, int) {
	log.Println("checkJWT")

	// Initialize a new instance of `Claims`
	claims := &Claims{}


	// Get the JWT string from the cookie
	tknStr :=r.Header.Get("Token")

	// Parse the JWT string and store the result in `claims`.
	// Note that we are passing the key in this method as well. This method will return an error
	// if the token is invalid (if it has expired according to the expiry time we set on sign in),
	// or if the signature does not match
	tkn, err := jwt.ParseWithClaims(tknStr, claims, func(token *jwt.Token) (interface{}, error) {
		return jwtKey, nil
	})
	if err != nil {
		log.Println(err)
		if err == jwt.ErrSignatureInvalid {
			return claims.User, http.StatusUnauthorized
		}
		return claims.User, http.StatusBadRequest
	}
	if !tkn.Valid {
		log.Println("Token Invalid")
		return claims.User, http.StatusUnauthorized
	}

	log.Println("User id:" + claims.User.Id + " uname:" + claims.User.Username)
	//refreshJWT(claims, w)

	return claims.User, http.StatusOK
}

func refreshJWT(claims *Claims, w http.ResponseWriter){
	log.Println("refreshJWT")



	// We ensure that a new token is not issued until enough time has elapsed
	// In this case, a new token will only be issued if the old token is within
	// 30 seconds of expiry. Otherwise, return a bad request status
	if time.Unix(claims.ExpiresAt, 0).Sub(time.Now()) > 30*time.Second {
		log.Println("No Need To Refresh JWT")
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	// Now, create a new token for the current use, with a renewed expiration time
	expirationTime := time.Now().Add(jwtTokenValidMunites * time.Minute)
	claims.ExpiresAt = expirationTime.Unix()
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(jwtKey)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	// Set the new token as the users `token` cookie
	http.SetCookie(w, &http.Cookie{
		Name:    "token",
		Value:   tokenString,
		Expires: expirationTime,
	})
	log.Println("JWT Refreshed")
}
