import * as Images from "./../../assets/img/";
import { useState } from "react";

function Categories() {
  const categories = ["Pizza", "Burger", "Fries", "Pack"];
  const [activeCategory, setActiveCategory] = useState(0);
  return (
    <div className="categories">
      <div className="container">
        <div className="categories__section">
          <div className="categories__section--title">Our Menu</div>
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
