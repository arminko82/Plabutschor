void loop(void)
{
    REST_SERVER.handleClient();
    while (SIM_MODULE.available() > 0) 
    {
        auto s = SIM_MODULE.readString();
        interpretSimMessage(s);
#if DEBUG
        const char* chars = s.c_str();
        for(int i = 0; i< s.length(); i++)
            Serial.write(chars[i]);
#endif // DEBUG
    }
    // delay(1);
    //while (Serial.available() > 0) 
    //{
    //  swSer.write(Serial.read());
    //}
}

