#!/bin/bash
set -e

echo "Building Next.js application..."
npm run build

echo "Exporting static files..."
npm run export

echo "Build and export completed successfully!"
echo "Output directory: out/"