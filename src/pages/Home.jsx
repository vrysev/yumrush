import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header/Header.jsx";
import Hero from "../components/Hero/Hero.jsx";
import Categories from "../components/Categories/Categories.jsx";
import SkeletonProduct from "../components/Product/SkeletonProduct.jsx";
import Product from "../components/Product/Product.jsx";

function Home() {
  const [pizzas, setPizzas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    fetch("https://65810e6e3dfdd1b11c425bad.mockapi.io/pizzas")
      .then((res) => res.json())
      .then((data) => {
        setPizzas(data);
        setIsLoading(false);
      });
  }, []);
  return (
    <>
      <Outlet />
      <Header />
      <Hero />
      <Categories />
      <div className="products">
        <div className="container">
          <div className="products__section">
            {isLoading
              ? [...new Array(6)].map((_, index) => (
                  <SkeletonProduct key={index} />
                ))
              : pizzas.map((obj) => <Product key={obj.id} {...obj} />)}
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
