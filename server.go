package main

import (
	"fmt"
	"net/http"

	"golang.org/x/net/websocket"
)

func echoHandler(ws *websocket.Conn) {
	var msg []byte
	n, err := ws.Read(msg)
	if err != nil {
		fmt.Println(err.Error())
		return
	}

	fmt.Printf("Receive: %#v\n", string(msg[:n]))

	// m, err := ws.Write(msg[:n])
	// if err != nil {
	// 	log.Fatal(err)
	// }
	// fmt.Printf("Send: %s\n", msg[:m])
}

func main() {
	http.Handle("/echo", websocket.Handler(echoHandler))
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		panic("ListenAndServe: " + err.Error())
	}
}
