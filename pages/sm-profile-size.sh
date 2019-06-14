#!/bin/bash
sm -d | grep $1 | tr ", " "\n" | tr -d "=>" | tr -d "\t" | sed '/^$/d' | tail -n +2 | wc -l
