#!/usr/local/bin/python2.7

import dpkt

counter=0
ipcounter=0
tcpcounter=0
udpcounter=0

filename='dump2.pcap'

for ts, pkt in dpkt.pcap.Reader(open(filename,'r')):

    counter+=1
    eth=dpkt.ethernet.Ethernet(pkt) 
    if eth.type!=dpkt.ethernet.ETH_TYPE_IP:
       continue

    ip=eth.data
    ipcounter+=1

    if ip.p==dpkt.ip.IP_PROTO_TCP: 
       tcpcounter+=1

    if ip.p==dpkt.ip.IP_PROTO_UDP:
       udpcounter+=1
    tcp = ip.data
    if tcp.dport == 80 and len(tcp.data) > 0:
        try:
            http = dpkt.http.Request(tcp.data)
            print http.method + "  http://"+http.headers["host"]+http.uri
        except Exception as e:
            #print "Error parsing"
            #print e
            continue

#print "Total number of packets in the pcap file: ", counter
#print "Total number of ip packets: ", ipcounter
#print "Total number of tcp packets: ", tcpcounter
#print "Total number of udp packets: ", udpcounter