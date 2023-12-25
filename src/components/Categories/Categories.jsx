import * as Images from "./../../assets/img/";
import { useState } from "react";
import sortIcon from "./../../assets/icons/sort.svg";
function Categories({ sortItem, setSortItem }) {
  const categories = [
    { id: 1, name: "Pizza" },
    { id: 2, name: "Burger" },
    { id: 3, name: "Fries" },
    { id: 4, name: "Pack" },
  ];
  const [popupActive, setPopupActive] = useState(false);
  const sortTypes = ["popularity", "alphabet(A-Z)", "alphabet(Z-A)", "price"];
  const [activeCategory, setActiveCategory] = useState(0);

  const handleChangeSortType = (index) => {
    setSortItem(index);
    setPopupActive(!popupActive);
  };
  return (
    <div className="categories">
      <div className="container">
        <div className="categories__section">
          <div className="categories__section--title">
            Our Menu
            <span onClick={() => setPopupActive(!popupActive)} className="sort">
              <img src={sortIcon} alt="" className="sort--img" />
            </span>
            {popupActive && (
              <ul className="sort__popup">
                {sortTypes.map((obj, index) => (
                  <li
                    onClick={() => handleChangeSortType(index)}
                    key={index}
                    className={`sort__popup--item ${
                      sortItem === index ? "active" : ""
                    }`}
                  >
                    {obj}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <ul className="categories__section--list">
            {categories.map((obj, index) => {
              return (
                <li
                  key={obj.id}
                  onClick={() => setActiveCategory(index)}
                  className={`category__item ${
                    activeCategory === index ? "active" : ""
                  }`}
                >
                  <div className="category__item--img">
                    <img
                      src={Images[obj.name.toLowerCase()]}
                      alt={"category"}
                    />
                  </div>
                  <p className="category__item--title">{obj.name}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Categories;
