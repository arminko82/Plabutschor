#include <SoftwareSerial.h>
#include <pins_arduino.h>
#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ESP8266WebServer.h>
#include <ESP8266mDNS.h>


// GENERIC CONFIG
#define DEBUG true

const int LED = 13;
const int HOST_BAUD = 115200;

// NETWORK CONFIG
const char* _SSID = "........";
const char* PASSWORD = "........";

const IPAddress IP(192, 168, 1, 9);
const IPAddress GATEWAY(192, 168, 1, 0);
const IPAddress SUBNET(255, 255, 255, 0);
ESP8266WebServer REST_SERVER(80);

// SIM CONFIG
const int RX = D5;
const int TX = D6;
const int SIM_BAUD = HOST_BAUD;
SoftwareSerial SIM_MODULE(RX, TX);
const int SIM_MSG_TIMEOUT = 50;
const int SIM_HANDSHAKE_TIMEOUT = 3000;

// STATE
auto mCurrentlyHandling = false;
auto mSimOk = false;

// FORWARD DECLARATIONS
void setupDebugLine();
void setupWifiComponents();
bool setupSimComponents();
void handleRoot();

void handleSimActive();
void handleBroadcast();
void handle(void(& handler)());
void interpretSimMessage(String message);
void print(const char* msg, bool newLine = false);
void println(const char* msg);
void printf(const char* msg, bool newLine = true, ...);

