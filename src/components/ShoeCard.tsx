"use client";
import { Product } from "@/interface/interface";
import { useLoading } from "@/providers/LoadingProvider";
import { likeProduct } from "@/services/store";
import { useUserStore } from "@/store/userStore";
import { numberWithCommas } from "@/utils/functions";
import { HeartIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import React, { useState } from "react";
import { toast } from "sonner";

interface ShoeCardProp {
  product: Product;
  refresh?: (soft?: boolean) => void;
  isFav?: boolean;
}

const ShoeCard = ({ product, refresh, isFav = true }: ShoeCardProp) => {
  const { LoadingLink } = useLoading();
  const [favLoading, setFavLoading] = useState(false);
  const { user } = useUserStore();

  // ✅ Compute days since product was added
  const daysSinceAdded = product?.createdAt
    ? Math.floor(
        (Date.now() - new Date(product.createdAt).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : 9999;

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user?._id) {
      toast.error("Please log in to like products");
      return;
    }

    try {
      setFavLoading(true);
      const res = await likeProduct(product?._id as string);
      if (res.status === 200 || res.status === 201) {
        toast.success(res.data?.message);
        refresh && refresh(true);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message || "Failed to update favourite");
    } finally {
      setFavLoading(false);
    }
  };

  return (
    <LoadingLink
      href="/shoe"
      className="hover:shadow-xl p-5 rounded-[20px] bg-gray-50 dark:bg-gray-800 cursor-pointer relative block"
      onClick={() => localStorage.setItem("product_id", product?._id)}
    >
      {/* ✅ NEW tag */}
      {daysSinceAdded <= 7 && (
        <span className="absolute top-3 left-3 bg-rose-500 text-white dark:bg-rose-600 text-[10px] font-semibold px-2 py-[2px] rounded-full shadow-sm tracking-wide uppercase">
          New
        </span>
      )}

      <Image
        width={100}
        height={100}
        alt="shoe"
        src={product?.image}
        className="w-full h-[150px] object-contain"
      />
      <div>
        <p className="uppercase text-[13px] font-semibold text-gray-900 dark:text-gray-100">
          {product?.category}
        </p>
        <p className="truncate text-[12px] uppercase text-gray-900 dark:text-gray-100">
          {product?.name}
        </p>
        <div className="text-[10px] flex items-center justify-between mt-[15px]">
          <p className="font-semibold text-gray-900 dark:text-gray-100">
            ₦ {numberWithCommas(product?.price)}
          </p>
          {product?.slashPrice && (
            <p className="text-red-500 dark:text-red-400 line-through font-semibold">
              ₦ {numberWithCommas(product?.slashPrice)}
            </p>
          )}
        </div>
      </div>

      {isFav && (
        <div
          onClick={handleLike}
          className={`h-[40px] w-[40px] absolute top-[10px] right-[20px] rounded-full flex items-center justify-center transition ${
            product?.isFavourite
              ? "bg-rose-100 dark:bg-rose-900/30 text-rose-500"
              : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
          }`}
        >
          {favLoading ? (
            <span className="animate-spin border-2 border-rose-500 border-t-transparent rounded-full w-5 h-5"></span>
          ) : product?.isFavourite ? (
            <HeartIcon className="size-5 fill-rose-500" />
          ) : (
            <HeartIcon className="size-5 text-gray-900 dark:text-gray-100" />
          )}
        </div>
      )}
    </LoadingLink>
  );
};

export default ShoeCard;
