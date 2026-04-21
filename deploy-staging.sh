#!/bin/bash

# Ensure Vercel CLI is installed globally or use npx
echo "🚀 Deploying Porsche19 to custom Vercel environment: staging..."
npx vercel deploy --target=staging

# Uncomment the below if you need to pull environment variables locally
# echo "📥 Pulling environment variables from staging..."
# npx vercel pull --environment=staging

# Uncomment the below if you need to add a new environment variable to staging
# echo "🔑 Adding MY_KEY environment variable to staging..."
# npx vercel env add MY_KEY staging
