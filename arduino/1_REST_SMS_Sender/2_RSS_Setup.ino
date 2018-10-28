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
    printf("\nConnected, IP address: ", true, WiFi.localIP().toString().c_str());
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
    SIM_MODULE.setTimeout(SIM_MSG_TIMEOUT);
    
    auto begin = millis();
    while (millis() - begin < SIM_HANDSHAKE_TIMEOUT)
    {
        SIM_MODULE.write("AT");
        if(SIM_MODULE.available() > 0)
        {
            auto input = SIM_MODULE.readString();
            printf("SIM repsonse: %s", true, input.c_str());
            if(input == "OK")
                return true;
        }
        else
        {
          delay(5); / TEST this
        }
    }
    return false;
}


