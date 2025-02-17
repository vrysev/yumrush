import { useEffect, useState } from "react";
import * as Icons from "../../assets/icons";
import styles from "./Navbar.module.scss";
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
  useEffect(() => {
    // Function to update state based on viewport width
    const updateViewportStatus = () => {
      const viewportWidth = window.innerWidth;

      if (viewportWidth <= 1480) {
        setExpand(false);
      } else {
        setExpand(true);
      }
    };

    updateViewportStatus();

    window.addEventListener("resize", updateViewportStatus);

    return () => {
      window.removeEventListener("resize", updateViewportStatus);
    };
  }, []);
  return (
    <>
      {expand ? (
        <div className={styles.leftSidebar}>
          <nav className="left-sidebar-nav">
            <button
              onClick={() => setExpand(!expand)}
              className={styles.expandButton}
            >
              <img src={Icons["expand"]} alt="" />
            </button>
            <ul className={styles.navigation}>
              {navItems.map((item, index) => {
                return (
                  <li
                    key={index}
                    onClick={() => setActive(index)}
                    className={
                      styles.item +
                      (active === index ? " " + styles.active : "")
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
        <button
          onClick={() => setExpand(!expand)}
          className={styles.expandButton}
        >
          <img src={Icons["expand"]} alt="" />
        </button>
      )}
    </>
  );
}

export default Navbar;
