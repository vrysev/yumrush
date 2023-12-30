import * as Images from "./../../assets/img/";
import sortIcon from "./../../assets/icons/sort.svg";
import { useDispatch, useSelector } from "react-redux";
import {
  setSortType,
  setPopupActive,
  setActiveCategory,
} from "../../redux/slices/sortSlice.jsx";
import styles from "./Categories.module.scss";
function Categories() {
  const { sortType, popUp, category } = useSelector((state) => state.sort);
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
    console.log(sortType);
  };
  return (
    <div className="categories">
      <div className="container">
        <div className={styles.section}>
          <div className={styles.title}>
            Our Menu
            <span
              onClick={() => dispatch(setPopupActive(!popUp))}
              className={styles.sortBtn}
            >
              <img src={sortIcon} alt="" className="sort--img" />
            </span>
            {popUp && (
              <ul className={styles.sortPopUp}>
                {sortTypes.map((obj, index) => (
                  <li
                    onClick={() => handleChangeSortType(index)}
                    key={index}
                    className={
                      styles.sortItem +
                      (sortType === index ? " " + styles.active : "")
                    }
                  >
                    {obj}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <ul className={styles.list}>
            {categories.map((obj, index) => {
              return (
                <li
                  key={obj.id}
                  onClick={() => dispatch(setActiveCategory(index))}
                  className={`${styles.categoryItem} ${
                    category === index ? styles.active : ""
                  }`}
                >
                  <div className={styles.itemImage}>
                    <img
                      src={Images[obj.name.toLowerCase()]}
                      alt={"category"}
                    />
                  </div>
                  <p className={styles.itemTitle}>{obj.name}</p>
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
