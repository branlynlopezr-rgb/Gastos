/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly Link?: string
  readonly Anon_Public?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
