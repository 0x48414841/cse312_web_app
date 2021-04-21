package db

import (
	"context"
	"encoding/json"
	"log"
	"sync"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

//db variables
var Ctx context.Context
var Cancel context.CancelFunc
var Client *mongo.Client

var startOnce sync.Once
var endOnce sync.Once

func StartDB(host string) error {
	startOnce.Do(func() {
		//usage shown from https://github.com/mongodb/mongo-go-driver
		Ctx, Cancel = context.WithTimeout(context.Background(), 10*time.Second)
		defer Cancel()
		Client, err := mongo.Connect(Ctx, options.Client().ApplyURI("mongodb://"+host+":27017"))
		if err != nil {
			log.Panic(err)
		}
		log.Println("connected to DB")
		//create db for users
		if err := Client.Database("db").CreateCollection(Ctx, "users", nil); err != nil {
			log.Println(err)
		}
		//create db for tokens
		if err := Client.Database("db").CreateCollection(Ctx, "tokens", nil); err != nil {
			log.Println(err)
		}
	})

	return nil
}

//return (true, <username>) if token is valid
//returns (false, <"">) if token is not valid
func IsValidToken(token string) (bool, string) {
	return false, ""
}

//returns json representation of user data if user is in database
//returns nil if user wasn't found
func GetUserInfo(username string) []byte {
	var user bson.M
	users := Client.Database("db").Collection("users")
	if err := users.FindOne(context.Background(), bson.M{"username": username}).Decode(&user); err == nil {
		userJSON, _ := json.Marshal(user) //TODO test this
		return userJSON
	}
	return nil
}

//returns true if username is valid AND salted+hashed password == salt+hashed password in db
//returns (true, <token> if credentials are valid)
//returns (false, <"">) if credentials are invalid
func VerifyCredentials(username, password string) (bool, string) {
	return false, ""
}

func closeDB() error {
	endOnce.Do(func() {
		if err := Client.Disconnect(Ctx); err != nil {
			panic(err)
		}
	})
	return nil
}
