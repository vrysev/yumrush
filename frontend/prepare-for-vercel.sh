#!/bin/bash

# Backup original package.json
cp package.json package.json.bak

# Use the production-ready package.json
cp package.prod.json package.json

# Create necessary directories for types
mkdir -p src/types

# Make sure our types file exists
if [ ! -f "src/types/assets.d.ts" ]; then
  # Create type declarations file
  touch src/types/assets.d.ts
fi

echo "Prepared for Vercel deployment!"