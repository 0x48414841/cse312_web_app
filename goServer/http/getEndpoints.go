package httpServer

import (
	"bytes"
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
	var template []byte
	log.Println("\n\n\n\n", req.Cookies)
	if req.Cookies["id"] == "" {
		template, _ = ioutil.ReadFile("login.html")
	} else {
		template, _ = ioutil.ReadFile("index.html")
	}
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

func JoinLobby(c net.Conn, req *Request) {
	//TODO use ajax later
	lobby := game.GetLobby(req.QueryStrings["lobbyId"][0])
	template, _ := ioutil.ReadFile("index.html")
	template = bytes.Replace(template, []byte("{{response1}}"), []byte(""), 1)

	if lobby == nil {
		template = bytes.Replace(template, []byte("{{response2}}"), []byte("<h1> Error! Lobby does not exists; please make the lobby first</h1>"), 1)
	} else if lobby.GetNumPlayers() >= game.MAX_LOBBY_SIZE {
		template = bytes.Replace(template, []byte("{{response2}}"), []byte("<h1> Error! Lobby is full; please wait or make a new lobby</h1>"), 1)
	} else {

	}
	util.SendResponse(c, []string{values.Headers["200"], values.Headers["content-html"]}, template)
}

func WS_Game(c net.Conn, req *Request) {
	//here are the rules:
	//if lobby doesn't exist then make new lobby and join it
	//if lobby exists, make sure numUsers in lobby < MAX_USERS -->MAX_USERS = 2
	//	if lobby is full, then send reject request
	ok, username := db.IsValidToken(req.Cookies["id"])
	if ok == false {
		return
	}
	lobby := game.GetLobby(req.QueryStrings["lobbyId"][0])
	if lobby == nil {
		return
		//lobby = game.MakeLobby(&c, req.QueryStrings["lobbyId"][0])
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
	lobby.GameInstance.PlayGame(c, key, username)
}

//returns json data of all active users
func ActiveUsers(c net.Conn, req *Request) {
	//return all users in values.UpgradedConn
}

func WS_ActiveUsers(c net.Conn, req *Request) {
	//parse websocket request
	ok, username := db.IsValidToken(req.Cookies["id"])
	if ok == false {
		return
	}
	key := req.Headers["Sec-WebSocket-Key"]
	if key == "" {
		log.Panic("didn't find key")
	}
	ws := websocket.UpgradeConn(c, key, username)
	defer ws.Close(username)

	for {
		frame := <-ws.GetChan()
		if frame == nil {
			return
		}
		//get users
		users := websocket.GetActiveUsers()
		ws.Send(&c, users)
	}
}

func GetProfilePath(c net.Conn, req *Request) {
	//TODO do error checking
	if len(req.QueryStrings["username"]) == 0 {
		log.Panic()
	}
	//not the most optimal solution because we can't cache
	path := db.GetProfilePath(req.QueryStrings["username"][0])
	util.SendResponse(c, []string{values.Headers["200"], values.Headers["content-text"]}, []byte(path))
}
