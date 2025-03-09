#!/bin/bash

# Backup original package.json
cp package.json package.json.bak

# Use the production-ready package.json
cp package.prod.json package.json

echo "Prepared for Vercel deployment!"