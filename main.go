package main

import (
	"bufio"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/google/gopacket"
	"github.com/google/gopacket/layers"
	"github.com/google/gopacket/pcap"
	"golang.org/x/net/websocket"
)

var (
	promiscuous = true
	server      = "ws://localhost:8080/echo"
	origin      = "http://localhost/"
)

type processedPacket struct {
	Mac      string `json:"mac"`
	Method   string `json:"method"`
	URI      string `json:"uri"`
	Host     string `json:"host"`
	Ts       int64  `json:"ts"`
	Referred bool   `json:"referred"`
}

func newProcessedPacket(mac, method, uri, host string, ts int64, referred bool) *processedPacket {
	return &processedPacket{Mac: mac, Method: method, URI: uri, Host: host, Ts: ts, Referred: referred}
}

func processPacket(packet gopacket.Packet) *processedPacket {
	var mac string
	ts := time.Now().Unix()
	ethernetLayer := packet.Layer(layers.LayerTypeEthernet)
	if ethernetLayer != nil {
		ethernetPacket, _ := ethernetLayer.(*layers.Ethernet)
		mac = ethernetPacket.SrcMAC.String()
	} else {
		// fmt.Println("Bad ethernet layer")
		return nil
	}

	tcpLayer := packet.Layer(layers.LayerTypeTCP)
	if tcpLayer != nil {
		tcp, _ := tcpLayer.(*layers.TCP)
		if tcp.SrcPort != 80 && tcp.DstPort != 80 {
			// fmt.Println("Wrong TCP Port")
			return nil
		}
	} else {
		// fmt.Println("Bad TCP Layer")
		return nil
	}

	applicationLayer := packet.ApplicationLayer()
	if applicationLayer != nil {
		if strings.Contains(string(applicationLayer.Payload()), "HTTP") {
			// HTTP Packet
			lines := strings.Split(string(applicationLayer.Payload()), "\n")

			method := strings.Split(lines[0], " ")[0]
			uri := strings.TrimSpace(strings.Split(lines[0], " ")[1])
			var host string
			var referred bool

			for _, line := range lines[1:] {
				if strings.Contains(line, "Host:") {
					host = strings.TrimSpace(strings.Split(line, " ")[1])
				} else if strings.Contains(line, "Referer:") {
					referred = true
				}
			}
			// fmt.Println(string(applicationLayer.Payload()))
			// fmt.Println(mac)
			// fmt.Println(method)
			// fmt.Println(host)
			// fmt.Println(uri)
			return newProcessedPacket(mac, method, uri, host, ts, referred)
		}
	}
	return nil
}

func postPacket(ws *websocket.Conn, packet *processedPacket) {
	// fmt.Printf("%#v\n", packet)
	marshalled, err := json.Marshal(*packet)
	if err != nil {
		fmt.Println(err.Error())
		return
	}
	fmt.Printf("%#v\n", packet)
	fmt.Println(string(marshalled))
	_, err = ws.Write(marshalled)
	if err != nil {
		fmt.Println(err.Error())
		return
	}
}
func handlePackets(packets <-chan gopacket.Packet, ws *websocket.Conn, quit <-chan struct{}) {
	for {
		select {
		case p := <-packets:
			processed := processPacket(p)
			if processed != nil {
				postPacket(ws, processed)
			}
		case <-quit:
			fmt.Println("quit")
			return
		}
	}
}

func main() {
	// Find all devices
	devices, err := pcap.FindAllDevs()
	if err != nil {
		log.Fatal(err)
	}

	// Print device information
	fmt.Println("Choose a capture device")
	reader := bufio.NewReader(os.Stdin)
	for i, device := range devices {
		fmt.Println(i, device.Name)
	}
	choice, err := reader.ReadString('\n')
	if err != nil {
		panic(err)
	}

	dev, err := strconv.Atoi(strings.TrimRight(choice, "\n"))
	if err != nil {
		panic(err)
	}

	handle, err := pcap.OpenLive(devices[dev].Name, 4096, promiscuous, pcap.BlockForever)
	if err != nil {
		panic(err)
	}
	err = handle.SetBPFFilter("tcp and dst port 80")
	if err != nil {
		panic(err)
	}

	packetSource := gopacket.NewPacketSource(handle, handle.LinkType())

	ws, err := websocket.Dial(server, "", origin)
	if err != nil {
		panic(err)
	}

	quit := make(chan struct{})
	handlePackets(packetSource.Packets(), ws, quit)
}
