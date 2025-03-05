export interface ProductType {
  _id: string;
  productId?: number;
  title: string;
  price: number;
  rating: number;
  preparationTime: string;
  imageUrl: string;
  category: number; // Changed to number to match backend
  description: string; // Required in the backend
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
    popUp: boolean;
    categoryId: string;
  };
  search: {
    searchValue: string;
  };
}
