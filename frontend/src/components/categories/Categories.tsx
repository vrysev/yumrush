import { FC, useEffect, useRef, useState } from 'react';
import './Categories.scss';
import * as Images from '@assets/img';
import * as Icons from '@assets/icons';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveCategory, scrollToCategory } from '@redux/slices/sortSlice';
import { RootState } from '@/types/product';
import { IconsType } from '@/types/icons';

// Types
interface Category {
  id: number;
  name: string;
}

interface ImagesType {
  [key: string]: string;
  pizza: string;
  burger: string;
  fries: string;
  pack: string;
}

interface SortState {
  sortType: number;
  popUp: boolean;
  category: number;
  categoryId: string;
}

// Export categories for reuse
export const CATEGORIES: Category[] = [
  { id: 1, name: 'Pizza' },
  { id: 2, name: 'Burger' },
  { id: 3, name: 'Fries' },
  { id: 4, name: 'Pack' },
];

interface CategoriesProps {
  mode?: 'default' | 'header';
  onToggleMobileMenu?: () => void;
}

const Categories: FC<CategoriesProps> = ({ mode = 'default', onToggleMobileMenu }) => {
  const { category, categoryId } = useSelector((state: RootState) => state.sort as SortState);
  const dispatch = useDispatch();
  const categoriesRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle category click - update active category and scroll to section
  const handleCategoryClick = (index: number, categoryName: string): void => {
    dispatch(setActiveCategory(index));
    dispatch(scrollToCategory(categoryName.toLowerCase()));
    
    // Scroll to category section
    const sectionElement = document.getElementById(`section-${categoryName.toLowerCase()}`);
    if (sectionElement) {
      sectionElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Toggle mobile menu
  const toggleMobileMenu = (): void => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (onToggleMobileMenu) {
      onToggleMobileMenu();
    }
  };

  // Add scroll effects
  useEffect(() => {
    const handleScrollEffect = () => {
      
      // Add scrolled class to categories when scrolled past hero section
      if (window.scrollY > 650) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScrollEffect, { passive: true });
    return () => window.removeEventListener('scroll', handleScrollEffect);
  }, []);

  // Update active category based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const sections = CATEGORIES.map(cat => 
        document.getElementById(`section-${cat.name.toLowerCase()}`)
      ).filter(Boolean);
      
      // Find the section that's currently most visible in the viewport
      for (const section of sections) {
        if (!section) continue;
        
        const rect = section.getBoundingClientRect();
        const categoryIndex = CATEGORIES.findIndex(
          cat => `section-${cat.name.toLowerCase()}` === section.id
        );
        
        // If section is in view and close to top of viewport (header + categories height = ~120px)
        if (rect.top <= 150 && rect.bottom >= 150 && categoryIndex !== -1 && categoryIndex !== category) {
          dispatch(setActiveCategory(categoryIndex));
          
          // Scroll active category into view in the categories bar
          const categoryElement = document.querySelector(`.categories__item:nth-child(${categoryIndex + 1})`);
          if (categoryElement && categoriesRef.current) {
            const categoriesScroll = categoriesRef.current.querySelector('.categories__list');
            if (categoriesScroll && categoriesScroll instanceof HTMLElement) {
              categoriesScroll.scrollLeft = categoryElement.offsetLeft - 100;
            }
          }
          
          break;
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [CATEGORIES, dispatch, category]);

  // Render header mode categories (integrated with header)
  if (mode === 'header') {
    return (
      <div className="categories-header">
        <div className="categories-header__content">
          <ul className="categories-header__list">
            {CATEGORIES.map((obj, index) => (
              <li
                key={obj.id}
                onClick={() => handleCategoryClick(index, obj.name)}
                className={`categories-header__item ${
                  category === index ? 'categories-header__item--active' : ''
                }`}
              >
                <div className="categories-header__item-icon">
                  <img 
                    src={(Images as ImagesType)[obj.name.toLowerCase()]} 
                    alt={`${obj.name} category`} 
                    loading="lazy"
                  />
                </div>
                <span className="categories-header__item-name">{obj.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  // Render default categories component
  return (
    <div 
      ref={categoriesRef}
      className={`categories ${isScrolled ? 'categories--scrolled' : ''}`}
    >
      <div className="container">
        <div className="categories__section">
          <ul className="categories__list">
            {CATEGORIES.map((obj, index) => (
              <li
                key={obj.id}
                onClick={() => handleCategoryClick(index, obj.name)}
                className={`categories__item ${
                  category === index ? 'categories__item--active' : ''
                }`}
              >
                <div className="categories__item-image">
                  <img 
                    src={(Images as ImagesType)[obj.name.toLowerCase()]} 
                    alt={`${obj.name} category`} 
                    loading="lazy"
                  />
                </div>
                <p className="categories__item-title">{obj.name}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Categories;
