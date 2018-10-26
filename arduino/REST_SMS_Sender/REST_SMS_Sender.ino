#include <SoftwareSerial.h>
#include <pins_arduino.h>
#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ESP8266WebServer.h>
#include <ESP8266mDNS.h>

// GENERIC CONFIG
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

auto mCurrentlyHandling = false;

void setup(void)
{
    pinMode(LED, OUTPUT);
    digitalWrite(LED, 0);
    Serial.begin(HOST_BAUD);
    while(!Serial);
    SIM_MODULE.begin(SIM_BAUD);
    while(!SIM_MODULE); // is this need as for Serial?
    
    Serial.printf("Connecting to %s\n", _SSID);
    WiFi.begin(_SSID, PASSWORD);
    WiFi.config(IP, GATEWAY, SUBNET);
    while (WiFi.status() != WL_CONNECTED)
    {
        delay(50);
        Serial.print(".");
    }
    Serial.print("\nConnected, IP address: ");
    Serial.println(WiFi.localIP());

    REST_SERVER.on("/",          [&]() -> void { handle(handleRoot); });
    REST_SERVER.on("/broadcast", [&]() -> void { handle(handleBroadcast); });
    REST_SERVER.begin();
    Serial.println("REST_SERVER server started");
}

void loop(void){
  REST_SERVER.handleClient();
}

void handleRoot() {
  REST_SERVER.send(200, "text/plain", "ESP8266 Server is present.");
}

void handleBroadcast() {
  auto args = REST_SERVER.args();
  REST_SERVER.send(200, "text/plain", "TODO do stuff");
}

// Switches the LED while handling one request.
void handle(void(& handler)())
{
    mCurrentlyHandling = true;
    digitalWrite(LED, 1);
    handler();
    digitalWrite(LED, 0);
    mCurrentlyHandling = false;
}

void handleNotFound(){
  digitalWrite(LED, 1);
  String message = "File Not Found\n\n";
  message += "URI: ";
  message += REST_SERVER.uri();
  message += "\nMethod: ";
  message += (REST_SERVER.method() == HTTP_GET)?"GET":"POST";
  message += "\nArguments: ";
  message += REST_SERVER.args();
  message += "\n";
  for (uint8_t i=0; i<REST_SERVER.args(); i++){
    message += " " + REST_SERVER.argName(i) + ": " + REST_SERVER.arg(i) + "\n";
  }
  REST_SERVER.send(404, "text/plain", message);
  digitalWrite(LED, 0);
}

