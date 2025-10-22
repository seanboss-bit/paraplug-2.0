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
      className="hover:shadow-xl p-5 rounded-[20px] bg-gray-50 cursor-pointer relative block"
      onClick={() => localStorage.setItem("product_id", product?._id)}
    >
      <Image
        width={100}
        height={100}
        alt="shoe"
        src={product?.image}
        className="w-full h-[150px] object-contain"
      />
      <div>
        <p className="uppercase text-[13px] font-semibold">
          {product?.category}
        </p>
        <p className="truncate text-[12px] uppercase">{product?.name}</p>
        <div className="text-[10px] flex items-center justify-between mt-[15px]">
          <p className="font-semibold">₦ {numberWithCommas(product?.price)}</p>
          {product?.slashPrice && (
            <p className="text-red-500 line-through font-semibold">
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
              ? "bg-rose-100 text-rose-500"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          {favLoading ? (
            <span className="animate-spin border-2 border-rose-500 border-t-transparent rounded-full w-5 h-5"></span>
          ) : product?.isFavourite ? (
            <HeartIcon className="size-5 fill-rose-500" />
          ) : (
            <HeartIcon className="size-5" />
          )}
        </div>
      )}
    </LoadingLink>
  );
};

export default ShoeCard;
