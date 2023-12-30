import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header/Header.jsx";
import Hero from "../components/Hero/Hero.jsx";
import Categories from "../components/Categories/Categories.jsx";
import SkeletonProduct from "../components/Product/SkeletonProduct.jsx";
import Product from "../components/Product/Product.jsx";
import axios from "axios";
import { useSelector } from "react-redux";
import { section as sectionProducts } from "./../components/Product/Products.module.scss";

function Home() {
  const sort = useSelector((state) => state.sort.sortType);
  const search = useSelector((state) => state.search.searchValue);
  const category = useSelector((state) => state.sort.category);

  const [pizzas, setPizzas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [foundData, setFoundData] = useState(true);
  const sortTypes = ["rating", "title", "time", "price"];
  const categoryTypes = ["pizzas", "burgers"];
  useEffect(() => {
    setIsLoading(true);
    axios
      .get(
        `https://65810e6e3dfdd1b11c425bad.mockapi.io/${categoryTypes[category]}?sortBy=${sortTypes[sort]}&search=${search}&order=desc`,
      )
      .then((res) => {
        if (res.data !== "Not found") {
          setPizzas(res.data);
          setFoundData(true);
        } else {
          setFoundData(false);
        }
        setIsLoading(false);
      });
  }, [sortTypes[sort], search, categoryTypes[category]]);
  // <Outlet />
  //

  return (
    <>
      <Outlet />
      <Header />
      <Hero />
      <Categories />
      <div className="products">
        <div className="container">
          <div className={sectionProducts}>
            {foundData ? (
              isLoading ? (
                [...new Array(6)].map((_, index) => (
                  <SkeletonProduct key={index} />
                ))
              ) : (
                pizzas.map((obj) => <Product key={obj.id} {...obj} />)
              )
            ) : (
              <div>Sorry, we didnt find any matches</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
