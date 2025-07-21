/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_OPENWEATHER_API_KEY: string
  readonly VITE_IMD_API_KEY: string
  readonly VITE_MAPBOX_ACCESS_TOKEN: string
  readonly VITE_EMERGENCY_API_URL: string
  readonly VITE_DISASTER_API_URL: string
  readonly VITE_APP_NAME: string
  readonly VITE_APP_VERSION: string
  readonly VITE_APP_ENV: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
