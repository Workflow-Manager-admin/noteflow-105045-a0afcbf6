#!/bin/bash
cd /home/kavia/workspace/code-generation/noteflow-105045-a0afcbf6/notes_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

