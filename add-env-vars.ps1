# إضافة متغيرات البيئة إلى Vercel
Write-Host "Adding environment variables to Vercel..." -ForegroundColor Green

# Database
echo "postgres://66107bc5cceda36216a96956f61e069a47e4154e935b0a6166e37df394d4ac64:sk_ddn2SyAaNJotrrTIL_j2h@db.prisma.io:5432/postgres?sslmode=require" | npx vercel env add DATABASE_URL production --force
echo "postgres://66107bc5cceda36216a96956f61e069a47e4154e935b0a6166e37df394d4ac64:sk_ddn2SyAaNJotrrTIL_j2h@db.prisma.io:5432/postgres?sslmode=require" | npx vercel env add POSTGRES_URL production --force
echo "postgres" | npx vercel env add DATABASE_TYPE production --force

# API Keys
echo "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" | npx vercel env add GROQ_API_KEY production --force
echo "AIzaSyC87MwuwuIAlWheWfKSZlsGgpKxMZxoTQM" | npx vercel env add GEMINI_API_KEY production --force
echo "Xekb8sWhFAzaori3koEkloite3lQxCyk8fmGWCDoUtMSMUjs7ZCt5Dyx" | npx vercel env add PEXELS_API_KEY production --force
echo "Xekb8sWhFAzaori3koEkloite3lQxCyk8fmGWCDoUtMSMUjs7ZCt5Dyx" | npx vercel env add NEXT_PUBLIC_PEXELS_API_KEY production --force

# Security
echo "miladak_production_secret_2025_strong_key_xyz123" | npx vercel env add AUTH_SECRET production --force

# AdSense
echo "ca-pub-5755672349927118" | npx vercel env add NEXT_PUBLIC_ADSENSE_CLIENT production --force
echo "pub-5755672349927118" | npx vercel env add ADSENSE_PUBLISHER_ID production --force

# Site URLs
echo "https://miladak.com" | npx vercel env add NEXT_PUBLIC_APP_URL production --force
echo "https://miladak.com" | npx vercel env add NEXT_PUBLIC_BASE_URL production --force
echo "https://miladak.com" | npx vercel env add NEXT_PUBLIC_SITE_URL production --force

# Build
echo "1" | npx vercel env add NEXT_TELEMETRY_DISABLED production --force

Write-Host "Done!" -ForegroundColor Green
