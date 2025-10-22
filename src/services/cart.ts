import { CartItem } from "@/interface/interface";
import api from "../request";

export const getUserCart = async () => {
  try {
    const res = await api.get(`/cart`);
    return res.data;
  } catch (error) {
    console.error("❌ Failed to get user cart:", error);
    throw error;
  }
};

export const handleAddingToCart = async (
  productId: string,
  size?: string,
  quantity: number = 1
) => {
  try {
    const res = await api.post(`/cart/add`, { productId, size, quantity });
    return res.data;
  } catch (error) {
    console.error("❌ Failed to get user cart:", error);
    throw error;
  }
};

export const handleRemoveCartItem = async (id: string) => {
  try {
    const res = await api.delete(`/cart/remove/${id}`);
    return res.data;
  } catch (error) {
    console.error("❌ Failed to get Remove From cart:", error);
    throw error;
  }
};

export const handleClearCart = async () => {
  try {
    const res = await api.delete(`/cart/clear`);
    return res.data;
  } catch (error) {
    console.error("❌ Failed to clear cart:", error);
    throw error;
  }
};

export const handleUpdateCartQuantity = async (
  id: string,
  type: "inc" | "dec"
) => {
  try {
    const verb = type === "inc" ? "increase" : "decrease";
    const res = await api.put(`/cart/${verb}/${id}`);
    return res.data;
  } catch (error) {
    console.error("❌ Failed to update cart quantity:", error);
    throw error;
  }
};

export const handlePayment = async (
  total: number,
  address: string,
  alt_phone: string,
  phone: string,
  orders: CartItem[]
) => {
  try {
    const res = await api.post("/payment/initialize", {
      total,
      address,
      alt_phone,
      phone,
      orders,
    });
    return res.data;
  } catch (error) {
    console.error("❌ Failed to process payment:", error);
    throw error;
  }
};

export const verifyPayment = async (reference: string) => {
  try {
    const res = await api.get(`/payment/verify/${reference}`);
    return res.data;
  } catch (error) {
    console.error("❌ Failed to Verify payment:", error);
    throw error;
  }
};
