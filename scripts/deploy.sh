#!/bin/bash

echo "Pulling latest PROFFICE changes"

git pull

echo "Building PROFFICE docker"

docker compose -f docker-compose.yml up -d --build

echo "Deployment complete"