#!/bin/bash
docker rmi accessibility-assessment:SNAPSHOT
docker build -t accessibility-assessment:SNAPSHOT .
