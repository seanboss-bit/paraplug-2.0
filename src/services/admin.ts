import { Product } from "@/interface/interface";
import api from "../request";

interface UploadProduct {
  name: string;
  image: string;
  category: string;
  price: number;
  slashPrice: number;
  description: string;
  sizes: string[];
  freeShipping: boolean;
  extraImg: string[];
  inStock: boolean;
  stockxLink: string;
}

export const getEmails = async () => {
  try {
    const res = await api.get("/email");
    return res.data;
  } catch (error) {
    console.error("❌ Failed to Get Emails:", error);
    throw error;
  }
};
export const getCustomerMessages = async () => {
  try {
    const res = await api.get("/customer");
    return res.data;
  } catch (error) {
    console.error("❌ Failed to Get Messages:", error);
    throw error;
  }
};

export const deleteEmail = async (id: string) => {
  try {
    const res = await api.delete(`/email/${id}`);
    return res.data;
  } catch (error) {
    console.error("❌ Failed to Delete Email:", error);
    throw error;
  }
};

export const getAllUsers = async (pageNum: number, limit: number = 10) => {
  try {
    const res = await api.get(`/user?page=${pageNum}&limit=${limit}`);
    return res.data;
  } catch (error) {
    console.error("❌ Failed to Get All Users:", error);
    throw error;
  }
};

export const adminify = async (id: string, value: boolean) => {
  try {
    const res = await api.put(`/user/${id}`, { isAdmin: value });
    return res.data;
  } catch (error) {
    console.error("❌ Failed to Get All Users:", error);
    throw error;
  }
};

export const getAllOrders = async () => {
  try {
    const res = await api.get(`/order`);
    return res.data;
  } catch (error) {
    console.error("❌ Failed to Get All Orders:", error);
    throw error;
  }
};

export const completeOrder = async (id: string) => {
  try {
    const res = await api.put(`/order/${id}`, { completed: true });
    return res.data;
  } catch (error) {
    console.error("❌ Failed to Mark Order COmpleted:", error);
    throw error;
  }
};
export const deleteOrder = async (id: string) => {
  try {
    const res = await api.delete(`/order/${id}`);
    return res.data;
  } catch (error) {
    console.error("❌ Failed to Delete Order:", error);
    throw error;
  }
};

export const uploadProduct = async (params: UploadProduct) => {
  try {
    const res = await api.post(`/product`, params);
    return res.data;
  } catch (error) {
    console.error("❌ Failed to Add Kicks:", error);
    throw error;
  }
};

export const deleteProduct = async (id: string) => {
  try {
    const res = await api.delete(`/product/${id}`);
    return res.data;
  } catch (error) {
    console.error("❌ Failed to Add Kicks:", error);
    throw error;
  }
};
export const updateProduct = async (id: string, params: Product) => {
  try {
    const res = await api.put(`/product/${id}`, params);
    return res.data;
  } catch (error) {
    console.error("❌ Failed to Add Kicks:", error);
    throw error;
  }
};
