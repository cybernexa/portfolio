#!/bin/bash
# start.sh — starts MongoDB and the portfolio server together.
# Run with: ./start.sh
# Stop everything with Control+C (both processes shut down cleanly).

DB_PATH="$HOME/data/db"
mkdir -p "$DB_PATH"

echo "Starting MongoDB..."
mongod --dbpath "$DB_PATH" > /tmp/mongod.log 2>&1 &
MONGO_PID=$!

# Wait until MongoDB is actually ready before starting the server
until grep -q "Waiting for connections" /tmp/mongod.log 2>/dev/null; do
  sleep 0.5
done
echo "MongoDB is up (pid $MONGO_PID)."

# When this script exits (e.g. Control+C), also stop MongoDB
trap "echo ''; echo 'Stopping MongoDB...'; kill $MONGO_PID" EXIT

echo "Starting the server..."
npm start
