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

declare module '@assets/icons' {
  const icons: any;
  export const CartIcon: any;
  export const CloseIcon: any;
  export const MenuIcon: any;
  export const SearchIcon: any;
  export const SortIcon: any;
  export const PersonIcon: any;
  export const NotificationIcon: any;
  export const SettingsIcon: any;
  export const BalanceIcon: any;
  export const PieChartIcon: any;
  export const ChatIcon: any;
  export const EmailIcon: any;
  export default icons;
}

declare module '@assets/icons/index.jsx' {
  export * from '@assets/icons';
}

declare module '@assets/img' {
  const images: any;
  export const Pizza: any;
  export const Fries: any;
  export const Sandwich: any;
  export const Pack: any;
  export default images;
}

declare module '@assets/img/index.jsx' {
  export * from '@assets/img';
}

declare module '@components/products/SkeletonProduct' {
  const SkeletonProduct: React.FC<any>;
  export default SkeletonProduct;
}

declare module '@components/products/SkeletonProduct.jsx' {
  export * from '@components/products/SkeletonProduct';
}