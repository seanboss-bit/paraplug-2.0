"use client";
import Image from "next/image";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useLoading } from "@/providers/LoadingProvider";

const CartEmpty = () => {
  const { LoadingLink } = useLoading();
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-4">
      <Image
        src="https://illustrations.popsy.co/blue/shopping-empty-cart.svg"
        alt="Empty Cart"
        width={120}
        height={120}
        className="mb-6"
      />
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
        Your cart is empty
      </h2>
      <p className="text-gray-500 dark:text-gray-400 mb-6">
        Looks like you haven&lsquo;t added anything yet.
      </p>
      <LoadingLink
        href="/store"
        className="inline-flex items-center gap-2 bg-gray-900 dark:bg-gray-700 text-white px-6 py-3 rounded-xl hover:bg-gray-700 dark:hover:bg-gray-600 transition"
      >
        <ArrowLeftIcon className="size-5" /> Start Shopping
      </LoadingLink>
    </div>
  );
};

export default CartEmpty;
