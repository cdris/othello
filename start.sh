#!/bin/bash

export PORT=5102

cd ~/www/othello
./bin/othello stop || true
./bin/othello start

