import { useEffect, useState, useRef } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header/Header.jsx";
import Hero from "../components/Hero/Hero.jsx";
import Categories from "../components/Categories/Categories.jsx";
import SkeletonProduct from "../components/Product/SkeletonProduct.jsx";
import Product from "../components/Product/Product.jsx";
import axios from "axios";
import qs from "qs";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setParams } from "../redux/slices/sortSlice.jsx";

function Home() {
  const sort = useSelector((state) => state.sort.sortType);
  const search = useSelector((state) => state.search.searchValue);
  const category = useSelector((state) => state.sort.category);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [pizzas, setPizzas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const isSearch = useRef(false);
  const isMounted = useRef(false);

  const [foundData, setFoundData] = useState(true);
  const sortTypes = ["rating", "title", "time", "price"];
  const categoryTypes = ["pizzas", "burgers"];
  const fetchPizzas = () => {
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
  };
  useEffect(() => {
    if (window.location.search) {
      const params = qs.parse(window.location.search.substring(1));
      dispatch(setParams({ ...params }));
      isSearch.current = true;
    }
  }, []);
  useEffect(() => {
    window.scrollTo(0, 0);
    if (!isSearch.current) {
      fetchPizzas();
    }
    isSearch.current = false;
  }, [sortTypes[sort], search, categoryTypes[category]]);
  useEffect(() => {
    if (isMounted.current) {
      const queryString = qs.stringify({
        sort: sort,
        category: category,
      });

      navigate(`?${queryString}`);
    }
    isMounted.current = true;
  }, [sortTypes[sort], search, categoryTypes[category]]);
  return (
    <>
      <Outlet />
      <Header />
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
