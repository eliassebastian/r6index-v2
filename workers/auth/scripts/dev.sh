#!/bin/bash

# Start wrangler dev in the background and capture its PID
pnpm wrangler dev --persist-to=../../.wrangler/state --test-scheduled &
PID=$!

# Define cleanup function to be executed when the script exits
cleanup() {
  echo "Stopping wrangler dev..."
  kill $PID
  exit 0  # Ensure script exits successfully
}

# Trap SIGINT (Ctrl+C) and EXIT, and execute the cleanup function
trap cleanup SIGINT EXIT

# Wait for the server to be ready
max_attempts=10
attempt=0
while ! curl -s http://localhost:8789 > /dev/null; do
  sleep 1
  ((attempt++))
  if [ "$attempt" -ge "$max_attempts" ]; then
    echo "Server didn't start within the expected time. Exiting..."
    exit 1
  fi
done

# URL to be called
URL="http://localhost:8789/__scheduled"

# Loop to call the URL every 2 hours
while true; do
  # Use curl to send a GET request to the URL to trigger the scheduled worker
  curl $URL
  echo "$(date): Scheduled worker triggered successfully. PID: $PID. Press ^C (Ctrl+C) to stop it."
  # Sleep for 2 hours (7200 seconds)
  sleep 7200
done