// Тестовые глобальные переменные
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveTextContent(text: string): R;
    }
  }

  namespace NodeJS {
    interface Global {
      expect(value: any): jest.Expect;
    }
  }

  const describe: (name: string, fn: () => void) => void;
  const it: (name: string, fn: () => void) => void;
  const test: (name: string, fn: () => void) => void;
  const beforeEach: (fn: () => void) => void;
  const afterEach: (fn: () => void) => void;
  const beforeAll: (fn: () => void) => void;
  const afterAll: (fn: () => void) => void;
  const expect: jest.Expect;
  const jest: any;
}

// Тестовые библиотеки
declare module '@testing-library/react' {
  export const render: any;
  export const screen: any;
  export const fireEvent: any;
  export const waitFor: any;
  export const act: any;
}

declare module 'redux-mock-store' {
  const configureStore: any;
  export default configureStore;
}

export {};