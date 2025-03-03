import { FC, useEffect, useState } from 'react';
import * as Icons from '@assets/icons';
import { IconsType } from '@/types/icons';
import './Navbar.scss';

interface NavItemProps {
  icon: string;
  label: string;
  isActive: boolean;
  onClick: () => void;
}


const NavItem: FC<NavItemProps> = ({ icon, label, isActive, onClick }) => (
  <li 
    className={`navbar__item ${isActive ? 'navbar__item--active' : ''}`}
    onClick={onClick}
  >
    <a href="#" className="navbar__link">
      <img 
        src={(Icons as IconsType)[icon]} 
        alt={label} 
        className="navbar__icon" 
      />
      <span className="navbar__label">{label}</span>
    </a>
  </li>
);


const Navbar: FC = () => {
  const [active, setActive] = useState<number>(0);
  
  const navItems = [
    { icon: 'menu', label: 'Menu' },
    { icon: 'person', label: 'Profile' },
    { icon: 'balance', label: 'Orders' },
    { icon: 'settings', label: 'Settings' },
    { icon: 'email', label: 'Messages' },
    { icon: 'piechart', label: 'Analytics' },
    { icon: 'chat', label: 'Support' }
  ];

  return (
    <div className="navbar">
      <div className="navbar__logo">
        <h2>YumRush</h2>
      </div>
      <nav className="navbar__nav">
        <ul className="navbar__list">
          {navItems.map((item, index) => (
            <NavItem
              key={index}
              icon={item.icon}
              label={item.label}
              isActive={active === index}
              onClick={() => setActive(index)}
            />
          ))}
        </ul>
      </nav>
      <div className="navbar__footer">
        <p>© 2025 YumRush</p>
      </div>
    </div>
  );
};

export default Navbar;
