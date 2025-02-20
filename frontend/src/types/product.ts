export interface ProductType {
    id: string;
    title: string;
    price: number;
    rating: number;
    time: number;
    imageUrl: string;
    types: number[];
    sizes: number[];
    category: number;
    count: number;
  }
  
  export interface RootState {
    sort: {
      sortType: number;
      category: number;
    };
    search: {
      searchValue: string;
    };
  }
