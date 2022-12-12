cmake_minimum_required(VERSION 3.0)

project(canDashboard)

set(Header_Files
	"include/SimpleClass.h"
)

source_group("Header Files" FILES ${Header_Files})

set(Source_Files
	"src/main.cpp"
    "src/SimpleClass.cpp"
)

source_group("Source Files" FILES ${Source_Files})

add_executable(	
	${PROJECT_NAME} 
    ${Header_Files}
    ${Source_Files}
)

# Locate libraries and headers
find_package(WiringPi REQUIRED)
find_package(Threads REQUIRED) 

# Include headers
include_directories(${WIRINGPI_INCLUDE_DIRS})

# Link against libraries
target_link_libraries(canDashboard ${WIRINGPI_LIBRARIES})
target_link_libraries(canDashboard ${CMAKE_THREAD_LIBS_INIT})