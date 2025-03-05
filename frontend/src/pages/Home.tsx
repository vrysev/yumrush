import { useEffect, useState, useRef, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import Hero from '@/components/common/Hero/Hero';
import Categories from '@/components/categories/Categories';
import SkeletonProduct from '@components/products/SkeletonProduct';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { ProductType, RootState } from '@/types/product';
import Product from '@/components/products/Product';

// Constants
const SORT_TYPES = ['rating', 'title', 'rating', 'price'] as const; // Replace 'time' with 'rating' as fallback
const CATEGORY_NAMES = ['pizza', 'burger', 'fries', 'pack'] as const;
const CATEGORY_MAP: Record<string, number> = {
  pizza: 0,
  burger: 1,
  fries: 2,
  pack: 3
};
const SKELETON_COUNT = 3;
const ITEMS_PER_PAGE = 8;

function Home(): JSX.Element {
  // Redux selectors
  const sort = useSelector((state: RootState) => state.sort.sortType);
  const search = useSelector((state: RootState) => state.search.searchValue);
  const category = useSelector((state: RootState) => state.sort.category);
  const categoryId = useSelector((state: RootState) => state.sort.categoryId);

  // State
  const [productsByCategory, setProductsByCategory] = useState<Record<string, ProductType[]>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  
  // Refs
  const observer = useRef<IntersectionObserver | null>(null);
  const lastProductElementRef = useCallback((node: HTMLDivElement | null) => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    }, { threshold: 0.5 });
    
    if (node) observer.current.observe(node);
  }, [isLoading, hasMore]);

  // Fetch all products for all categories
  useEffect(() => {
    const fetchProducts = async (): Promise<void> => {
      try {
        setIsLoading(true);
        setHasError(false);

        const newProductsByCategory: Record<string, ProductType[]> = {};
        
        // If search is active, fetch all matching products
        if (search) {
          const params = {
            sortBy: SORT_TYPES[sort],
            search,
            order: 'desc' as const,
          };

          const { data } = await axios.get<ProductType[]>('/api/products', { params });
          
          if (data === 'Not found' || !Array.isArray(data)) {
            setHasError(true);
          } else {
            // Group products by category
            CATEGORY_NAMES.forEach(catName => {
              newProductsByCategory[catName] = data.filter(
                product => product.category === CATEGORY_MAP[catName]
              );
            });
          }
        } else {
          // Fetch products for each category in parallel
          const requests = CATEGORY_NAMES.map(catName => 
            axios.get<ProductType[]>('/api/products', {
              params: {
                category: CATEGORY_MAP[catName], // Use the numeric category ID
                sortBy: SORT_TYPES[sort],
                order: 'desc' as const,
              }
            })
          );
          
          const responses = await Promise.all(requests);
          
          responses.forEach((response, index) => {
            const categoryName = CATEGORY_NAMES[index];
            if (response.data === 'Not found' || !Array.isArray(response.data)) {
              newProductsByCategory[categoryName] = [];
            } else {
              // Simulate pagination client-side
              const paginatedData = response.data.slice(0, page * ITEMS_PER_PAGE);
              newProductsByCategory[categoryName] = paginatedData;
              
              // Check if we have products for this category
              if (response.data.length === 0) {
                setHasMore(false);
              }
              
              // If we've shown all available products, disable infinite loading
              if (paginatedData.length >= response.data.length) {
                setHasMore(false);
              }
            }
          });
        }
        
        setProductsByCategory(newProductsByCategory);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        setHasError(true);
        
        // Create empty product categories as fallback
        const fallbackProducts: Record<string, ProductType[]> = {};
        CATEGORY_NAMES.forEach(catName => {
          fallbackProducts[catName] = [];
        });
        setProductsByCategory(fallbackProducts);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [sort, search, page]);

  // Render product list for a specific category
  const renderCategoryProducts = (categoryName: string): JSX.Element | JSX.Element[] => {
    const categoryProducts = productsByCategory[categoryName] || [];
    
    if (isLoading && page === 1) {
      return [...Array(SKELETON_COUNT)].map((_, index) => (
        <SkeletonProduct key={`skeleton-${categoryName}-${index}`} />
      ));
    }

    if (categoryProducts.length === 0 && !isLoading) {
      return (
        <div className="no-products">
          No {categoryName} products found.
        </div>
      );
    }

    return categoryProducts.map((product, index) => {
      // Add ref to last element for infinite scrolling
      if (categoryName === CATEGORY_NAMES[CATEGORY_NAMES.length - 1] && 
          index === categoryProducts.length - 1) {
        return (
          <div ref={lastProductElementRef} key={product._id}>
            <Product {...product} />
          </div>
        );
      }
      return <Product key={product._id} {...product} />;
    });
  };

  return (
    <div className="home">
      <Outlet />
      <Hero />
      
      {/* Regular categories component - will be hidden when scrolled */}
      <Categories />
      
      {/* Render product sections by category */}
      {CATEGORY_NAMES.map((categoryName) => (
        <section 
          id={`section-${categoryName}`} 
          key={categoryName}
          className="products-section"
        >
          <div className="container">
            <h2 className="section-title">{categoryName.charAt(0).toUpperCase() + categoryName.slice(1)}</h2>
            <div className="products">
              {renderCategoryProducts(categoryName)}
            </div>
          </div>
        </section>
      ))}
      
      {isLoading && page > 1 && (
        <div className="loading-more">
          Loading more products...
        </div>
      )}
    </div>
  );
}

export default Home;
