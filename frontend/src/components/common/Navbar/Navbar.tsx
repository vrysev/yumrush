import { FC, useEffect, useState } from 'react';
import * as Icons from '@assets/icons';
import './Navbar.scss';
import { IconsType } from '@/types/icons';

type NavItem = 'menu' | 'person' | 'balance' | 'settings' | 'email' | 'piechart' | 'chat';

interface ExpandButtonProps {
  expand: boolean;
  setExpand: (value: boolean) => void;
}

const ExpandButton: FC<ExpandButtonProps> = ({ expand, setExpand }) => (
  <button onClick={() => setExpand(!expand)} className="navbar__expand-btn">
    <img src={(Icons as IconsType)['expand']} alt="Toggle navigation" />
  </button>
);

const Navbar: FC = () => {
  const [active, setActive] = useState<number>(0);
  const [expand, setExpand] = useState<boolean>(true);
  const navItems: NavItem[] = ['menu', 'person', 'balance', 'settings', 'email', 'piechart', 'chat'];

  useEffect(() => {
    const updateViewportStatus = (): void => {
      setExpand(window.innerWidth > 1480);
    };

    updateViewportStatus();
    window.addEventListener('resize', updateViewportStatus);
    return () => window.removeEventListener('resize', updateViewportStatus);
  }, []);

  if (!expand) {
    return <ExpandButton expand={expand} setExpand={setExpand} />;
  }

  return (
    <div className="navbar">
      <nav className="navbar__nav">
        <ExpandButton expand={expand} setExpand={setExpand} />
        <ul className="navbar__list">
          {navItems.map((item, index) => (
            <li
              key={index}
              onClick={() => setActive(index)}
              className={`navbar__item ${active === index ? 'navbar__item--active' : ''}`}
            >
              <a href="#" className="navbar__link">
                <img 
                  src={(Icons as IconsType)[item]} 
                  alt={item} 
                  className="navbar__icon" 
                />
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
