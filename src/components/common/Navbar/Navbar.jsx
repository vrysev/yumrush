import { useEffect, useState } from 'react';
import * as Icons from '../../../assets/icons';
import './Navbar.scss';

function Navbar() {
  const [active, setActive] = useState(0);
  const [expand, setExpand] = useState(true);
  const navItems = ['menu', 'person', 'balance', 'settings', 'email', 'piechart', 'chat'];

  useEffect(() => {
    const updateViewportStatus = () => {
      setExpand(window.innerWidth > 1480);
    };

    updateViewportStatus();
    window.addEventListener('resize', updateViewportStatus);
    return () => window.removeEventListener('resize', updateViewportStatus);
  }, []);

  const ExpandButton = () => (
    <button onClick={() => setExpand(!expand)} className="navbar__expand-btn">
      <img src={Icons['expand']} alt="Toggle navigation" />
    </button>
  );

  if (!expand) {
    return <ExpandButton />;
  }

  return (
    <div className="navbar">
      <nav className="navbar__nav">
        <ExpandButton />
        <ul className="navbar__list">
          {navItems.map((item, index) => (
            <li
              key={index}
              onClick={() => setActive(index)}
              className={`navbar__item ${active === index ? 'navbar__item--active' : ''}`}
            >
              <a href="#" className="navbar__link">
                <img src={Icons[item]} alt={item} className="navbar__icon" />
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export default Navbar;
