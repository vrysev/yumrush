import "./scss/app.scss";
function App() {
  return (
    <div className="wrapper">
      <div className="container">
        <header className="header">
          <div className="header__block">
            <p className="greeting">Hello John</p>
            <p className="welcome-message">Welcome Back</p>
          </div>
          <div className="header__search">
            <div className="header__search--icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="58"
                height="47"
                viewBox="0 0 58 47"
                fill="none"
              >
                <g clipPath="url(#clip0_1_55)">
                  <path
                    d="M36.9059 27.2579H35.0289L34.3636 26.7405C36.6921 24.5557 38.0939 21.7194 38.0939 18.6339C38.0939 11.7539 31.1798 6.17703 22.6501 6.17703C14.1203 6.17703 7.20621 11.7539 7.20621 18.6339C7.20621 25.514 14.1203 31.0908 22.6501 31.0908C26.4754 31.0908 29.9918 29.9601 32.7005 28.082L33.342 28.6186V30.1326L45.2219 39.6957L48.7621 36.8401L36.9059 27.2579ZM22.6501 27.2579C16.7339 27.2579 11.9582 23.4059 11.9582 18.6339C11.9582 13.862 16.7339 10.0099 22.6501 10.0099C28.5663 10.0099 33.342 13.862 33.342 18.6339C33.342 23.4059 28.5663 27.2579 22.6501 27.2579Z"
                    fill="#61656F"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_1_55">
                    <rect
                      width="57.0235"
                      height="45.9947"
                      fill="white"
                      transform="translate(0.0782776 0.427704)"
                    />
                  </clipPath>
                </defs>
              </svg>
            </div>
            <input
              type="search"
              className={"header__search--search"}
              name="search"
              placeholder="Search"
            />
          </div>
        </header>
      </div>
      <div className="left-sidebar">
        <nav>
          <ul>
            <li>
              <a href="#">1</a>
            </li>
            <li>
              <a href="#">2</a>
            </li>
            <li>
              <a href="#">3</a>
            </li>
            <li>
              <a href="#">4</a>
            </li>
            <li>
              <a href="#">5</a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default App;
