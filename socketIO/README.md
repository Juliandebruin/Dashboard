# SocketIO

## Instalation

### Install the following packages

> sudo apt-get install gcc   \
> sudo apt-get install cmake


### Install WiringPi 
WiringPi can be installed by cloning the following [repos](https://github.com/WiringPi/WiringPi) into ~/ folder.


### Modifing WiringPi
Make the following modifications to get wiring pi to work.

Create a file named FindWiringPi.cmake and add it in the /usr/share/cmake-3.18/Modules folder. Add the following lines to FindWiringPi.cmake

```
find_library(WIRINGPI_LIBRARIES NAMES wiringPi)
find_path(WIRINGPI_INCLUDE_DIRS NAMES wiringPi.h)

include(FindPackageHandleStandardArgs)
find_package_handle_standard_args(wiringPi DEFAULT_MSG WIRINGPI_LIBRARIES WIRINGPI_INCLUDE_DIRS)
```

## Builing and compiling

### Building cmake

Run the following command in socketIO/ to build cmake
> cmake .

### Compiling

To compile the project run
> make

## Running

To execute the project run
> ./socketIO