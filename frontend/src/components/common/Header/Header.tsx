import * as Icons from '../../../assets/icons/index.jsx';
import { useDispatch } from 'react-redux';
import { setSearchValue } from '../../../redux/slices/searchSlice.js';
import { debounce } from 'lodash';
import './Header.scss';
import { IconsType } from '@types/icons.tsx';
import { FC, useState, useCallback, MouseEvent, ChangeEvent } from 'react';
function Header() {
  const [value, setValue] = useState<string>('');
  const dispatch = useDispatch();

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
    []
  );

  const handleSearch = (event: ChangeEvent<HTMLInputElement>): void => {
    setValue(event.target.value);
    debounceSearch(event.target.value);
  };
  return (
    <header className="header">
      <div className="container">
        <div className="header__content">
          <div className="header__welcome">
            <p className="header__greeting">Hello John</p>
            <p className="header__message">Welcome Back</p>
          </div>
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
        </div>
      </div>
    </header>
  );
}

export default Header;
