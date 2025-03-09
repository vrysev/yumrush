# YumRush - Food Ordering Application

## Tech Stack

- React 18 🚀
- TypeScript 🔷
- SCSS 💅
- Redux Toolkit ⚛️
- Axios 🕸️
- Vite ⚡️
- i18next 🌐

## Features

- Modern React with TypeScript
- Fully responsive design with SCSS
- Pixel-perfect designs with no em/rem-based scaling issues
- Redux state management
- API integration with the backend
- Product catalog with search and filter functionality
- User authentication and profile management
- Shopping cart with persistent state
- Secure checkout process
- Order history and tracking
- Multi-language support (i18n)
- Cookie consent management

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
# or
yarn install
```

2. Start the development server:

```bash
npm run dev
# or
yarn dev
```

The application will be available at http://localhost:3000.

## Building for Production

```bash
npm run build
# or
yarn build
```

## Project Structure

```
frontend/
├── public/              # Static files
├── src/
│   ├── api/             # API integration services
│   ├── assets/          # Images, icons, and other assets
│   ├── components/      # Reusable components
│   │   ├── auth/        # Authentication components
│   │   ├── cart/        # Shopping cart components
│   │   ├── categories/  # Product category components
│   │   └── common/      # Shared UI components
│   ├── pages/           # Page components
│   │   ├── Account/     # User account pages
│   │   └── Admin/       # Admin dashboard pages
│   ├── redux/           # Redux store and slices
│   │   └── slices/      # Feature-specific Redux slices
│   ├── styles/          # Global styles and SCSS mixins/variables
│   │   ├── abstracts/   # Variables, mixins, and functions
│   │   ├── base/        # Base styles
│   │   ├── layout/      # Layout styles
│   │   └── pages/       # Page-specific styles
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions
│   ├── i18n.ts          # Internationalization configuration
│   ├── App.tsx          # Main application component
│   └── main.tsx         # Application entry point
└── package.json         # Dependencies and scripts
```

![Screenshot of YumRush](https://github.com/vrysev/yumrush/assets/109638459/65db2205-b4ae-4d6c-9ed3-ac5151c913ee)

Originally created by Vadim Rysev, modernized with proper SCSS and TypeScript.
