#!/bin/bash

# Backup original package.json
cp package.json package.json.bak

# Use the production-ready package.json
cp package.prod.json package.json

# Backup tsconfig.json
cp tsconfig.json tsconfig.json.bak

# Use Vercel-optimized tsconfig
cp tsconfig.vercel.json tsconfig.json

# Create necessary directories for types
mkdir -p src/types

# Make sure our types file exists
if [ ! -f "src/types/assets.d.ts" ]; then
  # Create type declarations file
  touch src/types/assets.d.ts
fi

# Make sure dist directory exists
mkdir -p dist

echo "Prepared for Vercel deployment!"
