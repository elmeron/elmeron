#!/bin/bash

#
# Deployment script
#
# Builds and runs both the webserver and gameserver on the same machine.
#

GAMESERVER_URL=${GAMESERVER_URL:=http://localhost}
GAMESERVER_PORT=${GAMESERVER_PORT:=5151}
WEBSERVER_PORT=${WEBSERVER_PORT:=3000}

GAMESERVER_INTERNAL_PORT=3000
WEBSERVER_INTERNAL_PORT=3000

function print {
  C='\033[0;32m' # green
  NC='\033[0m' # no color
  TEXT=$1

  echo -e "${C}${1}${NC}"
}

function restart_container {
  CONTAINER=$1

  if [ -n "$(docker ps | grep $CONTAINER)" ]
  then
    docker stop $CONTAINER
  fi

  if [ -n "$(docker ps -a | grep $CONTAINER)" ]
  then
    docker rm $CONTAINER
  fi
}

# Webserver image
print "Building Webserver image..."
docker build \
  --build-arg GAMESERVER_URL=$GAMESERVER_URL:$GAMESERVER_PORT \
  --build-arg PORT=$WEBSERVER_INTERNAL_PORT \
  -t elmeron/webserver \
  -f webserver.docker .

# Gameserver image
print "Building Gameserver image..."
docker build \
  --build-arg PORT=$GAMESERVER_INTERNAL_PORT \
  -t elmeron/gameserver \
  -f gameserver.docker .

# Restart webserver container
print "Restarting Webserver container..."
restart_container elmeron-webserver
docker run \
  -d \
  -p $WEBSERVER_PORT:$WEBSERVER_INTERNAL_PORT \
  --name elmeron-webserver \
  elmeron/webserver

# Restart gameserver container
print "Restarting Gameserver container..."
restart_container elmeron-gameserver
docker run \
  -d \
  -p $GAMESERVER_PORT:$GAMESERVER_INTERNAL_PORT \
  --name elmeron-gameserver \
  elmeron/gameserver

print "Done"
docker ps -f name=elmeron
