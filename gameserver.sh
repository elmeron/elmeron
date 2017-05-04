#!/bin/bash

docker build -t elmeron/gameserver -f gameserver.docker . && \
docker stop elmeron-gameserver && \
docker rm elmeron-gameserver && \
docker run -d -p 3000:3000 --name elmeron-gameserver elmeron/gameserver
