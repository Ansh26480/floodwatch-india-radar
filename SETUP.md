# FloodWatch India Radar - Complete Development Setup

## 🚀 Quick Download Links

### Essential Software (Download First):

1. **Node.js (REQUIRED)**
   - **Direct Download**: https://nodejs.org/dist/v20.11.0/node-v20.11.0-x64.msi
   - **Website**: https://nodejs.org/
   - **Version**: LTS (Long Term Support) - v20.x

2. **Git (REQUIRED)**
   - **Direct Download**: https://github.com/git-for-windows/git/releases/latest
   - **Website**: https://git-scm.com/download/win

3. **Visual Studio Code (RECOMMENDED)**
   - **Direct Download**: https://code.visualstudio.com/sha/download?build=stable&os=win32-x64-user
   - **Website**: https://code.visualstudio.com/

4. **Google Chrome (RECOMMENDED)**
   - **Direct Download**: https://www.google.com/chrome/

## 📦 Installation Order

### Step 1: Install Node.js
1. **Download**: Click the Node.js link above
2. **Run installer** as Administrator
3. **Accept all defaults** during installation
4. **Restart your computer** after installation
5. **Verify**: Open Command Prompt and type:
   ```bash
   node --version
   npm --version
   ```

### Step 2: Install Git
1. **Download**: Click the Git link above
2. **Run installer** with default settings
3. **Verify**: Open Command Prompt and type:
   ```bash
   git --version
   ```

### Step 3: Install VS Code (Optional but Recommended)
1. **Download**: Click the VS Code link above
2. **Install** with default settings
3. **Install these extensions**:
   - ES7+ React/Redux/React-Native snippets
   - TypeScript Importer
   - Tailwind CSS IntelliSense
   - GitLens
   - Prettier - Code formatter

## 📋 Prerequisites

Before setting up the project, ensure you have the following installed:

