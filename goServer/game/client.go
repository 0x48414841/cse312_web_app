package game

import (
	"encoding/json"
	"log"
	"math/rand"
	"net"
	"strconv"
	"time"

	"cse312.app/websocket"
)

type Game struct {
	socketList map[int]*net.Conn
	playerList map[string]*Player
	bulletList map[string]*Bullet
	ticker     *time.Ticker
	r          *rand.Rand
	id         int
}

func NewGame() *Game {
	g := &Game{}
	g.ticker = time.NewTicker(40 * time.Millisecond)
	g.socketList = make(map[int]*net.Conn)
	g.playerList = make(map[string]*Player)
	g.bulletList = make(map[string]*Bullet)
	g.r = rand.New(rand.NewSource(time.Now().UnixNano()))
	return g
}

func (g *Game) PlayGame(c net.Conn, key string) {
	ws := websocket.UpgradeConn(c, key)
	defer ws.Close()

	rand.Seed(time.Now().UnixNano())
	socketId := rand.Intn(100000000)
	number := strconv.Itoa(rand.Intn(10))

	//handle new connection
	player := g.newPlayer(socketId, number)
	done := make(chan bool)
	g.socketList[socketId] = &c

	go func() { //setInterval
		for {
			select {
			case <-done:
				return
			case <-g.ticker.C: //playerlist is empty
				players := g.updateAllPlayers()
				bullets := g.updateAllBullets()
				msg := Positions{
					Action: "newPositions",
					PList:  players,
					BList:  bullets,
				}
				msgByte, err := json.Marshal(msg)
				if err != nil {
					log.Println("error:", err)
				}
				//log.Println(string(msgByte), players[0])
				for _, s := range g.socketList {
					ws.Send(s, msgByte)

				}
			}
		}
	}()
	for {
		frame := <-ws.GetChan()
		if frame == nil {
			//assume client disconnected
			delete(g.socketList, socketId)
			delete(g.playerList, player.number)
			done <- true
			return
		}

		var parsedFrame Frame
		err := json.Unmarshal(frame.Payload, &parsedFrame)
		_ = err
		switch parsedFrame.Action {
		case "keyPress":
			if parsedFrame.InputId == "left" {
				player.pressingLeft = parsedFrame.State
			} else if parsedFrame.InputId == "right" {
				player.pressingRight = parsedFrame.State
			} else if parsedFrame.InputId == "up" {
				player.pressingUp = parsedFrame.State
			} else if parsedFrame.InputId == "down" {
				player.pressingDown = parsedFrame.State
			} else if parsedFrame.InputId == "attack" {
				player.mouseAngle = parsedFrame.Angle
				player.pressingAttack = parsedFrame.State
			} else if parsedFrame.InputId == "mouseAngle" {
				//player.mouseAngle = parsedFrame.Angle
			}
		case "sendMsgToServer":
			playerName := strconv.Itoa(socketId)
			msg := GenericResponse{
				Action: "addToChat",
				Data:   playerName + ": " + parsedFrame.InputId,
			}
			msgByte, err := json.Marshal(msg)
			if err != nil {
				log.Println("error:", err)
			}
			for _, sock := range g.socketList {
				ws.Send(sock, msgByte)
			}
		case "evalServer":

		}
	}
}
