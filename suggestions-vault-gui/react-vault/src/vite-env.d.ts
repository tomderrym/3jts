/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_LIVE_API?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
