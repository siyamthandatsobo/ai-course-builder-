/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL: string
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
VITE_API_URL=https://coursebuilderai.fly.dev
