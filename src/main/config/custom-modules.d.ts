declare module Express {
  interface Request {
    accountId?: string
  }
}

declare namespace NodeJS {
  interface ProcessEnv {
    PORT: string
    MONGO_URL: string
    NODE_ENV: 'development' | 'production'
  }
}
