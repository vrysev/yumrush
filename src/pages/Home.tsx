import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '@components/common/Header/Header';
import Hero from '@components/common/Hero/Hero';
import Categories from '@components/categories/Categories';
import SkeletonProduct from '@components/products/SkeletonProduct';
import axios, { AxiosInstance } from 'axios';
import { useSelector } from 'react-redux';
import { ProductType, RootState } from '@/types/product';
import Product from '@components/products/Product';
// Constants
const SORT_TYPES = ['rating', 'title', 'time', 'price'] as const;
const CATEGORY_TYPES = ['pizzas', 'burgers'] as const;

const API_BASE_URL = 'https://65810e6e3dfdd1b11c425bad.mockapi.io';
const SKELETON_COUNT = 6;

// API instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
});

function Home(): JSX.Element {
  // Redux selectors
  const sort = useSelector((state: RootState) => state.sort.sortType);
  const search = useSelector((state: RootState) => state.search.searchValue);
  const category = useSelector((state: RootState) => state.sort.category);

  // State
  const [products, setProducts] = useState<ProductType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async (): Promise<void> => {
      try {
        setIsLoading(true);
        setHasError(false);

        const url = `${CATEGORY_TYPES[category]}`;
        const params = {
          sortBy: SORT_TYPES[sort],
          search,
          order: 'desc' as const,
        };

        const { data } = await api.get<ProductType[]>(url, { params });

        if (data === 'Not found') {
          setProducts([]);
          setHasError(true);
        } else {
          setProducts(data);
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
        setHasError(true);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [category, sort, search]);

  // Render product list
  const renderProducts = (): JSX.Element | JSX.Element[] => {
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
          <div className="products">{renderProducts()}</div>
        </div>
      </section>
    </>
  );
}

export default Home;
