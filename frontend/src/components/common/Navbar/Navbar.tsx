import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import * as Icons from '@assets/icons';
import { IconsType } from '@/types/icons';
import { RootState } from '../../../redux/store';
import './Navbar.scss';

interface NavItemProps {
  icon: string;
  label: string;
  isActive: boolean;
  onClick: () => void;
  path?: string;
}

const NavItem: FC<NavItemProps> = ({ icon, label, isActive, onClick, path }) => (
  <li 
    className={`navbar__item ${isActive ? 'navbar__item--active' : ''}`}
    onClick={onClick}
  >
    <a href={path || "#"} className="navbar__link" onClick={(e) => path && e.preventDefault()}>
      <img 
        src={Icons[icon as keyof typeof Icons]} 
        alt={label} 
        className="navbar__icon" 
      />
      <span className="navbar__label">{label}</span>
    </a>
  </li>
);

const Navbar: FC = () => {
  const [active, setActive] = useState<number>(0);
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  
  const handleNavClick = (index: number, path?: string) => {
    setActive(index);
    if (path) {
      navigate(path);
    }
  };
  
  // Base navigation items
  let navItems = [
    { icon: 'menu', label: 'Menu', path: '/' },
    { icon: 'person', label: 'Profile', path: '/account/profile' },
    { icon: 'balance', label: 'Orders', path: '/account/orders' },
    { icon: 'settings', label: 'Settings', path: '/account/profile' },
  ];
  
  // Add admin dashboard for admin users
  if (user && user.isAdmin) {
    navItems = [
      ...navItems,
      { icon: 'piechart', label: 'Admin Panel', path: '/admin' },
    ];
  }
  
  // Add remaining items
  navItems = [
    ...navItems,
    { icon: 'email', label: 'Messages', path: '/messages' },
    { icon: 'chat', label: 'Support', path: '/support' },
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
              path={item.path}
              isActive={active === index}
              onClick={() => handleNavClick(index, item.path)}
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
