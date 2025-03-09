declare module '@assets/icons' {
  export const CartIcon: React.FC;
  export const CloseIcon: React.FC;
  export const MenuIcon: React.FC;
  export const SearchIcon: React.FC;
  export const SortIcon: React.FC;
  export const PersonIcon: React.FC;
  export const NotificationIcon: React.FC;
  export const SettingsIcon: React.FC;
  export const BalanceIcon: React.FC;
  export const PieChartIcon: React.FC;
  export const ChatIcon: React.FC;
  export const EmailIcon: React.FC;
}

declare module '@assets/img' {
  export const Pizza: React.FC;
  export const Fries: React.FC;
  export const Sandwich: React.FC;
  export const Pack: React.FC;
}

declare module '@components/products/SkeletonProduct' {
  const SkeletonProduct: React.FC;
  export default SkeletonProduct;
}

declare module '*.svg' {
  import React = require('react');
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.scss' {
  const content: { [className: string]: string };
  export default content;
}

declare module '@pages/Home' {
  import React from 'react';
  const Home: React.FC;
  export default Home;
}

declare interface ImportMeta {
  env: {
    VITE_API_URL: string;
    MODE: string;
    BASE_URL: string;
    PROD: boolean;
    DEV: boolean;
  };
}