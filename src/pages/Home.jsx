import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/common/Header.jsx";
import Hero from "../components/common/Hero.jsx";
import Categories from "../components/categories/Categories.jsx";
import SkeletonProduct from "../components/products/SkeletonProduct.jsx";
import Product from "../components/products/Product.jsx";
import axios from "axios";
import { useSelector } from "react-redux";
import { section as sectionProducts } from "../components/products/Products.module.scss";

// Constants
const SORT_TYPES = ["rating", "title", "time", "price"];
const CATEGORY_TYPES = ["pizzas", "burgers"];
const API_BASE_URL = "https://65810e6e3dfdd1b11c425bad.mockapi.io";
const SKELETON_COUNT = 6;

// API instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
});

function Home() {
  // Redux selectors
  const sort = useSelector((state) => state.sort.sortType);
  const search = useSelector((state) => state.search.searchValue);
  const category = useSelector((state) => state.sort.category);

  // State
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setHasError(false);

        const url = `${CATEGORY_TYPES[category]}`;
        const params = {
          sortBy: SORT_TYPES[sort],
          search,
          order: "desc",
        };

        const { data } = await api.get(url, { params });

        if (data === "Not found") {
          setProducts([]);
          setHasError(true);
        } else {
          setProducts(data);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setHasError(true);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [category, sort, search]);

  // Render product list
  const renderProducts = () => {
    if (isLoading) {
      return [...Array(SKELETON_COUNT)].map((_, index) => (
        <SkeletonProduct key={`skeleton-${index}`} />
      ));
    }

    if (hasError || products.length === 0) {
      return (
        <div className="text-center py-8 text-gray-600">
          No products found. Try adjusting your search or filters.
        </div>
      );
    }

    return products.map((product) => <Product key={product.id} {...product} />);
  };

  return (
    <>
      <Outlet />
      <Header />
      <Hero />
      <Categories />
      <section className="products">
        <div className="container">
          <div className={sectionProducts}>{renderProducts()}</div>
        </div>
      </section>
    </>
  );
}

export default Home;
