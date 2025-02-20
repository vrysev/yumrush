import { FC } from 'react';
import './Categories.scss';
import * as Images from '@assets/img';
import sortIcon from '@assets/icons/sort.svg';
import { useDispatch, useSelector } from 'react-redux';
import { setSortType, setPopupActive, setActiveCategory } from '@redux/slices/sortSlice';
import { RootState } from '@/types/product'; // Assuming RootState is here, adjust if needed

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
}

const Categories: FC = () => {
  const { sortType, popUp, category } = useSelector((state: RootState) => state.sort);
  const dispatch = useDispatch();

  const categories: Category[] = [
    { id: 1, name: 'Pizza' },
    { id: 2, name: 'Burger' },
    { id: 3, name: 'Fries' },
    { id: 4, name: 'Pack' },
  ];

  const sortTypes: string[] = ['popularity', 'alphabet(A-Z)', 'alphabet(Z-A)', 'price'];

  const handleChangeSortType = (index: number): void => {
    dispatch(setSortType(index));
    dispatch(setPopupActive(!popUp));
  };

  return (
    <div className="categories">
      <div className="container">
        <div className="categories__section">
          <div className="categories__title">
            Our Menu
            <span 
              onClick={() => dispatch(setPopupActive(!popUp))} 
              className="categories__sort-btn"
            >
              <img src={sortIcon} alt="Sort" className="categories__sort-icon" />
              {popUp && (
                <ul className="categories__popup">
                  {sortTypes.map((obj, index) => (
                    <li
                      onClick={() => handleChangeSortType(index)}
                      key={index}
                      className={`categories__popup-item ${
                        sortType === index ? 'categories__popup-item--active' : ''
                      }`}
                    >
                      {obj}
                    </li>
                  ))}
                </ul>
              )}
            </span>
          </div>
          <ul className="categories__list">
            {categories.map((obj, index) => (
              <li
                key={obj.id}
                onClick={() => dispatch(setActiveCategory(index))}
                className={`categories__item ${
                  category === index ? 'categories__item--active' : ''
                }`}
              >
                <div className="categories__item-image">
                  <img 
                    src={(Images as ImagesType)[obj.name.toLowerCase()]} 
                    alt={`${obj.name} category`} 
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
