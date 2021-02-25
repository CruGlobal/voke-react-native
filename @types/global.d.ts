export {};

declare global {
  namespace NodeJS {
    interface Global {
      LOG: () => void;
      WARN: () => void;
    }
  }
}
