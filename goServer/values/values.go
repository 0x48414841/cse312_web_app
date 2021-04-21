package values

import (
	"net"
	"sync"
)

var Headers = map[string]string{
	"101":              "HTTP/1.1 101 Switching Protocols\r\n",
	"200":              "HTTP/1.1 200 OK\r\n",
	"301":              "HTTP/1.1 301 Moved Permanently\r\n",
	"404":              "HTTP/1.1 404 Not Found\r\n",
	"403":              "HTTP/1.1 403 Forbidden\r\n",
	"500":              "HTTP/1.1 500 Bad Request\r\n",
	"nosniff":          "X-Content-Type-Options: nosniff\r\n",
	"redirect":         "Location: /hello\r\n",
	"redirect-index":   "Location: /\r\n",
	"redirect-landing": "Location: /\r\n",
	"content-css":      "Content-Type: text/css; charset=utf-8\r\n",
	"content-html":     "Content-Type: text/html; charset=utf-8\r\n",
	"content-jpeg":     "Content-Type: image/jpeg\r\n",
	"content-jpg":      "Content-Type: image/jpeg\r\n",
	"content-js":       "Content-Type: text/javascript; charset=utf-8\r\n",
	"content-json":     "Content-Type: application/json\r\n",
	"content-png":      "Content-Type: image/png\r\n",
	"content-text":     "Content-Type: text/plain\r\n",
	"content-text8":    "Content-Type: text/plain; charset=utf-8\r\n",
	"connection":       "Connection: upgrade\r\n",
	"upgrade":          "Upgrade: websocket\r\n",
}

var ValidFiles = map[string]bool{
	"index.js":  true,
	"index.css": true,
	"game.js":   true,
}

var XsrfChars = []byte("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ")
var XsrfValidTokens = map[string]bool{}

// for websocket
var WebsocketGUID string = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11"
var UpgradedConn = map[net.Conn]bool{}
var UpgradedConnMutex = &sync.Mutex{}
var TokenChars = []byte("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789")
