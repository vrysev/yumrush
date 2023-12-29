import * as Icons from "./../../assets/icons/";
import { useDispatch } from "react-redux";
import { setSearchValue } from "../../redux/slices/searchSlice.jsx";
import { debounce } from "lodash";
import { useState, useCallback } from "react";

function Header() {
  const [value, setValue] = useState("");
  const dispatch = useDispatch();
  const handleClearSearch = (event) => {
    event.preventDefault();
    event.stopPropagation();
    dispatch(setSearchValue(""));
    setValue("");
  };
  const debounceSearch = useCallback(
    debounce((str) => {
      dispatch(setSearchValue(str));
    }, 500),
    [],
  );
  const handleSearch = (event) => {
    setValue(event.target.value);
    debounceSearch(event.target.value);
  };
  return (
    <header className="header">
      <div className="container">
        <div className="header__section">
          <div className="header__section__block">
            <p className="greeting">Hello John</p>
            <p className="welcome-message">Welcome Back</p>
          </div>
          <div className="header__section__search">
            <div className="header__section__search--iconSearch">
              <img src={Icons["search"]} alt="" />
            </div>
            <div className="header__section__search--iconClose">
              {value && (
                <button onMouseDown={handleClearSearch}>
                  <img src={Icons["close"]} alt="" />
                </button>
              )}
            </div>
            <input
              type="search"
              className={"header__section__search--search"}
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
