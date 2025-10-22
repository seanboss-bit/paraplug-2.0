import { Cart, CartItem } from "@/interface/interface";
import { create } from "zustand";

type State = {
  cart: Cart;
};

type Actions = {
  setCart: (cart: Cart) => void;
  addToCart: (item: CartItem) => void;
  clearCart: () => void;
};

export const useCartStore = create<State & Actions>((set, get) => ({
  cart: { products: [], quantity: 0, total: 0 },

  // ✅ Replace the entire cart (e.g., after API fetch)
  setCart: (cart) => set({ cart }),

  // ✅ Add item locally (optional — if you want instant updates)
  addToCart: (item) => {
    const currentCart = get().cart;
    const updatedProducts = [...currentCart.products, item];
    const updatedQuantity = currentCart.quantity + item.cartQuantity;
    const updatedTotal = currentCart.total + item.price * item.cartQuantity;

    set({
      cart: {
        products: updatedProducts,
        quantity: updatedQuantity,
        total: updatedTotal,
      },
    });
  },

  // ✅ Clear cart completely
  clearCart: () => set({ cart: { products: [], quantity: 0, total: 0 } }),
}));
