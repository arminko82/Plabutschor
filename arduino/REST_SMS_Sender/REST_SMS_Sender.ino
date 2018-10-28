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

// STATE
auto mCurrentlyHandling = false;
auto mSimOk = false;

void setup(void)
{
    pinMode(LED, OUTPUT);
    digitalWrite(LED, 0);
    setupDebugLine();
    mSimOk = setupSimComponents();
    setupWifiComponents();
}

void setupDebugLine()
{
#if DEBUG
    Serial.begin(HOST_BAUD);
    while(!Serial);  
#endif // DEBUG
}

void setupWifiComponents()
{
    printf("Connecting to %s", true, _SSID);
    WiFi.begin(_SSID, PASSWORD);
    WiFi.config(IP, GATEWAY, SUBNET);
    while (WiFi.status() != WL_CONNECTED)
    {
        delay(50);
        print(".");
    }
    Serial.print("\nConnected, IP address: ", true, WiFi.localIP());
    REST_SERVER.on("/",          [&]() -> void { handle(handleRoot); });
    REST_SERVER.on("/broadcast", [&]() -> void { handle(handleBroadcast); });
    REST_SERVER.on("/simActive", [&]() -> void { handle(handleSimActive); });
    REST_SERVER.begin();
    println("REST_SERVER server started");  
}

bool setupSimComponents()
{
    SIM_MODULE.begin(SIM_BAUD);
    while(!SIM_MODULE); // is this need as for Serial?
    return true; // check if AT command could be send   TODO
}

void loop(void)
{
    REST_SERVER.handleClient();
}

void handleRoot()
{
    REST_SERVER.send(200, "text/plain", "ESP8266 Server is present.");
}

void handleSimActive() 
{
    REST_SERVER.send(mSimOk ? 200 : 503, "text/plain", mSimOk ? "SIM_ACTIVE" : "NO_SIM_ACTIVE");
}

void handleBroadcast() 
{
  auto args = REST_SERVER.args();
  REST_SERVER.send(200, "text/plain", "TODO do stuff");
}

// Switches the LED while handling one request.
// Executes passed handler. The handler is expected to perform the HTTP response compsing and sending.
void handle(void(& handler)())
{
    if(mCurrentlyHandling)
    {
        REST_SERVER.send(503, "text/plain", "Device is busy.");
        return;
    }
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


void print(const char* msg, bool newLine = false)
{
#if DEBUG
    Serial.print(msg);
    if(newLine)
        Serial.println();
#endif // DEBUG
}

void println(const char* msg)
{
#if DEBUG
    print(msg, true);
#endif // DEBUG
}

void printf(const char* msg, bool newLine = true, ...)
{
#if DEBUG
    char buffer[256];
    va_list args;
    va_start (args, newLine);
    vsprintf (buffer,msg, args);
    va_end (args);
    print(buffer, newLine);
#endif // DEBUG
}

