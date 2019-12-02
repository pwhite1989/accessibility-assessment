#!/bin/bash
docker rmi -f accessibility-assessment:SNAPSHOT
docker build -t accessibility-assessment:SNAPSHOT .
