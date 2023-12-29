import * as Images from "./../../assets/img/";
import sortIcon from "./../../assets/icons/sort.svg";
import { useDispatch, useSelector } from "react-redux";
import {
  setSortType,
  setPopupActive,
  setActiveCategory,
} from "../../redux/slices/sortSlice.jsx";
function Categories() {
  const { sort, popUp, category } = useSelector((state) => state.sort);
  const dispatch = useDispatch();

  const categories = [
    { id: 1, name: "Pizza" },
    { id: 2, name: "Burger" },
    { id: 3, name: "Fries" },
    { id: 4, name: "Pack" },
  ];

  const sortTypes = ["popularity", "alphabet(A-Z)", "alphabet(Z-A)", "price"];

  const handleChangeSortType = (index) => {
    dispatch(setSortType(index));
    dispatch(setPopupActive(!popUp));
  };
  return (
    <div className="categories">
      <div className="container">
        <div className="categories__section">
          <div className="categories__section--title">
            Our Menu
            <span
              onClick={() => dispatch(setPopupActive(!popUp))}
              className="sort"
            >
              <img src={sortIcon} alt="" className="sort--img" />
            </span>
            {popUp && (
              <ul className="sort__popup">
                {sortTypes.map((obj, index) => (
                  <li
                    onClick={() => handleChangeSortType(index)}
                    key={index}
                    className={`sort__popup--item ${
                      sort === index ? "active" : ""
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
                  onClick={() => dispatch(setActiveCategory(index))}
                  className={`category__item ${
                    category === index ? "active" : ""
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
