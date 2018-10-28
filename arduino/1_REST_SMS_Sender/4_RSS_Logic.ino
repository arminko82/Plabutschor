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

void interpretSimMessage(String message)
{
  
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


