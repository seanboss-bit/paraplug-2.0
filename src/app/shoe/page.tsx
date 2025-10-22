"use client";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import React, { useState, useEffect } from "react";
import {
  HeartIcon,
  StarIcon as StarOutline,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { useLoading } from "@/providers/LoadingProvider";
import { Product, ProductReview } from "@/interface/interface";
import { toast } from "sonner";
import { getSingleProduct, likeProduct, postAReview } from "@/services/store";
import { useUserStore } from "@/store/userStore";
import { handleAddingToCart } from "@/services/cart";
import { useCartStore } from "@/store/cartStore";

const Page = () => {
  const id =
    typeof window !== "undefined" ? localStorage.getItem("product_id") : null;
  const [product, setProduct] = useState<Product | null>(null);
  const [mainImage, setMainImage] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(true);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [fetchError, setFetchError] = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  const { user } = useUserStore();
  const { LoadingLink } = useLoading();
  const { setCart } = useCartStore();

  const numberWithCommas = (x: number) =>
    x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  // Fetch product
  const fetchProduct = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const res = await getSingleProduct(id);
      setProduct(res?.product);
      setMainImage(res?.product?.image || res?.product.extraImg?.[0]);
    } catch (error) {
      setFetchError(true);
      toast.error("Failed to load product details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  // Submit Review
  const handleSubmitReview = async () => {
    if (rating === 0 || !review.trim()) {
      toast.error("Please select a rating and write a review");
      return;
    }

    try {
      setReviewLoading(true);
      await postAReview({ rating, comment: review }, id as string);
      toast.success("Review submitted successfully!");
      setShowReviewModal(false);
      setRating(0);
      setReview("");
      await fetchProduct(); // refresh reviews
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Failed to post review");
    } finally {
      setReviewLoading(false);
    }
  };

  // Retry
  const handleRetry = () => {
    setFetchError(false);
    fetchProduct();
  };

  // Like Product
  const handleLike = async () => {
    if (!user?._id) {
      toast.error("Please log in to like products");
      return;
    }

    try {
      setFavLoading(true);
      const res = await likeProduct(product?._id as string);
      if (res.status === 200 || res.status === 201) {
        toast.success(res.data?.message);
        fetchProduct();
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message || "Failed to update favourite");
    } finally {
      setFavLoading(false);
    }
  };

  const [cartLoading, setCartLoading] = useState(false);

  const addToCart = async () => {
    if (!user?._id) {
      toast.error("Please log in to add to cart");
      return;
    }

    if (product?.sizes?.length && !selectedSize) {
      toast.error("Please select a size");
      return;
    }

    try {
      setCartLoading(true);
      const res = await handleAddingToCart(
        id as string,
        selectedSize || undefined,
        1
      );
      setCart(res?.cart);
      toast.success("Item added to cart successfully!");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error || error.message || "Failed to add to cart"
      );
    } finally {
      setCartLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4 md:px-10">
        {/* BACK BUTTON */}
        <LoadingLink
          href="/store"
          className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-rose-500 transition mb-6"
        >
          ← Back to Store
        </LoadingLink>

        {/* LOADING */}
        {loading && (
          <div className="flex justify-center items-center h-[50vh]">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-rose-500"></div>
          </div>
        )}

        {/* ERROR */}
        {!loading && fetchError && (
          <div className="flex flex-col justify-center items-center h-[50vh] text-gray-700 dark:text-gray-300">
            <p className="mb-4 text-lg">Failed to load product 😞</p>
            <button
              onClick={handleRetry}
              className="bg-rose-500 text-white px-6 py-3 rounded-xl hover:bg-rose-600"
            >
              Retry
            </button>
          </div>
        )}

        {/* PRODUCT DETAILS */}
        {!loading && product && (
          <div className="grid md:grid-cols-2 gap-10 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            {/* IMAGES */}
            <div>
              <div className="w-full h-96 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center overflow-hidden mb-4">
                {mainImage ? (
                  <Image
                    src={mainImage}
                    alt={product.name}
                    width={500}
                    height={500}
                    className="object-contain w-full md:w-[500px] md:h-[500px]"
                  />
                ) : (
                  <div className="text-gray-400 dark:text-gray-500">
                    No Image
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-3 justify-center">
                {[product.image, ...(product.extraImg || [])].map(
                  (img, i) =>
                    img && (
                      <Image
                        key={i}
                        src={img}
                        alt={`thumb-${i}`}
                        width={80}
                        height={80}
                        onClick={() => setMainImage(img)}
                        className={`cursor-pointer object-contain rounded-lg border-2 transition-all ${
                          mainImage === img
                            ? "border-rose-500"
                            : "border-transparent hover:border-gray-400 dark:hover:border-gray-500"
                        }`}
                      />
                    )
                )}
              </div>
            </div>

            {/* DETAILS */}
            <div className="flex flex-col justify-between">
              <div>
                <h3 className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                  {product.category}
                </h3>
                <h2 className="text-3xl capitalize font-bold text-gray-900 dark:text-gray-100 mb-3">
                  {product.name}
                </h2>

                <div className="flex items-center gap-4 mb-3">
                  <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                    ₦{numberWithCommas(product.price)}
                  </p>
                  {product.slashPrice && (
                    <p className="text-gray-400 dark:text-gray-500 line-through">
                      ₦{numberWithCommas(product.slashPrice)}
                    </p>
                  )}
                </div>

                {product.freeShipping && (
                  <p className="text-sm text-green-500 dark:text-green-400 font-medium mb-4">
                    + Free Shipping
                  </p>
                )}

                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  {product.description}
                </p>

                {/* SIZES */}
                {product.sizes && product.sizes.length > 0 && (
                  <>
                    <h4 className="text-gray-800 dark:text-gray-200 font-semibold mb-2">
                      Select Size
                    </h4>
                    <div className="flex flex-wrap gap-3 mb-8">
                      {product.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`w-12 h-12 flex items-center justify-center rounded-full border-2 transition text-gray-900 dark:text-gray-100 ${
                            selectedSize === size
                              ? "border-rose-500 bg-rose-50 dark:bg-rose-900/20"
                              : "border-gray-400 dark:border-gray-500 hover:border-rose-300 dark:hover:border-rose-400"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {/* ACTIONS */}
                <div className="flex items-center gap-5">
                  <button
                    onClick={addToCart}
                    disabled={cartLoading}
                    className={`${
                      cartLoading
                        ? "bg-rose-400 cursor-not-allowed"
                        : "bg-rose-500 hover:bg-rose-600"
                    } flex-1 text-white px-6 py-3 rounded-xl font-medium transition w-full md:w-auto flex items-center justify-center`}
                  >
                    {cartLoading ? (
                      <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5"></span>
                    ) : (
                      "Add to Cart"
                    )}
                  </button>
                  <div
                    onClick={handleLike}
                    className={`h-[40px] w-[40px] rounded-full flex items-center justify-center transition cursor-pointer ${
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
                      <HeartIcon className="size-5" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* REVIEWS */}
        {!loading && product && (
          <div className="mt-16 mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="md:text-2xl font-semibold text-gray-900 dark:text-gray-100">
                Customer Reviews
              </h2>
              <button
                onClick={() => setShowReviewModal(true)}
                className="bg-gray-900 dark:bg-gray-700 hover:bg-gray-700 dark:hover:bg-gray-600 text-white px-5 py-3 rounded-xl transition"
              >
                Leave a Review
              </button>
            </div>

            {(!product.review || product.review.length === 0) && (
              <p className="text-gray-500 dark:text-gray-400 text-center py-10">
                No reviews yet. Be the first to share your thoughts!
              </p>
            )}

            <div className="space-y-6 grid grid-cols-1 md:grid-cols-3">
              {product.review?.map((r: ProductReview, i: number) => (
                <div
                  key={i}
                  className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 capitalize">
                      {r.username || "Anonymous"}
                    </h4>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, idx) =>
                        idx < r.rating ? (
                          <StarIcon
                            key={idx}
                            className="w-5 h-5 text-yellow-400"
                          />
                        ) : (
                          <StarOutline
                            key={idx}
                            className="w-5 h-5 text-gray-300 dark:text-gray-600"
                          />
                        )
                      )}
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-2 leading-relaxed">
                    {r.comment}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* REVIEW MODAL */}
        {showReviewModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] px-4">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl w-full max-w-md relative shadow-lg">
              <button
                onClick={() => setShowReviewModal(false)}
                className="absolute top-3 right-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Leave a Product Review
              </h3>

              <div className="flex items-center gap-1 mb-6">
                {[1, 2, 3, 4, 5].map((value) =>
                  value <= (hoverRating || rating) ? (
                    <StarIcon
                      key={value}
                      onClick={() => setRating(value)}
                      onMouseEnter={() => setHoverRating(value)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="w-8 h-8 text-yellow-400 cursor-pointer transition-transform hover:scale-110"
                    />
                  ) : (
                    <StarOutline
                      key={value}
                      onClick={() => setRating(value)}
                      onMouseEnter={() => setHoverRating(value)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="w-8 h-8 text-gray-400 dark:text-gray-500 cursor-pointer transition-transform hover:scale-110"
                    />
                  )
                )}
              </div>

              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Write your review..."
                className="w-full h-32 p-4 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-600 mb-4 resize-none"
              ></textarea>

              <button
                onClick={handleSubmitReview}
                disabled={reviewLoading}
                className={`${
                  reviewLoading
                    ? "bg-gray-500"
                    : "bg-gray-900 dark:bg-gray-700 hover:bg-gray-700 dark:hover:bg-gray-600"
                } text-white px-6 py-3 rounded-xl transition w-full font-medium flex items-center justify-center`}
              >
                {reviewLoading ? (
                  <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5"></span>
                ) : (
                  "Submit Review"
                )}
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Page;