1. **Node.js** (v18 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **Git**
   - Download from: https://git-scm.com/
   - Verify installation: `git --version`

3. **Package Manager** (npm comes with Node.js)
   - Verify npm: `npm --version`

## 🛠️ Installation Steps

### 1. Install Dependencies

Open your terminal in the project directory and run:

```bash
npm install
```

This will install all the required packages including:
- React 18 with TypeScript
- Supabase client
- Leaflet for mapping
- Axios for API calls
- shadcn/ui components
- TailwindCSS

### 2. Environment Configuration

1. **Copy environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Update environment variables in `.env`:**
   ```env
   # Already configured
   VITE_SUPABASE_URL=https://sjzncyvfqtnnwyqtxacn.supabase.co
   VITE_SUPABASE_ANON_KEY=your_existing_key

   # Get these API keys (FREE):
   VITE_OPENWEATHER_API_KEY=get_from_openweathermap.org
   VITE_MAPBOX_ACCESS_TOKEN=get_from_mapbox.com
   ```

### 3. Get Required API Keys

#### OpenWeather API (FREE)
1. Visit: https://openweathermap.org/api
2. Sign up for a free account
3. Generate API key
4. Add to `.env` as `VITE_OPENWEATHER_API_KEY`

#### Mapbox Token (FREE tier available)
1. Visit: https://www.mapbox.com/
2. Sign up for account
3. Create access token
4. Add to `.env` as `VITE_MAPBOX_ACCESS_TOKEN`

### 4. Supabase Database Setup

1. **Login to Supabase**: https://supabase.com/dashboard
2. **Open your project**: FloodWatch India Radar
3. **Go to SQL Editor**
4. **Run the schema**: Copy content from `supabase/schema.sql` and execute

### 5. Start Development Server

```bash
npm run dev
```

Your application will be available at: http://localhost:5173

## 🚀 Deployment Options

### Option 1: Lovable Platform (Recommended)
1. Visit: https://lovable.dev/projects/423deaed-4ef6-4d90-8a7d-c785e1fb211a
2. Click "Share" → "Publish"
3. Your app goes live instantly!

### Option 2: Manual Deployment
```bash
npm run build
# Deploy the 'dist' folder to your hosting platform
```

## 🔧 Troubleshooting

### Installation Issues:

**Node.js not found:**
```bash
# If 'node' command not found after installation:
# 1. Restart your computer
# 2. Ensure Node.js is in your PATH
# 3. Try running: refreshenv (in PowerShell)
```

**npm permission errors:**
```bash
# Run PowerShell as Administrator and try again
# Or use: npm config set registry https://registry.npmjs.org/
```

**Git not found:**
```bash
# After installing Git, restart terminal
# Check if Git is in PATH: echo $env:PATH
```

### Development Issues:

**Port already in use:**
```bash
# If port 5173 is busy:
npm run dev -- --port 3000
```

**Supabase connection errors:**
- Verify `.env` file has correct Supabase URL and key
- Check internet connection
- Ensure Supabase project is active

**Missing API keys:**
- Application will work with limited functionality
- Maps may not load without Mapbox token
- Weather data won't update without OpenWeather key

### Common Issues:

1. **Module not found errors**
   ```bash
   npm install
   npm run dev
   ```

2. **TypeScript errors**
   ```bash
   npm run build:dev
   ```

3. **Environment variables not working**
   - Ensure `.env` file is in root directory
   - Restart dev server after changes
   - Variables must start with `VITE_`

4. **Supabase connection issues**
   - Check your Supabase URL and key
   - Ensure database schema is applied
   - Check browser console for errors

## 📱 Features to Test

After setup, test these features:

### For Citizens:
- ✅ View real-time flood sensors on map
- ✅ Receive flood alerts and warnings
- ✅ Find emergency contacts
- ✅ Check weather information
- ✅ Report flood incidents

### For Emergency Responders:
- ✅ Monitor multiple sensors
- ✅ Manage alerts and warnings
- ✅ View detailed analytics
- ✅ Access evacuation data
- ✅ Coordinate emergency response

## 🔐 Security Notes

- Never commit API keys to version control
- Use environment variables for all sensitive data
- Keep `.env` file in `.gitignore`
- Regularly rotate API keys
- Use row-level security (RLS) in Supabase

## 💡 Next Steps

1. **First Time Setup**:
   - Download and install Node.js
   - Download and install Git
   - Clone or download this project
   - Run `npm install`
   - Configure `.env` file
   - Start development with `npm run dev`

2. **Development Workflow**:
   - Make changes to source files
   - Test in browser at localhost:5173
   - Use browser dev tools for debugging
   - Check console for errors

3. **When Ready to Deploy**:
   - Run `npm run build` to create production build
   - Use Lovable platform or deploy `dist` folder elsewhere

## 📞 Support

- **Documentation**: Check README.md for feature details
- **Issues**: Create GitHub issues for bugs
- **Deployment**: See DEPLOYMENT.md for hosting options

---

**Ready to start developing? Download Node.js from the links at the top and begin! 🚀**
- The `.env` file is already in `.gitignore`
- API keys in this example are for development only

## 📊 Database Schema

The database includes these main tables:
- `flood_sensors` - Sensor devices and locations
- `sensor_readings` - Real-time water level data
- `flood_alerts` - Emergency alerts and warnings
- `profiles` - User accounts and preferences
- `emergency_contacts` - Emergency service contacts
- `incident_reports` - User-generated incident reports
- `historical_floods` - Historical flood data
- `evacuation_routes` - Emergency evacuation paths

## 🆘 Support

If you encounter issues:

1. **Check the logs**: Browser console and terminal
2. **Verify environment**: All API keys are set
3. **Database**: Ensure Supabase schema is applied
4. **Dependencies**: Run `npm install` again
5. **Clean build**: Delete `node_modules` and reinstall

## 📈 Next Steps

After basic setup, consider:

1. **Add real sensor data** from government APIs
2. **Integrate SMS/Email notifications**
3. **Add multi-language support**
4. **Implement user authentication**
5. **Add offline capabilities**
6. **Connect to weather services**

---

**🎉 Congratulations! Your FloodWatch India Radar system is now ready to help keep India safe from floods.**
