#!/bin/bash

# Deploy script untuk Najjo Booking Engine
# Usage: ./deploy.sh

echo "🚀 Deploying Najjo Booking Engine..."

# 1. Pull latest code
echo "📥 Pulling latest code..."
git pull origin main || { echo "❌ Git pull failed"; exit 1; }

# 2. Install dependencies
echo "📦 Installing dependencies..."
npm install

# 3. Build
echo "🔨 Building application..."
npm run build || { echo "❌ Build failed"; exit 1; }

# 4. Restart PM2
echo "🔄 Restarting application..."
pm2 restart najjo-booking || pm2 start npm --name "najjo-booking" -- run start

# 5. Save PM2 state
pm2 save

echo "✅ Deployment complete!"
pm2 status najjo-booking
