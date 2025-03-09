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
  
  const jest: {
    fn(): jest.Mock;
    fn<T>(): jest.Mock<T>;
    fn<T, Y extends any[]>(implementation?: (...args: Y) => T): jest.Mock<T, Y>;
    spyOn: any;
    mock: any;
    resetModules: any;
    clearAllMocks: any;
    resetAllMocks: any;
    restoreAllMocks: any;
  };

  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveTextContent(text: string): R;
      // Add other custom matchers as needed
    }
    
    // Add Mock interface
    interface Mock<T = any, Y extends any[] = any[]> {
      (...args: Y): T;
      mockImplementation(fn: (...args: Y) => T): this;
      mockReturnValue(value: T): this;
      mockReturnValueOnce(value: T): this;
      mockResolvedValue(value: T): this;
      mockResolvedValueOnce(value: T): this;
      mockRejectedValue(value: any): this;
      mockRejectedValueOnce(value: any): this;
      mockReturnThis(): this;
      mockClear(): this;
      mockReset(): this;
      mockRestore(): this;
      mockName(name: string): this;
      getMockName(): string;
      mock: {
        calls: Y[];
        instances: T[];
        invocationCallOrder: number[];
        results: { type: "return" | "throw"; value: any }[];
      };
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
  import * as superagent from 'superagent';
  
  interface Response extends superagent.Response {
    [key: string]: any;
  }
  
  interface Request extends superagent.SuperAgentRequest {
    [key: string]: any;
  }
  
  function supertest(app: any): supertest.SuperTest<supertest.Test>;
  
  namespace supertest {
    interface SuperTest<T> {
      get(url: string): T;
      post(url: string): T;
      put(url: string): T;
      delete(url: string): T;
      patch(url: string): T;
      [key: string]: any;
    }
    
    interface Test extends superagent.SuperAgentRequest {
      send(data: any): this;
      set(field: string, val: string): this;
      set(field: object): this;
      query(params: object): this;
      accept(type: string): this;
      expect(status: number): this;
      expect(status: number, body: any): this;
      expect(body: any): this;
      expect(field: string, val: string): this;
      field(name: string, val: string): this;
      attach(field: string, file: string | Buffer, filename?: string): this;
      auth(user: string, pass: string): this;
      withCredentials(): this;
      end(callback?: (err: Error, res: Response) => void): this;
      [key: string]: any;
    }
  }
  
  export = supertest;
}

declare module 'jsonwebtoken' {
  export interface JwtPayload {
    id?: string;
    exp?: number;
    iat?: number;
    [key: string]: any;
  }
  
  export interface TokenPayload {
    id: string;
    [key: string]: any;
  }
  
  export interface VerifyResult extends JwtPayload {
    [key: string]: any;
  }
  
  export interface DecodeResult {
    [key: string]: any;
    header: {
      alg: string;
      typ?: string;
      [key: string]: any;
    };
    payload: JwtPayload;
    signature: string;
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
  
  export function verify(
    token: string,
    secretOrPublicKey: string | Buffer,
    options?: VerifyOptions & { complete: true }
  ): DecodeResult;
  
  export function decode(
    token: string,
    options?: DecodeOptions & { complete?: false }
  ): JwtPayload | null;
  
  export function decode(
    token: string,
    options?: DecodeOptions & { complete: true }
  ): DecodeResult | null;
  
  export interface SignOptions {
    algorithm?: string | undefined;
    keyid?: string | undefined;
    expiresIn?: string | number | undefined;
    notBefore?: string | number | undefined;
    audience?: string | string[] | undefined;
    subject?: string | undefined;
    issuer?: string | undefined;
    jwtid?: string | undefined;
    mutatePayload?: boolean | undefined;
    noTimestamp?: boolean | undefined;
    header?: object | undefined;
    encoding?: string | undefined;
  }
  
  export interface VerifyOptions {
    algorithms?: string[] | undefined;
    audience?: string | RegExp | Array<string | RegExp> | undefined;
    clockTimestamp?: number | undefined;
    clockTolerance?: number | undefined;
    complete?: boolean | undefined;
    issuer?: string | string[] | undefined;
    ignoreExpiration?: boolean | undefined;
    ignoreNotBefore?: boolean | undefined;
    jwtid?: string | undefined;
    nonce?: string | undefined;
    subject?: string | undefined;
    maxAge?: string | number | undefined;
  }
  
  export interface DecodeOptions {
    complete?: boolean | undefined;
    json?: boolean | undefined;
  }
}

// This is needed to make the file a module
export {};