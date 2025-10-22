"use client";
import { Cart, CartItem } from "@/interface/interface";
import { useLoading } from "@/providers/LoadingProvider";
import { numberWithCommas } from "@/utils/functions";
import {
  ArrowLeftIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import {
  handleRemoveCartItem,
  handleUpdateCartQuantity,
  handleClearCart,
} from "@/services/cart"; // 👈 your existing API call functions
import CheckoutPopup from "./CheckoutPopup";

interface cartProps {
  cart: Cart;
  refreshCart: () => void; // so we can refetch after actions
}

const CartFilled = ({ cart, refreshCart }: cartProps) => {
  const { LoadingLink } = useLoading();
  const [showCheckout, setShowCheckout] = useState(false);
  const [loadingItem, setLoadingItem] = useState<string | null>(null);

  const updateQuantity = async (
    id: string,
    type: "inc" | "dec",
    currentQty: number
  ) => {
    try {
      // 🛑 Prevent decreasing below 1
      if (type === "dec" && currentQty <= 1) {
        toast.error("❌ You cannot reduce quantity below 1");
        return;
      }

      setLoadingItem(id);
      await handleUpdateCartQuantity(id, type);
      refreshCart();
    } catch (err: any) {
      toast.error("Failed to update quantity");
    } finally {
      setLoadingItem(null);
    }
  };

  const removeItem = async (id: string) => {
    try {
      setLoadingItem(id);
      await handleRemoveCartItem(id);
      toast.success("Item removed");
      refreshCart();
    } catch (err) {
      toast.error("Failed to remove item");
    } finally {
      setLoadingItem(null);
    }
  };

  const clearCart = async () => {
    try {
      toast.loading("Clearing cart...");
      await handleClearCart();
      toast.success("Cart cleared");
      refreshCart();
    } catch {
      toast.error("Failed to clear cart");
    } finally {
      toast.dismiss();
    }
  };

  const toPay = async () => {
    toast.success("Redirecting to Paystack...");
    // your paystack logic goes here
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* CART ITEMS */}
        <div className="md:col-span-3 bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-100">
              Cart Items ({cart.products.length})
            </h2>
            <button
              onClick={clearCart}
              className="text-sm text-red-500 flex items-center gap-2 hover:text-red-600"
            >
              <TrashIcon className="size-5" /> Clear Cart
            </button>
          </div>

          <div className="space-y-6">
            {cart.products.map((item: CartItem) => (
              <div
                key={item._id}
                className="flex md:flex-row flex-col md:items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4"
              >
                <div className="grid grid-cols-3 md:flex items-center gap-4">
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="col-span-2">
                    <h3 className="text-gray-800 dark:text-gray-100 font-semibold capitalize line-clamp-2">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {item.category}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 font-medium">
                      ₦{item.price.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-[15px] md:mt-0">
                  <button
                    disabled={loadingItem === item._id}
                    onClick={() =>
                      updateQuantity(item._id, "dec", item?.cartQuantity)
                    }
                    className="border rounded-lg px-2 py-1 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                  >
                    -
                  </button>
                  <span className="text-gray-700 dark:text-gray-100">
                    {item.cartQuantity}
                  </span>
                  <button
                    disabled={loadingItem === item._id}
                    onClick={() =>
                      updateQuantity(item._id, "inc", item?.cartQuantity)
                    }
                    className="border rounded-lg px-2 py-1 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                  >
                    +
                  </button>

                  <TrashIcon
                    onClick={() => removeItem(item._id)}
                    className="size-6 text-red-500 hover:text-red-600 cursor-pointer ml-3"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SUMMARY */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 h-fit sticky top-28">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
            Order Summary
          </h2>

          <div className="space-y-2 text-gray-600 dark:text-gray-300">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₦{numberWithCommas(cart?.total)}</span>
            </div>
            {cart?.total > 300000 ? null : (
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>₦3,500</span>
              </div>
            )}
            <div className="border-t border-gray-300 dark:border-gray-700 my-3"></div>
            <div className="flex justify-between text-lg font-semibold text-gray-800 dark:text-gray-100">
              <span>Total</span>
              <span>
                ₦
                {cart?.total > 300000
                  ? numberWithCommas(cart?.total)
                  : numberWithCommas(cart?.total + 3500)}
              </span>
            </div>
          </div>

          <button
            onClick={() => setShowCheckout(true)}
            className="mt-6 w-full bg-gray-900 text-white py-3 rounded-xl hover:bg-gray-700 transition font-medium"
          >
            Checkout
          </button>

          <LoadingLink
            href="/store"
            className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-300 mt-4 hover:underline"
          >
            <ArrowLeftIcon className="size-5" /> Continue Shopping
          </LoadingLink>
        </div>
      </div>
      <CheckoutPopup
        show={showCheckout}
        setShow={setShowCheckout}
        cart={cart}
      />
    </>
  );
};

export default CartFilled;
