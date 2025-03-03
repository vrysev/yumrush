import * as Icons from '../../../assets/icons/index.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchValue } from '../../../redux/slices/searchSlice';
import { logout } from '../../../redux/slices/authSlice';
import { debounce } from 'lodash';
import './Header.scss';
import { IconsType } from '@/types/icons';
import { useState, useCallback, MouseEvent, ChangeEvent, FC } from 'react';
import AuthModal from '../../auth/AuthModal';
import CartButton from '../../cart/CartButton';
import CartSidebar from '../../cart/CartSidebar';
import { RootState, AppDispatch } from '../../../redux/store';

interface HeaderProps {
  showSearch?: boolean;
}

const Header: FC<HeaderProps> = ({ showSearch = true }) => {
  const [value, setValue] = useState<string>('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

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

  const handleLogout = (): void => {
    dispatch(logout());
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header__content">
          <div className="header__welcome">
            {isAuthenticated && user ? (
              <>
                <p className="header__greeting">Hello {user.name}</p>
                <p className="header__message">Welcome Back</p>
              </>
            ) : (
              <>
                <p className="header__greeting">Hello Guest</p>
                <p className="header__message">Welcome to YumRush</p>
              </>
            )}
          </div>
          
          <div className="header__actions">
            {showSearch && (
              <div className="header__search search">
                <div className="search__icon search__icon--find">
                  <img src={(Icons as IconsType)['search']} alt="" />
                </div>
                <div onMouseDown={handleClearSearch} className="search__icon search__icon--close">
                  {value && <img src={(Icons as IconsType)['close']} alt="" />}
                </div>
                <input
                  type="search"
                  className="search__input"
                  name="search"
                  placeholder="Search"
                  value={value}
                  onChange={handleSearch}
                />
              </div>
            )}
            
            <div className="header__buttons">
              <CartButton />
              
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="header__logout-btn"
                >
                  Logout
                </button>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="header__login-btn"
                >
                  Login
                </button>
              )}
            </div>
          </div>
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
