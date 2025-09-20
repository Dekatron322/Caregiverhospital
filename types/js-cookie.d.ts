declare module "js-cookie" {
  export type CookieValue = string | undefined;

  export interface CookieAttributes {
    expires?: number | Date;
    path?: string;
    domain?: string;
    secure?: boolean;
    sameSite?: "strict" | "lax" | "none";
    // Allow arbitrary attributes to avoid over-constraining
    [key: string]: unknown;
  }

  export interface CookiesStatic {
    get(name: string): CookieValue;
    getJSON?(name: string): unknown;
    set(name: string, value: string, options?: CookieAttributes): string;
    remove(name: string, options?: CookieAttributes): void;
  }

  const Cookies: CookiesStatic;
  export default Cookies;
}
