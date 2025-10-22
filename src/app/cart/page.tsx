"use client";

import CartEmpty from "@/components/CartEmpty";
import CartFilled from "@/components/CartFilled";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { useUserStore } from "@/store/userStore";
import { useCartStore } from "@/store/cartStore";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getUserCart } from "@/services/cart"; // 👈 your cart fetching API

const CartPage = () => {
  const { user } = useUserStore();
  const { cart, setCart } = useCartStore();
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);

  const fetchCart = async () => {
    try {
      setLoading(true);
      setFetchError(false);

      const res = await getUserCart();
      const data = res?.cart || { products: [], quantity: 0, total: 0 };
      setCart(data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error);
      toast.error("Failed to fetch your cart");
      setFetchError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      window.location.href = "/";
      return;
    } else {
      fetchCart();
    }
  }, [user]);

  if (!user) return null;

  return (
    <>
      <Navbar />
      <section className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-10 text-center tracking-tight">
            Your Shopping Cart
          </h1>

          {/* 🌀 Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-32">
              <div className="animate-spin w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full"></div>
            </div>
          )}

          {/* ❌ Error State */}
          {!loading && fetchError && (
            <div className="flex flex-col items-center justify-center py-32 text-gray-700 dark:text-gray-300">
              <p className="mb-4 text-lg">Failed to load your cart 😞</p>
              <button
                onClick={fetchCart}
                className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-3 rounded-xl transition"
              >
                Retry
              </button>
            </div>
          )}

          {/* ✅ Cart Display */}
          {!loading && !fetchError && (
            <>
              {cart?.products?.length > 0 ? (
                <CartFilled cart={cart} refreshCart={fetchCart} />
              ) : (
                <CartEmpty />
              )}
            </>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
};

export default CartPage;
