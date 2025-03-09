// Global type definitions for tests and external modules

// Jest globals
declare global {
  // Jest testing functions
  const describe: (name: string, fn: () => void) => void;
  const it: (name: string, fn: () => void) => void;
  const test: (name: string, fn: () => void) => void;
  const expect: jest.Expect;
  const beforeEach: (fn: () => void) => void;
  const afterEach: (fn: () => void) => void;
  const beforeAll: (fn: () => void) => void;
  const afterAll: (fn: () => void) => void;
  const jest: any;

  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveTextContent(text: string): R;
      // Add other custom matchers as needed
    }
  }

  namespace NodeJS {
    interface Global {
      expect: jest.Expect;
    }
  }
}

// Declare missing modules
declare module 'supertest' {
  import { Response } from 'superagent';
  
  function supertest(app: any): supertest.SuperTest<supertest.Test>;
  
  namespace supertest {
    interface SuperTest<T extends Test> {
      get(url: string): T;
      post(url: string): T;
      put(url: string): T;
      delete(url: string): T;
      patch(url: string): T;
    }
    
    interface Test extends Promise<Response> {
      send(data: any): this;
      set(field: string, val: string): this;
      set(field: object): this;
      expect(status: number): this;
      expect(status: number, body: any): this;
      expect(body: any): this;
      expect(field: string, val: string): this;
      field(name: string, val: string): this;
      attach(field: string, file: string | Buffer, filename?: string): this;
      auth(user: string, pass: string): this;
      withCredentials(): this;
      end(callback?: (err: Error, res: Response) => void): this;
    }
  }
  
  export = supertest;
}

declare module 'jsonwebtoken' {
  export interface JwtPayload {
    id?: string;
    [key: string]: any;
  }
  
  export function sign(
    payload: string | Buffer | object,
    secretOrPrivateKey: string | Buffer,
    options?: SignOptions
  ): string;
  
  export function verify(
    token: string,
    secretOrPublicKey: string | Buffer,
    options?: VerifyOptions & { complete?: false }
  ): JwtPayload;
  
  export interface SignOptions {
    algorithm?: string;
    keyid?: string;
    expiresIn?: string | number;
    notBefore?: string | number;
    audience?: string | string[];
    subject?: string;
    issuer?: string;
    jwtid?: string;
    mutatePayload?: boolean;
    noTimestamp?: boolean;
    header?: object;
    encoding?: string;
  }
  
  export interface VerifyOptions {
    algorithms?: string[];
    audience?: string | RegExp | Array<string | RegExp>;
    clockTimestamp?: number;
    clockTolerance?: number;
    complete?: boolean;
    issuer?: string | string[];
    ignoreExpiration?: boolean;
    ignoreNotBefore?: boolean;
    jwtid?: string;
    nonce?: string;
    subject?: string;
    maxAge?: string | number;
  }
}

// This is needed to make the file a module
export {};