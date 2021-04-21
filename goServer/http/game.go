package httpServer

import (
	"encoding/json"
	"log"
	"math"
	"math/rand"
	"net"
	"strconv"
	"time"

	"cse312.app/websocket"
)

var ID int
var socketList = make(map[int]*net.Conn)
var playerList = make(map[string]*Player)
var bulletList = make(map[string]*Bullet)
var ticker = time.NewTicker(40 * time.Millisecond)

type Frame struct {
	Action  string
	InputId string
	State   bool
	Angle   float64
}

type SendPlayer struct {
	X      float64
	Y      float64
	Number string
}

type SendBullet struct {
	X float64
	Y float64
}

type Positions struct {
	Action string
	PList  []SendPlayer
	BList  []SendBullet
}

type MsgToServer struct {
	Action string
	Data   string
}
type GenericResponse struct {
	Action string
	Data   string
}

func updateAllPlayers() []SendPlayer {
	pack := make([]SendPlayer, 0)
	for _, p := range playerList {
		p.updatePlayer()
		pack = append(pack, SendPlayer{p.e.x, p.e.y, p.number})
	}
	return pack
}

func updateAllBullets() []SendBullet {
	pack := make([]SendBullet, 0)
	for _, b := range bulletList {
		b.updateBullet()
		if b.toRemove == true {
			delete(bulletList, strconv.Itoa(b.id))
		} else {
			pack = append(pack, SendBullet{b.e.x, b.e.y})
		}
	}
	return pack
}

type Entity struct {
	x    float64
	y    float64
	spdX float64
	spdY float64
	id   int
}

func newEntity(x, y float64) *Entity {
	return &Entity{x: x, y: y, spdX: 0, spdY: 0, id: ID}
}

func (e *Entity) updateEntity() {
	e.x += e.spdX
	e.y += e.spdY
}

func (e *Entity) getDistance(p *Entity) float64 {
	return math.Sqrt(math.Pow(e.x-p.x, 2) + math.Pow(e.y-p.y, 2))
}

type Player struct {
	e              *Entity
	id             int
	number         string
	pressingRight  bool
	pressingLeft   bool
	pressingUp     bool
	pressingDown   bool
	pressingAttack bool
	mouseAngle     float64
	maxSpd         float64
	health         int
}

func newPlayer(id int, number string) *Player {
	p := &Player{e: newEntity(250, 250)}
	p.id = id
	p.number = number
	p.pressingRight = false
	p.pressingLeft = false
	p.pressingUp = false
	p.pressingDown = false
	p.pressingAttack = false
	p.mouseAngle = 0
	p.maxSpd = 10
	p.health = 100

	playerList[p.number] = p
	return p
}

func (p *Player) updatePlayer() {
	//update player speed
	if p.pressingRight {
		p.e.spdX = p.maxSpd
	} else if p.pressingLeft {
		p.e.spdX = -p.maxSpd
	} else {
		p.e.spdX = 0
	}

	if p.pressingUp {
		p.e.spdY = -p.maxSpd
	} else if p.pressingDown {
		p.e.spdY = p.maxSpd
	} else {
		p.e.spdY = 0
	}

	//super_update --> entity update
	p.e.updateEntity()

	if p.pressingAttack {
		//shootBullet --> adds to bulletList
		newBullet(p.id, p.e, p.mouseAngle)
		//b.x = p.x -->handled by newBullet
		//b.y = p.y
	}
}

type Bullet struct {
	e        *Entity
	id       int
	parent   int
	timer    int
	toRemove bool
}

func newBullet(parent int, e *Entity, angle float64) *Bullet {
	b := &Bullet{e: newEntity(e.x, e.y)}
	b.id = rand.Intn(1000000)
	b.e.spdX = math.Cos(float64(angle/180*math.Pi)) * 10
	b.e.spdY = math.Sin(float64(angle/180*math.Pi)) * 10
	b.parent = parent
	b.timer = 0
	b.toRemove = false

	bulletList[strconv.Itoa(b.id)] = b
	return b
}

func (b *Bullet) updateBullet() {
	b.timer++
	if b.timer > 100 {
		b.toRemove = true
	}
	b.e.updateEntity() //superUpdate

	for _, p := range playerList {
		if b.e.getDistance(p.e) < 20 && b.parent != p.id {
			p.health -= 1
			b.toRemove = true
		}
	}
}

func WS_Game2(c net.Conn, req *Request) {
	key := req.Headers["Sec-WebSocket-Key"]
	if key == "" {
		log.Panic("didn't find key")
	}
	ws := websocket.UpgradeConn(c, key)
	defer ws.Close()

	rand.Seed(time.Now().UnixNano())
	socketId := rand.Intn(100000000)
	number := strconv.Itoa(rand.Intn(10))
	//handle new connection
	player := newPlayer(socketId, number)
	done := make(chan bool)
	socketList[socketId] = &c

	go func() { //setInterval
		for {
			select {
			case <-done:
				return
			case <-ticker.C: //playerlist is empty
				players := updateAllPlayers()
				bullets := updateAllBullets()
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
				for _, s := range socketList {
					ws.Send(s, msgByte)

				}
			}
		}
	}()
	for {
		frame := <-ws.GetChan()
		if frame == nil {
			//assume client disconnected
			delete(socketList, socketId)
			delete(playerList, player.number)
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
			for _, sock := range socketList {
				ws.Send(sock, msgByte)
			}
		case "evalServer":

		}
		/*
			socketList := make([]*net.Conn, 0)
			playerList := make(map[string]*Player, 0)
			bulletList := make(map[string]*Bullet, 0)
		*/
	}
}
