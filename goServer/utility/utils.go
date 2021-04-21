package util

import (
	"bytes"
	"fmt"
	"io/ioutil"
	"log"
	"math/rand"
	"net"
	"os"
	"strings"
	"time"

	"cse312.app/values"
)

//Use this for sending any sort of generic message back to the user. Feel free to include your own headers
func SendResponse(c net.Conn, header []string, body []byte) {
	log.Println(header)
	strHeader := ""
	size := 0
	if body != nil {
		size = len(body)
	}
	for _, h := range header {
		strHeader += h
	}
	strHeader += fmt.Sprintf("Content-Length: %v\r\n", size)
	strHeader += "\r\n"

	response := []byte(strHeader)
	if body != nil {
		response = append(response, body...)
	}

	Sendall(c, response)
}

//Necessary function to prevent all partial-writes on a TCP socket!
func Sendall(conn net.Conn, msg []byte) error {

	index, num_bytes := uint(0), uint(len(msg))
	for index < num_bytes {

		//send slice starting from b[index]
		if x, err := conn.Write(msg[index:]); err != nil {
			return err
		} else {
			index += uint(x)
		}
	}
	//log.Println("sendall: sent")
	return nil
}

func readFile(fileName string) ([]byte, error) {
	if _, err := os.Stat(fileName); os.IsNotExist(err) {
		return []byte{}, err
	}
	//read file and send
	body, err := ioutil.ReadFile(fileName)
	if err != nil {
		return []byte{}, err
	}
	return body, nil
}

//Parses a query string and will return a map for all key-value pairs
func ParseQuery(qs string) map[string][]string {

	keys := strings.Split(qs, "&")
	m := make(map[string][]string)

	var keyValue []string
	var key, value string
	for _, k := range keys {
		keyValue = strings.Split(k, "=")
		if keyValue != nil && len(keyValue) == 2 {
			key = keyValue[0]
			value = keyValue[1]
			m[key] = strings.Split(value, "+")
		}
	}
	return m
}

func SendFile(c net.Conn, file string) {
	if body, err := readFile(file); err != nil {
		h := []string{values.Headers["404"], values.Headers["content-text"]}
		SendResponse(c, h, nil)
	} else {
		fileExtension := strings.Split(file, ".")[1]
		h := []string{values.Headers["200"], values.Headers["content-"+fileExtension], values.Headers["nosniff"]}
		SendResponse(c, h, body)
	}
}

//https://golang.org/pkg/math/rand/#Rand
func generateXSRF() []byte {
	rand.Seed(time.Now().UnixNano())
	xsrfToken := make([]byte, 0)
	for i := 0; i < 28; i++ {
		index := rand.Intn(len(values.XsrfChars))
		xsrfToken = append(xsrfToken, values.XsrfChars[index])
	}

	values.XsrfValidTokens[string(xsrfToken)] = true
	return []byte(fmt.Sprintf(`<input value="%s" type="text" name="xsrf_token" hidden> `, xsrfToken))
}

//Parses multi-form data and returns a map of all key-value pairs
//File handling is supported too!
func ParseMultiForm(payload []byte, boundary string) map[string][]byte {
	m := make(map[string][]byte)
	allBoundaries := bytes.Split(payload, []byte("--"+boundary))
	for _, field := range allBoundaries {
		field = bytes.TrimLeft(field, "--")
		field = bytes.TrimLeft(field, "\r\n")
		if bytes.Compare(field, []byte("")) != 0 {
			start := bytes.Index(field, []byte("\r\n\r\n"))
			if start == -1 {
				return nil
			}
			headers := strings.Split(string(field[:start]), "\r\n")
			key := strings.Split(headers[0], "name=")
			keyStr := ""
			if len(key) > 1 {
				keyStr = strings.Split(strings.Split(key[1], "\r\n")[0], ";")[0]
			}
			if keyStr == "" {
				return nil
			}
			keyStr = strings.Trim(keyStr, "\"")
			formBody := bytes.Split(field, []byte("\r\n\r\n"))[1]
			m[keyStr] = bytes.TrimRight(formBody, "\r\n")
		}
	}
	return m
}

func GenerateToken() string {
	rand.Seed(time.Now().UnixNano())
	xsrfToken := make([]byte, 0)
	for i := 0; i < 50; i++ {
		index := rand.Intn(len(values.TokenChars))
		xsrfToken = append(xsrfToken, values.TokenChars[index])
	}

	return string(xsrfToken)
}

func ParseCookie(cookie string) map[string]string {
	m := make(map[string]string)
	if strings.Split(cookie, ":")[0] == "Cookie" {
		cookieType := strings.Split(strings.Split(cookie, "Cookie: ")[1], "; ")
		for _, c := range cookieType {
			pair := strings.Split(c, "=")
			name, value := pair[0], pair[1]
			m[name] = value
		}
	}
	return m
}
