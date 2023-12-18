import { useState } from "react";
import * as Icons from "../../assets/icons";
function Navbar() {
  const [active, setActive] = useState(0);
  const [expand, setExpand] = useState(true);
  const navItems = [
    "menu",
    "person",
    "balance",
    "settings",
    "email",
    "piechart",
    "chat",
  ];
  return (
    <>
      {expand ? (
        <div className="left-sidebar">
          <nav className="left-sidebar-nav">
            <button onClick={() => setExpand(!expand)} className="expandButton">
              <img src={Icons["expand"]} alt="" />
            </button>
            <ul className="navigation">
              {navItems.map((item, index) => {
                return (
                  <li
                    key={index}
                    onClick={() => setActive(index)}
                    className={
                      "navigation-item" + (active === index ? " active" : "")
                    }
                  >
                    <a href="#">
                      <img src={Icons[item]} alt="" />
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      ) : (
        <button onClick={() => setExpand(!expand)} className="expandButton">
          <img src={Icons["expand"]} alt="" />
        </button>
      )}
    </>
  );
}

export default Navbar;
