# FloodWatch India Radar 🌊

A real-time flood monitoring and emergency response system for India, providing critical flood data, alerts, and evacuation assistance to citizens and emergency responders.

## 🚀 Features

- **Real-time Flood Monitoring**: Live data from flood sensors across India
- **Interactive Map**: Dynamic mapping with flood zones, affected areas, and evacuation routes
- **Emergency Alerts**: Instant notifications for flood warnings and safety updates
- **Dual Interface**: Separate views for citizens and emergency responders
- **Weather Integration**: Current weather and forecast data from IMD and OpenWeather
- **Emergency Contacts**: Quick access to local emergency services
- **Evacuation Routes**: AI-powered evacuation route suggestions
- **Historical Data**: Access to past flood data for better preparedness

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Library**: shadcn/ui, Tailwind CSS
- **Mapping**: Leaflet, React-Leaflet
- **Backend**: Supabase (PostgreSQL, Real-time subscriptions)
- **APIs**: OpenWeather API, India Meteorological Department
- **State Management**: TanStack Query
- **Authentication**: Supabase Auth

## 🚦 Getting Started

### Prerequisites

- Node.js (v18 or higher) or Bun
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Ansh26480/floodwatch-india-radar.git
cd floodwatch-india-radar
```

2. **Install dependencies**
```bash
# Using npm
npm install

# Or using bun
bun install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` and add your API keys:
- Get OpenWeather API key from [OpenWeatherMap](https://openweathermap.org/api)
- Get Mapbox token from [Mapbox](https://www.mapbox.com/)
- Supabase credentials are already configured

4. **Start the development server**
```bash
# Using npm
npm run dev

# Or using bun
bun run dev
```

5. **Open your browser**
Navigate to `http://localhost:5173`

## 🌐 Deployment

### Lovable Platform (Recommended)
This project is configured for deployment on [Lovable](https://lovable.dev). Simply:
1. Visit your [Lovable Project](https://lovable.dev/projects/423deaed-4ef6-4d90-8a7d-c785e1fb211a)
2. Click Share → Publish
3. Your app will be live!

### Manual Deployment
```bash
npm run build
# Deploy the dist/ folder to your hosting platform
```

## 📱 Usage

### For Citizens
- View real-time flood conditions in your area
- Receive emergency alerts and warnings
- Find safe evacuation routes
- Access emergency contact numbers
- Report flood incidents with photos

### For Emergency Responders
- Monitor multiple flood sensors simultaneously
- Manage evacuation operations
- Coordinate emergency response
- Access detailed analytics and reports
- Update alert systems

## 🗺️ API Integrations

- **OpenWeather API**: Weather data and forecasts
- **India Meteorological Department**: Official weather bulletins
- **Supabase**: Real-time database and authentication
- **Emergency Services API**: Local emergency contacts

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Emergency Contacts

- **National Emergency**: 112
- **Fire Brigade**: 101
- **Police**: 100
- **Ambulance**: 108
- **Disaster Management**: 1077

## 🙏 Acknowledgments

- India Meteorological Department for weather data
- National Disaster Management Authority
- OpenStreetMap contributors
- All emergency responders keeping India safe

---

**⚡ Built with ❤️ for India's safety and disaster preparedness**
