package httpServer

import (
	"fmt"
	"net"

	db "cse312.app/database"
	util "cse312.app/utility"
	"cse312.app/values"
)

func Login(c net.Conn, req *Request) {
	result, token := db.VerifyCredentials(string(req.PostData["username"]), string(req.PostData["password"]))
	switch result {
	case true:
		util.SendResponse(c, []string{values.Headers["301"], values.Headers["redirect-home"], values.Headers["content-text"],
			fmt.Sprintf("Set-Cookie: id=%s; HttpOnly\r\n", token)}, nil)
	case false:
		util.SendResponse(c, []string{values.Headers["301"], values.Headers["redirect-index"], values.Headers["content-text"]}, nil)
	}
}

func Register(c net.Conn, req *Request) {
	//username, password := req.PostData["uname"], req.PostData["password"]

	//TODO insert into database via db.RegisterUser and return a token

	//TEMP: give token to user
	token := util.GenerateToken()
	util.SendResponse(c, []string{values.Headers["301"], values.Headers["redirect-index"], values.Headers["content-text"],
		fmt.Sprintf("Set-Cookie: id=%s\r\n", token)}, nil)
}
