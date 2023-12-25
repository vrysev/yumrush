import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header/Header.jsx";
import Hero from "../components/Hero/Hero.jsx";
import Categories from "../components/Categories/Categories.jsx";
import SkeletonProduct from "../components/Product/SkeletonProduct.jsx";
import Product from "../components/Product/Product.jsx";

function Home() {
  const [pizzas, setPizzas] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [sortItem, setSortItem] = useState(3);
  const [foundData, setFoundData] = useState(true);
  const sortTypes = ["rating", "title", "alphabet(Z-A)", "price"];
  useEffect(() => {
    setIsLoading(true);
    fetch(
      `https://65810e6e3dfdd1b11c425bad.mockapi.io/pizzas?sortBy=${sortTypes[sortItem]}&search=${searchValue}&order=desc`,
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
  }, [sortTypes[sortItem], searchValue]);
  return (
    <>
      <Outlet />
      <Header searchValue={searchValue} setSearchValue={setSearchValue} />
      <Hero />
      <Categories sortItem={sortItem} setSortItem={(id) => setSortItem(id)} />
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
              <div>Sorry, we didn't find any matches</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
