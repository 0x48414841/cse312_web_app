package websocket

import (
	"encoding/json"
	"log"
	"sync"

	db "cse312.app/database"
)

//a user is logged in if they have at least one active ws connec
var ActiveUsers = make(map[string]int)
var ActiveUsersMutex = &sync.Mutex{}

type ActuveUsersJson struct {
	Action string
	Users  []UserData
}

type UserData struct {
	Username   string
	ProfilePic string
}

func addUser(user string) {
	ActiveUsersMutex.Lock()
	defer ActiveUsersMutex.Unlock()

	ActiveUsers[user]++
}

func removeUser(user string) {
	ActiveUsersMutex.Lock()
	defer ActiveUsersMutex.Unlock()

	ActiveUsers[user]--
	if ActiveUsers[user] <= 0 {
		delete(ActiveUsers, user)
	}
}

//returns all active users
func GetActiveUsers() []byte {
	ActiveUsersMutex.Lock()
	defer ActiveUsersMutex.Unlock()

	res := make([]UserData, 0)
	for user := range ActiveUsers {
		res = append(res, UserData{Username: user, ProfilePic: db.GetProfilePath(user)})
	}

	msg := ActuveUsersJson{
		Action: "displayUsers",
		Users:  res,
	}
	msgByte, err := json.Marshal(msg)
	if err != nil {
		log.Println("error:", err)
	}
	return msgByte
}
