# FloodWatch India Radar - Deployment Guide

## 🚀 Quick Deployment via Lovable

1. **Visit your Lovable project**: https://lovable.dev/projects/423deaed-4ef6-4d90-8a7d-c785e1fb211a

2. **Deploy to Production**:
   - Click on **"Share"** in the top right
   - Select **"Publish"**
   - Your app will be deployed automatically!

3. **Your deployed URL will be something like**:
   `https://floodwatch-india-radar-423deaed.lovableproject.com`

## 🔧 Environment Variables Setup

Before deployment, make sure to set up your environment variables in Lovable:

1. In Lovable project, go to **Settings** → **Environment Variables**
2. Add these variables:

```env
VITE_SUPABASE_URL=https://sjzncyvfqtnnwyqtxacn.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNqem5jeXZmcXRubnd5cXR4YWNuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2NDQ0NDIsImV4cCI6MjA2ODIyMDQ0Mn0.RjfzB_ZvqUXHpF9EDdE_86qXmX5a-4DjccQq3E8W5d4
VITE_APP_NAME=FloodWatch India Radar
VITE_APP_VERSION=1.0.0
VITE_APP_ENV=production
```

## 🌐 Alternative Deployment Options

### Deploy to Vercel
1. Connect your GitHub repo to Vercel
2. Import project: https://vercel.com/import
3. Deploy automatically

### Deploy to Netlify
1. Drag and drop your `dist` folder to Netlify
2. Or connect via GitHub: https://app.netlify.com

### Deploy to GitHub Pages
```bash
npm run build
npm install -g gh-pages
gh-pages -d dist
```

## 🔑 API Keys Needed (Optional for enhanced features)

To get full functionality, obtain these free API keys:

1. **OpenWeather API** (for weather data):
   - Visit: https://openweathermap.org/api
   - Sign up and get free API key
   - Add to environment: `VITE_OPENWEATHER_API_KEY=your_key_here`

2. **Mapbox** (for enhanced mapping):
   - Visit: https://www.mapbox.com/
   - Sign up and get access token
   - Add to environment: `VITE_MAPBOX_ACCESS_TOKEN=your_token_here`

## 📱 Features Available After Deployment

✅ **Real-time flood sensor monitoring**
✅ **Interactive map with Mumbai flood zones**
✅ **Emergency alert system**
✅ **Citizen and Responder dashboards**
✅ **Emergency contact directory**
✅ **Incident reporting system**
✅ **Responsive mobile design**
✅ **Real-time data updates**

## 🎯 Post-Deployment Steps

1. **Test the application** on different devices
2. **Set up Supabase database** by running the schema
3. **Configure real-time subscriptions**
4. **Add sample sensor data**
5. **Test emergency alert system**

## 🔗 Production URLs

- **Main App**: Will be provided after Lovable deployment
- **Database**: https://sjzncyvfqtnnwyqtxacn.supabase.co
- **GitHub Repo**: https://github.com/Ansh26480/floodwatch-india-radar

Your FloodWatch India Radar is ready to help protect communities! 🌊🇮🇳
