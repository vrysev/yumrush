export interface ProductType {
  _id: string;
  title: string;
  price: number;
  rating: number;
  preparationTime: string;
  imageUrl: string;
  category: string;
  description?: string;
  ingredients?: string[];
  nutritionalInfo?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
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
