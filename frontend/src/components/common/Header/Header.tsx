import * as Icons from '../../../assets/icons/index.jsx';
import * as Images from '@assets/img';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchValue } from '../../../redux/slices/searchSlice';
import { logout } from '../../../redux/slices/authSlice';
import { setActiveCategory } from '../../../redux/slices/sortSlice';
import { debounce } from 'lodash';
import './Header.scss';
import { IconsType, ImagesType } from '@/types/icons';
import { useState, useRef, useEffect, useCallback, MouseEvent, ChangeEvent, FC } from 'react';
import AuthModal from '../../auth/AuthModal';
import CartButton from '../../cart/CartButton';
import CartSidebar from '../../cart/CartSidebar';
import { RootState, AppDispatch } from '../../../redux/store';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Categories, { CATEGORIES } from '../../categories/Categories';
import { useTranslation } from 'react-i18next';

interface HeaderProps {
  showSearch?: boolean;
}

// Use imported ImagesType from icons.ts

const Header: FC<HeaderProps> = ({ showSearch = true }) => {
  const { t } = useTranslation();
  const { i18n } = useTranslation();
  const [value, setValue] = useState<string>('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [showNavigation, setShowNavigation] = useState<boolean>(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState<boolean>(false);
  
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { category } = useSelector((state: RootState) => state.sort);

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
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchExpanded(false);
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
  
  // Add scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      // At what scroll position should we show the categories in header
      // This should be just after the hero section ends (around 500px)
      const scrollThreshold = 650;
      
      if (window.scrollY > scrollThreshold) {
        setIsScrolled(true);
      } else {
        // When scrolling back to top, reset the header view
        if (isScrolled) {
          // Reset all states when scrolling back to top
          setShowNavigation(false);
          setIsMobileMenuOpen(false);
          setIsSearchExpanded(false);
        }
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isScrolled]);

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
  
  // Toggle between categories and navigation in header when scrolled
  const toggleHeaderView = () => {
    if (isScrolled && window.innerWidth >= 768) {
      // Simple toggle between showing categories or navigation
      setShowNavigation(!showNavigation);
      setIsUserDropdownOpen(false);
      setIsNotificationsOpen(false);
    } else if (window.innerWidth < 768) {
      // On mobile, just open the menu
      openMobileMenu();
    }
  };
  
  // Switch to showing navigation (for search button)
  const showNavigationView = () => {
    setShowNavigation(true);
  };
  
  // Open mobile menu specifically for mobile devices
  const openMobileMenu = () => {
    setIsMobileMenuOpen(true);
    setIsUserDropdownOpen(false);
    setIsNotificationsOpen(false);
  };
  
  // Close mobile menu
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };
  
  const navigateTo = (path: string) => {
    navigate(path);
    setIsUserDropdownOpen(false);
  };
  
  // Handle category click for mobile menu
  const handleCategoryClick = (index: number, categoryName: string): void => {
    dispatch(setActiveCategory(index));
    
    // Scroll to category section
    const sectionElement = document.getElementById(`section-${categoryName.toLowerCase()}`);
    if (sectionElement) {
      sectionElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Mock notifications - in a real app, these would come from an API
  const notifications = [
    { id: 1, message: "Your order has been delivered", isRead: false, time: "10 min ago" },
    { id: 2, message: "New promocode available: RUSH25", isRead: true, time: "2 hours ago" },
    { id: 3, message: "Rate your last order", isRead: true, time: "Yesterday" }
  ];

  // Menu items
  const mainNavItems = [
    { name: t('MENU'), path: '/', icon: 'menu' },
    { name: t('ABOUT'), path: '/about', icon: 'menu' },
    { name: t('CONTACT'), path: '/contact', icon: 'email' }
  ];
  
  // Profile settings items
  const profileItems = [
    { name: t('Profile'), path: '/account/profile', icon: 'person' },
    { name: t('My Orders'), path: '/account/orders', icon: 'balance' },
    { name: t('Settings'), path: '/settings', icon: 'settings' },
  ];
  
  // Admin items
  const adminItems = [
    { name: t('Dashboard'), path: '/admin', icon: 'piechart' },
    { name: t('Products'), path: '/admin/products', icon: 'menu' },
    { name: t('Orders'), path: '/admin/orders', icon: 'balance' },
    { name: t('Users'), path: '/admin/users', icon: 'person' }
  ];

  // Toggle search expanded state
  const toggleSearch = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSearchExpanded(!isSearchExpanded);
    
    // When expanding search, make sure navigation is shown if we're scrolled
    if (!isSearchExpanded && isScrolled) {
      setShowNavigation(true);
    }
  };
  
  return (
    <header 
      ref={headerRef} 
      className={`header ${isScrolled ? 'header--scrolled' : ''} ${showNavigation ? 'show-nav' : ''}`}
    >
      <div className="container">
        <div className="header__content">
          <div className="header__logo">
            <a href="/" onClick={(e) => { 
              e.preventDefault(); 
              navigate('/');
            }}>
              <h1>{t('appName')}</h1>
            </a>
          </div>
          
          {/* Desktop Navigation - Hidden when scrolled */}
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
                    {t('ADMIN')}
                  </a>
                </li>
              )}
            </ul>
          </nav>
          
          {/* Categories in header - Only visible when scrolled */}
          <Categories mode="header" onToggleMobileMenu={toggleHeaderView} />
          
          <div className="header__actions">
            {/* Toggle between Categories/Navigation when scrolled */}
          {isScrolled && (
            <button 
                className="header__nav-toggle"
                onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleHeaderView();
                }}
                aria-label={showNavigation ? "Show Categories" : "Show Navigation"}
                title={showNavigation ? "Show Categories" : "Show Navigation"}
            >
                <span className={`header__toggle-icon ${showNavigation ? 'header__toggle-icon--open' : ''}`}></span>
            </button>
          )}
          {/* Search Icon Button - Always visible */}
          <div className={`header__search ${isSearchExpanded ? 'header__search--expanded' : ''}`} ref={searchRef}>
            <button 
              className="header__search-icon-btn"
              onClick={toggleSearch}
              aria-label="Toggle search"
              title="Search"
            >
              <img 
                src={(Icons as IconsType)['search']} 
                alt="Search" 
              />
            </button>

        

            
            {/* Expanded Search Form - Only visible when expanded */}
            {isSearchExpanded && (
              <div className="header__search-expanded">
                <form onSubmit={handleSearchSubmit} className="search search--full">
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
                    placeholder={t('searchPlaceholder')}
                    value={value}
                    onChange={handleSearch}
                    autoFocus
                  />
                  <button 
                    type="button"
                    className="search__close" 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleSearch(e);
                    }}
                    aria-label="Close search"
                  >
                    <span className="search__close-icon"></span>
                  </button>
                </form>
              </div>
            )}
          </div>
            
          <div className="header__language-selector">
              <button 
                className={`header__language-btn ${i18n.language === 'en' ? 'header__language-btn--active' : ''}`}
                onClick={() => i18n.changeLanguage('en')}
              >
                EN
              </button>
              <button 
                className={`header__language-btn ${i18n.language === 'cz' ? 'header__language-btn--active' : ''}`}
                onClick={() => i18n.changeLanguage('cz')}
              >
                CZ
              </button>
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
                  <h3 className="header__dropdown-title">{t('notifications')}</h3>
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
                        {t('noNotifications')}
                      </li>
                    )}
                  </ul>
                  <div className="header__dropdown-footer">
                    <button className="header__dropdown-btn">{t('markAllAsRead')}</button>
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
                              <img src={Icons[item.icon as keyof typeof Icons]} alt="" className="header__dropdown-icon" />
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
                                  <img src={Icons[item.icon as keyof typeof Icons]} alt="" className="header__dropdown-icon" />
                                  {item.name}
                                </button>
                              </li>
                            ))}
                          </>
                        )}
                      </ul>
                      
                      <div className="header__dropdown-footer">
                        <button onClick={handleLogout} className="header__logout-btn">
                          {t('logout')}
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
            
            {/* Mobile Menu Toggle - only show on small screens */}
            <button 
              className="header__mobile-toggle"
              onClick={openMobileMenu}
              aria-label="Open menu"
            >
              <span className="header__mobile-icon"></span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <div className={`header__mobile-menu ${isMobileMenuOpen ? 'header__mobile-menu--open' : ''}`} ref={mobileMenuRef}>
        <div className="header__mobile-header">
          <button 
            className="header__mobile-close"
            onClick={closeMobileMenu}
            aria-label="Close menu"
          >
            <span className="header__mobile-close-icon"></span>
          </button>
        </div>
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
              placeholder={t('searchPlaceholder')}
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
                {t('signIn')}
              </button>
              <button 
                className="header__mobile-btn header__mobile-btn--outline"
                onClick={() => {
                  setIsAuthModalOpen(true);
                  setIsMobileMenuOpen(false);
                }}
              >
                {t('signUp')}
              </button>
            </div>
          )}
          
          <nav className="header__mobile-nav">
            {/* Food Categories Section */}
            <h3 className="header__mobile-heading">{t('foodCategories')}</h3>
            <ul className="header__mobile-list">
              {CATEGORIES.map((item, index) => (
                <li key={item.id} className="header__mobile-item">
                  <a 
                    href={`#section-${item.name.toLowerCase()}`} 
                    className={`header__mobile-link ${
                      category === index ? 'active' : ''
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleCategoryClick(index, item.name);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <div className="header__mobile-category-icon">
                      <img 
                        src={Images[item.name.toLowerCase() as keyof typeof Images]} 
                        alt={`${item.name} category`}
                        className="header__mobile-icon-img"
                      />
                    </div>
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
            
            <h3 className="header__mobile-heading">{t('menu')}</h3>
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
                    <img src={Icons[item.icon as keyof typeof Icons]} alt="" className="header__mobile-icon-img" />
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
            
            {isAuthenticated && (
              <>
                <h3 className="header__mobile-heading">{t('profile')}</h3>
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
                <h3 className="header__mobile-heading">{t('Admin')}</h3>
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
          
          <div className="header__mobile-language">
            <button 
              className={`header__language-btn ${i18n.language === 'en' ? 'header__language-btn--active' : ''}`}
              onClick={() => i18n.changeLanguage('en')}
            >
              English
            </button>
            <button 
              className={`header__language-btn ${i18n.language === 'cz' ? 'header__language-btn--active' : ''}`}
              onClick={() => i18n.changeLanguage('cz')}
            >
              Čeština
            </button>
          </div>
          
          {isAuthenticated && (
            <div className="header__mobile-footer">
              <button onClick={handleLogout} className="header__logout-btn header__logout-btn--full">
                {t('logout')}
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
