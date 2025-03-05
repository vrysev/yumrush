import * as Icons from '../../../assets/icons/index.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchValue } from '../../../redux/slices/searchSlice';
import { logout } from '../../../redux/slices/authSlice';
import { debounce } from 'lodash';
import './Header.scss';
import { IconsType } from '@/types/icons';
import { useState, useRef, useEffect, useCallback, MouseEvent, ChangeEvent, FC } from 'react';
import AuthModal from '../../auth/AuthModal';
import CartButton from '../../cart/CartButton';
import CartSidebar from '../../cart/CartSidebar';
import { RootState, AppDispatch } from '../../../redux/store';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

interface HeaderProps {
  showSearch?: boolean;
}

const Header: FC<HeaderProps> = ({ showSearch = true }) => {
  const [value, setValue] = useState<string>('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  // No longer need search open state as it's always visible
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleClearSearch = (event: MouseEvent<HTMLDivElement>): void => {
    event.preventDefault();
    event.stopPropagation();
    dispatch(setSearchValue(''));
    setValue('');
  };

  const debounceSearch = useCallback(
    debounce((str: string): void => {
      dispatch(setSearchValue(str));
    }, 500),
    [dispatch]
  );

  const handleSearch = (event: ChangeEvent<HTMLInputElement>): void => {
    setValue(event.target.value);
    debounceSearch(event.target.value);
  };
  
  const handleSearchSubmit = (event: React.FormEvent): void => {
    event.preventDefault();
    dispatch(setSearchValue(value));
    // If we're on a different page, navigate to home to see search results
    if (location.pathname !== '/') {
      navigate('/');
    }
  };

  const handleLogout = (): void => {
    dispatch(logout());
    setIsUserDropdownOpen(false);
  };
  
  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
    setIsNotificationsOpen(false);
  };
  
  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    setIsUserDropdownOpen(false);
  };
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsUserDropdownOpen(false);
    setIsNotificationsOpen(false);
  };
  
  const navigateTo = (path: string) => {
    navigate(path);
    setIsUserDropdownOpen(false);
  };

  // Mock notifications - in a real app, these would come from an API
  const notifications = [
    { id: 1, message: "Your order has been delivered", isRead: false, time: "10 min ago" },
    { id: 2, message: "New promocode available: RUSH25", isRead: true, time: "2 hours ago" },
    { id: 3, message: "Rate your last order", isRead: true, time: "Yesterday" }
  ];

  // Menu items
  const mainNavItems = [
    { name: 'MENU', path: '/', icon: 'menu' },
    { name: 'ABOUT', path: '/about', icon: 'menu' },
    { name: 'CONTACT`', path: '/contact', icon: 'email' }
  ];
  
  // Profile settings items
  const profileItems = [
    { name: 'Profile', path: '/account/profile', icon: 'person' },
    { name: 'My Orders', path: '/account/orders', icon: 'balance' },
    { name: 'Settings', path: '/settings', icon: 'settings' },
  ];
  
  // Admin items
  const adminItems = [
    { name: 'Dashboard', path: '/admin', icon: 'piechart' },
    { name: 'Products', path: '/admin/products', icon: 'menu' },
    { name: 'Orders', path: '/admin/orders', icon: 'balance' },
    { name: 'Users', path: '/admin/users', icon: 'person' }
  ];

  return (
    <header className="header">
      <div className="container">
        <div className="header__content">
          <div className="header__logo">
            <a href="/" onClick={(e) => { 
              e.preventDefault(); 
              navigate('/');
            }}>
              <h1>YUMRUSH</h1>
            </a>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="header__nav">
            <ul className="header__nav-list">
              {mainNavItems.map((item, index) => (
                <li key={index} className="header__nav-item">
                  <a 
                    href={item.path} 
                    className={`header__nav-link ${location.pathname === item.path ? 'active' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(item.path);
                    }}
                  >
                    {item.name}
                  </a>
                </li>
              ))}
              {user?.isAdmin && (
                <li className="header__nav-item header__nav-item--admin">
                  <a 
                    href="/admin" 
                    className={`header__nav-link ${location.pathname.startsWith('/admin') ? 'active' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate('/admin');
                    }}
                  >
                    ADMIN
                  </a>
                </li>
              )}
            </ul>
          </nav>
          
          <div className="header__actions">
          <div className="header__search">
        <form onSubmit={handleSearchSubmit} className="search">
            <button 
              type="submit" 
              className="search__icon-btn"
              aria-label="Search"
            >
              <img 
                src={(Icons as IconsType)['search']} 
                alt="Search" 
                className="search__icon" 
              />
            </button>
            <input
              type="search"
              className="search__input"
              name="desktop-search"
              placeholder="Search products..."
              value={value}
              onChange={handleSearch}
            />
            {value && (
              <button 
                type="button"
                className="search__clear" 
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(setSearchValue(''));
                  setValue('');
                }}
              >
                <img src={(Icons as IconsType)['close']} alt="Clear" />
              </button>
            )}
        </form>
        </div>
            
            <div className="header__icon-wrapper" ref={notificationsRef}>
              <button 
                className="header__icon-btn" 
                onClick={toggleNotifications}
                aria-label="Notifications"
              >
                <img src={(Icons as IconsType)['notification']} alt="Notifications" className="header__icon" />
                {notifications.some(n => !n.isRead) && (
                  <span className="header__notification-badge"></span>
                )}
              </button>
              
              {isNotificationsOpen && (
                <div className="header__dropdown header__notifications">
                  <h3 className="header__dropdown-title">Notifications</h3>
                  <ul className="header__notifications-list">
                    {notifications.length > 0 ? notifications.map(notification => (
                      <li 
                        key={notification.id} 
                        className={`header__notification-item ${!notification.isRead ? 'header__notification-item--unread' : ''}`}
                      >
                        <p className="header__notification-message">{notification.message}</p>
                        <span className="header__notification-time">{notification.time}</span>
                      </li>
                    )) : (
                      <li className="header__notification-item header__notification-item--empty">
                        No notifications
                      </li>
                    )}
                  </ul>
                  <div className="header__dropdown-footer">
                    <button className="header__dropdown-btn">Mark all as read</button>
                  </div>
                </div>
              )}
            </div>
            
            <CartButton />
            
            {/* Desktop Only User Icon - Hide on mobile */}
            <div className="header__icon-wrapper header__icon-wrapper--desktop" ref={userDropdownRef}>
              {isAuthenticated ? (
                <>
                  <button 
                    className="header__icon-btn" 
                    onClick={toggleUserDropdown}
                    aria-label="User Account"
                  >
                    <div className="header__user-avatar header__user-avatar--small">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                  </button>
                  
                  {isUserDropdownOpen && (
                    <div className="header__dropdown header__user-dropdown">
                      <div className="header__user-info">
                        <div className="header__user-avatar">
                          {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="header__user-details">
                          <p className="header__user-name">{user?.name}</p>
                          <p className="header__user-email">{user?.email}</p>
                        </div>
                      </div>
                      
                      <ul className="header__dropdown-list">
                        {profileItems.map((item, index) => (
                          <li key={index} className="header__dropdown-item">
                            <button 
                              onClick={() => navigateTo(item.path)} 
                              className={`header__dropdown-link ${location.pathname === item.path ? 'header__dropdown-link--active' : ''}`}
                            >
                              <img src={(Icons as IconsType)[item.icon]} alt="" className="header__dropdown-icon" />
                              {item.name}
                            </button>
                          </li>
                        ))}
                        
                        {user?.isAdmin && (
                          <>
                            <li className="header__dropdown-divider">
                              <span>Admin</span>
                            </li>
                            {adminItems.map((item, index) => (
                              <li key={index} className="header__dropdown-item">
                                <button 
                                  onClick={() => navigateTo(item.path)} 
                                  className={`header__dropdown-link ${location.pathname === item.path ? 'header__dropdown-link--active' : ''}`}
                                >
                                  <img src={(Icons as IconsType)[item.icon]} alt="" className="header__dropdown-icon" />
                                  {item.name}
                                </button>
                              </li>
                            ))}
                          </>
                        )}
                      </ul>
                      
                      <div className="header__dropdown-footer">
                        <button onClick={handleLogout} className="header__logout-btn">
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="header__icon-btn"
                  aria-label="Login"
                >
                  <img src={(Icons as IconsType)['person']} alt="Login" className="header__icon" />
                </button>
              )}
            </div>
            
            {/* Mobile Menu Toggle */}
            <button 
              className="header__mobile-toggle"
              onClick={toggleMobileMenu}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              <span className={`header__mobile-icon ${isMobileMenuOpen ? 'header__mobile-icon--open' : ''}`}></span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <div className={`header__mobile-menu ${isMobileMenuOpen ? 'header__mobile-menu--open' : ''}`} ref={mobileMenuRef}>
        <div className="header__mobile-search">
        <form onSubmit={handleSearchSubmit} className="search search--mobile">
            <button 
              type="submit" 
              className="search__icon-btn"
              aria-label="Search"
            >
              <img 
                src={(Icons as IconsType)['search']} 
                alt="Search" 
                className="search__icon" 
              />
            </button>
            <input
              type="search"
              className="search__input"
              name="mobile-search"
              placeholder="Search products..."
              value={value}
              onChange={handleSearch}
            />
            {value && (
              <button 
                type="button"
                className="search__clear" 
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(setSearchValue(''));
                  setValue('');
                }}
              >
                <img src={(Icons as IconsType)['close']} alt="Clear" />
              </button>
            )}
        </form>
        </div>
        
        <div className="header__mobile-content">
          {isAuthenticated ? (
            <div className="header__mobile-user">
              <div className="header__user-avatar">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="header__user-details">
                <p className="header__user-name">{user?.name}</p>
                <p className="header__user-email">{user?.email}</p>
              </div>
            </div>
          ) : (
            <div className="header__mobile-auth">
              <button 
                className="header__mobile-btn header__mobile-btn--primary"
                onClick={() => {
                  setIsAuthModalOpen(true);
                  setIsMobileMenuOpen(false);
                }}
              >
                Sign In
              </button>
              <button 
                className="header__mobile-btn header__mobile-btn--outline"
                onClick={() => {
                  setIsAuthModalOpen(true);
                  setIsMobileMenuOpen(false);
                }}
              >
                Sign Up
              </button>
            </div>
          )}
          
          <nav className="header__mobile-nav">
            <h3 className="header__mobile-heading">Menu</h3>
            <ul className="header__mobile-list">
              {mainNavItems.map((item, index) => (
                <li key={index} className="header__mobile-item">
                  <a 
                    href={item.path} 
                    className={`header__mobile-link ${location.pathname === item.path ? 'active' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(item.path);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <img src={(Icons as IconsType)[item.icon]} alt="" className="header__mobile-icon-img" />
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
            
            {isAuthenticated && (
              <>
                <h3 className="header__mobile-heading">Profile</h3>
                <ul className="header__mobile-list">
                  {profileItems.map((item, index) => (
                    <li key={index} className="header__mobile-item">
                      <a 
                        href={item.path} 
                        className={`header__mobile-link ${location.pathname === item.path ? 'active' : ''}`}
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(item.path);
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <img src={(Icons as IconsType)[item.icon]} alt="" className="header__mobile-icon-img" />
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            )}
            
            {user?.isAdmin && (
              <>
                <h3 className="header__mobile-heading">Admin</h3>
                <ul className="header__mobile-list">
                  {adminItems.map((item, index) => (
                    <li key={index} className="header__mobile-item">
                      <a 
                        href={item.path} 
                        className={`header__mobile-link ${location.pathname === item.path ? 'active' : ''}`}
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(item.path);
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <img src={(Icons as IconsType)[item.icon]} alt="" className="header__mobile-icon-img" />
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </nav>
          
          {isAuthenticated && (
            <div className="header__mobile-footer">
              <button onClick={handleLogout} className="header__logout-btn header__logout-btn--full">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
      
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
      
      <CartSidebar />
    </header>
  );
};

export default Header;
