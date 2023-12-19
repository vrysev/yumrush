import * as Icons from "./../../assets/icons/";
import { useState } from "react";
function Header() {
  const [searchValue, setSearchValue] = useState("");
  const handleClearSearch = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setSearchValue("");
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
              {searchValue ? (
                <button onMouseDown={handleClearSearch}>
                  <img src={Icons["close"]} alt="" />
                </button>
              ) : (
                ""
              )}
            </div>
            <input
              type="search"
              className={"header__section__search--search"}
              name="search"
              placeholder="Search"
              value={searchValue}
              onChange={() => setSearchValue(event.target.value)}
            />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
