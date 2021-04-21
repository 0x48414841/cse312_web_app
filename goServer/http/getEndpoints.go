package httpServer

import (
	"io/ioutil"
	"log"
	"net"

	db "cse312.app/database"
	"cse312.app/game"
	util "cse312.app/utility"
	"cse312.app/values"
	websocket "cse312.app/websocket"
)

func Home(c net.Conn, req *Request) {
	template, _ := ioutil.ReadFile("home.html")
	util.SendResponse(c, []string{values.Headers["200"], values.Headers["content-html"]}, template)
	return //temporary
	result, _ := db.IsValidToken(req.Cookies["id"])
	switch result {
	case true:
		util.SendResponse(c, []string{values.Headers["301"], values.Headers["redirect-home"], values.Headers["content-text"]}, nil)
	case false:
		util.SendResponse(c, []string{values.Headers["301"], values.Headers["redirect-index"], values.Headers["content-text"]}, nil)
	}
}

func Landing(c net.Conn, req *Request) {
	template, _ := ioutil.ReadFile("landing.html")
	util.SendResponse(c, []string{values.Headers["200"], values.Headers["content-html"]}, template)
}

func Game(c net.Conn, req *Request) {
	template, _ := ioutil.ReadFile("game.html")
	util.SendResponse(c, []string{values.Headers["200"], values.Headers["content-html"]}, template)
}

func WS_Game(c net.Conn, req *Request) {
	//here are the rules:
	//if lobby doesn't exist then make new lobby and join it
	//if lobby exists, make sure numUsers in lobby < MAX_USERS -->MAX_USERS = 2
	//	if lobby is full, then send reject request
	lobby := game.GetLobby(req.QueryStrings["lobbyId"][0])
	if lobby == nil {
		lobby = game.MakeLobby(&c, req.QueryStrings["lobbyId"][0])
	}
	err := lobby.AddPlayer(&c)
	if err != nil {
		//lobby is full
		return
	}

	key := req.Headers["Sec-WebSocket-Key"]
	if key == "" {
		log.Panic("didn't find key")
	}
	lobby.GameInstance.PlayGame(c, key)
}

//returns json data of all active users
func ActiveUsers(c net.Conn, req *Request) {
	//return all users in values.UpgradedConn
}

func WS_ActiveUsers(c net.Conn, req *Request) {
	//parse websocket request
	key := req.Headers["Sec-WebSocket-Key"]
	if key == "" {
		log.Panic("didn't find key")
	}
	ws := websocket.UpgradeConn(c, key)
	defer ws.Close()
	for {
		frame := <-ws.GetChan()
		if frame == nil {
			return
		}
	}
}
