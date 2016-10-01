#!/usr/bin/python
from scapy.all import *
from uuid import getnode as get_mac
import time

PROBE_REQUEST_TYPE=0
PROBE_REQUEST_SUBTYPE=4

ROUTERS = []
ROUTER_DATA = {}
HANDSHAKE_DONE = False


def PacketHandler(pkt):
    if pkt.haslayer(Dot11):
        # print(ROUTERS)
        # if pkt.type==PROBE_REQUEST_TYPE and pkt.subtype == PROBE_REQUEST_SUBTYPE and ( pkt.addr2.lower() in WHITELIST or pkt.addr2.upper() in WHITELIST):
        # if pkt.addr2.lower() in WHITELIST or pkt.addr2.upper() in WHITELIST or pkt.addr1.lower() in WHITELIST or pkt.addr1.lower() in WHITELIST:
        # if len(ROUTERS)!=0:
        # if pkt.addr2 and pkt.subtype!=8 and (pkt.addr2.lower() in ROUTERS or pkt.addr2.upper() in ROUTERS):
        #     RouterPacket(pkt)
            # if len(ROUTER_DATA)>=2:
            #     print(ROUTER_DATA)
                # HANDSHAKE_DONE=True
                # ROUTERS=[]
        # elif pkt.addr2 and pkt.subtype != 8:
            PrintPacket(pkt)

def SigStrength(pkt):
    try:
        extra = pkt.notdecoded
    except:
        extra = None
    if extra:
        signal_strength = -(256-ord(extra[-4:-3]))
    else:
        print("Error No Extra")
        return None
    return signal_strength

def RouterPacket(pkt):
    signal_strength = SigStrength(pkt)
    ROUTER_DATA[pkt.addr2]=signal_strength

def PrintPacket(pkt):
    signal_strength = SigStrength(pkt)
    if signal_strength:
        print "%s %s" % (pkt.addr2, signal_strength)

def main():
    # from datetime import datetime
    # print ("[%s] Starting scan"%datetime.now())
    sniff(iface=sys.argv[1],prn=PacketHandler)

if __name__=="__main__":
    main()
