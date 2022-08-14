#!/bin/bash

set -e

docker build --build-arg NODE_ENV=production -t registry.gitlab.com/tpearl/tpearl-shop -f ./devtools/docker/Dockerfile .

docker push registry.gitlab.com/tpearl/tpearl-shop:latest
