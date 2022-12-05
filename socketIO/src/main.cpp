#include "../include/SimpleClass.h"

#include <iostream>
#include <wiringPi.h>

int main() {
    wiringPiSetup();
    pinMode(25, INPUT);

    while(1) {
        std::cout << "Pin 25 = " << digitalRead(25) << std::endl;
    }

    SimpleClass simple;
    std::cout << "Hello world!" << std::endl;

    return 0;
}
