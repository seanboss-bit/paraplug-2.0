export interface User {
  _id: string;
  ref: string | null;
  fullName: string;
  email: string;
  username: string;
  image: string;
  isAdmin: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  referralCode: string;
  referredUsers: string[]; // array of user IDs
  favourites: string[]; // array of product IDs
  reviews: UserReview[]; // you can replace `any` with a proper `Review` interface if needed
}

export interface UserReview {
  comment: string;
  createdAt: string;
  productId: string;
  rating: number;
  _id: string;
}

export interface LoginResponse extends User {
  message: string;
  accessToken: string;
}

export interface Product {
  _id?: string | "";
  name: string;
  image: string;
  category: string;
  price: number;
  slashPrice: number | null;
  description: string;
  review?: ProductReview[];
  sizes: string[];
  freeShipping: boolean;
  extraImg: string[];
  inStock: boolean;
  createdAt?: string;
  updatedAt?: string;
  isFavourite?: boolean;
  stockxLink?: string;
  __v?: number;
}

export interface ProductReview {
  userId: string;
  username: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface InstagramPost {
  _id: string;
  image: string;
  username: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface MinimalProduct {
  id: string;
  name: string;
  mainImg: string;
}

export interface Review {
  _id: string;
  type: "website" | "product";
  userId: {
    _id: string;
    username: string;
    image?: string;
  };
  username: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface CartItem {
  _id: string;
  name: string;
  image: string;
  price: number;
  category: string;
  cartQuantity: number;
  size?: string | null;
}

export interface Cart {
  products: CartItem[];
  quantity: number;
  total: number;
}

export interface OrderItem {
  _id: string;
  name: string;
  image: string;
  price: number;
  category: string;
  cartQuantity: number;
  size: string;
}

export interface Order {
  _id: string;
  userId: string;
  name: string;
  lname: string;
  orders: OrderItem[];
  email: string;
  address: string;
  phone: number;
  alt_phone: number;
  completed: boolean;
  total: number;
  status: string;
  reference: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
