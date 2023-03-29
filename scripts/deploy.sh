#!/bin/bash

echo "Pulling latest PROFFICE changes"

git pull

echo "Building PROFFICE docker"

docker-compose up -d --build

echo "Deployment complete"