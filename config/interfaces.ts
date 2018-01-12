export interface Config {
  appName: string
  env: "dev" | "production" | "test" | "integration"
  database: {
    username: string
    password: string
    database: string
    host: string
    dialect: string
  }
  redis: {
    namespace: string
    host: string
    port: number
  }
  web: {
    port: string
    baseUrl: string
  }
}