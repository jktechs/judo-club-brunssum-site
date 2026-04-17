export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SESSION_SECRET: string | undefined;
      EMAIL_PASSWORD: string | undefined;
      HOSTNAME: string | undefined;
      GOOGLE_SECRET: string | undefined;
    }
  }
}