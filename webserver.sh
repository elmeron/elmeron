#!/bin/bash

docker build -t elmeron/webserver -f webserver.docker . && \
docker stop elmeron-webserver && \
docker rm elmeron-webserver && \
docker run -d -p 80:3000 --name elmeron-webserver elmeron/webserver
