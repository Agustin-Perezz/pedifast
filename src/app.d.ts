declare module '*.svg' {
  const src: string;
  export default src;
}

declare global {
  namespace App {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface Locals {}
  }
}

export {};
