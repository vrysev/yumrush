require('@testing-library/jest-dom');

// Mock the i18n import
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: {
      changeLanguage: jest.fn(),
      language: 'en',
    },
  }),
  Trans: ({ children }) => children,
  initReactI18next: {
    type: '3rdParty',
    init: jest.fn(),
  },
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock SVG import
jest.mock('../src/assets/icons/index.jsx', () => ({
  CartIcon: 'cart-icon',
  CloseIcon: 'close-icon',
  MenuIcon: 'menu-icon',
  SearchIcon: 'search-icon',
  SortIcon: 'sort-icon',
}), { virtual: true });
