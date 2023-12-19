import "./scss/app.scss";
import Header from "./components/Header/Header.jsx";
import Navbar from "./components/Navbar/Navbar.jsx";
import Hero from "./components/Hero/Hero.jsx";
import Categories from "./components/Categories/Categories.jsx";
import Product from "./components/Product/Product.jsx";
import { useEffect, useState } from "react";
function App() {
  const [pizzas, setPizzas] = useState([]);
  useEffect(() => {
    fetch("https://65810e6e3dfdd1b11c425bad.mockapi.io/pizzas")
      .then((res) => res.json())
      .then((data) => setPizzas(data));
  }, []);

  return (
    <>
      <Navbar />
      <div className="wrapper">
        <Header />
        <Hero />
        <Categories />
        <div className="products">
          <div className="container">
            <div className="products__section">
              {pizzas.map((obj) => (
                <Product key={obj.id} {...obj} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
