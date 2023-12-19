import * as Images from "./../../assets/img/";
import { useState } from "react";
import sortIcon from "./../../assets/icons/sort.svg";
function Categories() {
  const categories = ["Pizza", "Burger", "Fries", "Pack"];
  const [popupActive, setPopupActive] = useState(false);
  const sortTypes = ["popularity", "alphabet(A-Z)", "alphabet(Z-A)", "price"];
  const [sortType, setActiveSortType] = useState(0);
  const [activeCategory, setActiveCategory] = useState(0);

  const handleChangeSortType = (index) => {
    setActiveSortType(index);
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
            {popupActive ? (
              <ul className="sort__popup">
                {sortTypes.map((obj, index) => (
                  <li
                    onClick={() => handleChangeSortType(index)}
                    key={index}
                    className={`sort__popup--item ${
                      sortType === index ? "active" : ""
                    }`}
                  >
                    {obj}
                  </li>
                ))}
              </ul>
            ) : (
              ""
            )}
          </div>
          <ul className="categories__section--list">
            {categories.map((obj, index) => {
              return (
                <>
                  <li
                    key={index}
                    onClick={() => setActiveCategory(index)}
                    className={`category__item ${
                      activeCategory === index ? "active" : ""
                    }`}
                  >
                    <div className="category__item--img">
                      <img src={Images[obj.toLowerCase()]} alt={"category"} />
                    </div>
                    <p className="category__item--title">{obj}</p>
                  </li>
                </>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Categories;
