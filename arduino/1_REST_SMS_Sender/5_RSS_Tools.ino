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

void print(const char* msg, bool newLine)
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

void printf(const char* msg, bool newLine, ...)
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

