import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header/Header.jsx";
import Hero from "../components/Hero/Hero.jsx";
import Categories from "../components/Categories/Categories.jsx";
import SkeletonProduct from "../components/Product/SkeletonProduct.jsx";
import Product from "../components/Product/Product.jsx";
import { useSelector } from "react-redux";

function Home() {
  const sort = useSelector((state) => state.sort.sortType);

  const [pizzas, setPizzas] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [foundData, setFoundData] = useState(true);
  const sortTypes = ["rating", "title", "time", "price"];
  useEffect(() => {
    setIsLoading(true);
    fetch(
      `https://65810e6e3dfdd1b11c425bad.mockapi.io/pizzas?sortBy=${sortTypes[sort]}&search=${searchValue}&order=desc`,
    )
      .then((res) => res.json())
      .then((data) => {
        if (data !== "Not found") {
          setPizzas(data);
          setFoundData(true);
        } else {
          setFoundData(false);
        }
        setIsLoading(false);
      });
  }, [sortTypes[sort], searchValue]);
  return (
    <>
      <Outlet />
      <Header searchValue={searchValue} setSearchValue={setSearchValue} />
      <Hero />
      <Categories />
      <div className="products">
        <div className="container">
          <div className="products__section">
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
