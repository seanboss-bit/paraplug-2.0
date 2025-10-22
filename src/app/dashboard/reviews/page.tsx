"use client";
import { useEffect, useState, useMemo } from "react";
import { StarIcon } from "@heroicons/react/24/solid";
import { StarIcon as StarOutline } from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { MinimalProduct } from "@/interface/interface";
import {
  handleReviewProducts,
  submitProductReview,
  submitWebsiteReview,
} from "@/services/dashboard";
import { toast } from "sonner";
import Image from "next/image";

export default function ReviewsPage() {
  const [reviewType, setReviewType] = useState<"product" | "website">(
    "product"
  );
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<MinimalProduct | null>(
    null
  );
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [products, setProducts] = useState<MinimalProduct[]>([]);

  const [loadingProducts, setLoadingProducts] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const filteredProducts = useMemo(() => {
    return products.filter((p) =>
      p?.name?.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, products]);

  const getMinimalProducts = async () => {
    try {
      setLoadingProducts(true);
      const res = await handleReviewProducts();
      console.log(res);
      if (res?.data?.length) {
        setProducts(res?.data);
      } else {
        toast.warning("No products found for review.");
      }
    } catch (err) {
      toast.error("Failed to load products. Please try again.");
      console.error(err);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    if (reviewType === "product") {
      getMinimalProducts();
    }
  }, [reviewType]);

  const handleSubmit = async () => {
    if (reviewType === "product" && !selectedProduct) {
      toast.warning("Please select a product first.");
      return;
    }
    if (review.trim() === "" || rating === 0) {
      toast.warning("Please provide both a rating and a review.");
      return;
    }

    try {
      setSubmitting(true);

      if (reviewType === "product" && selectedProduct) {
        await submitProductReview(selectedProduct.id as string, rating, review);
      } else {
        await submitWebsiteReview(rating, review);
      }

      toast.success(
        `${
          reviewType === "product" ? "Product" : "Website"
        } review submitted successfully!`
      );

      setReview("");
      setRating(0);
      setSelectedProduct(null);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error);
      toast.error("Something went wrong while submitting your review.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 max-w-2xl mx-auto mt-6 relative">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
        Leave a Review
      </h2>

      <div className="flex gap-4 mb-6">
        {["product", "website"].map((type) => (
          <button
            key={type}
            onClick={() => {
              setReviewType(type as "product" | "website");
              setRating(0);
              setReview("");
              setSelectedProduct(null);
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              reviewType === type
                ? "bg-gray-900 text-white dark:bg-gray-700"
                : "bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300"
            }`}
          >
            {type === "product" ? "Product Review" : "Website Review"}
          </button>
        ))}
      </div>

      {reviewType === "product" && (
        <div className="relative mb-6">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-full flex justify-between items-center bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-4 py-3 rounded-lg focus:ring-2 focus:ring-gray-900"
          >
            {selectedProduct ? (
              <div className="flex items-center gap-3">
                <Image
                  src={selectedProduct.mainImg}
                  alt={selectedProduct.name}
                  className="w-8 h-8 object-contain rounded"
                  width={1100}
                  height={1100}
                />
                <span>{selectedProduct.name}</span>
              </div>
            ) : (
              <span>
                {loadingProducts
                  ? "Loading products..."
                  : "Select a product..."}
              </span>
            )}
            <ChevronDownIcon
              className={`w-5 h-5 transition-transform ${
                dropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {dropdownOpen && (
            <div className="absolute z-20 mt-2 w-full bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 max-h-64 overflow-y-auto">
              <div className="sticky top-0 bg-gray-100 dark:bg-gray-800 p-2 flex items-center gap-2 border-b border-gray-200 dark:border-gray-600">
                <MagnifyingGlassIcon className="w-5 h-5 text-gray-500 dark:text-gray-300" />
                <input
                  type="text"
                  placeholder="Search product..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-transparent w-full text-gray-900 dark:text-gray-100 outline-none"
                />
              </div>

              {loadingProducts ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4 animate-pulse">
                  Fetching products...
                </p>
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => {
                      setSelectedProduct(product);
                      setDropdownOpen(false);
                    }}
                    className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                  >
                    <Image
                      src={product.mainImg}
                      alt={product.name}
                      className="w-10 h-10 object-contain rounded"
                      width={1100}
                      height={1100}
                    />
                    <span className="text-gray-800 dark:text-gray-100">
                      {product.name}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                  No products found
                </p>
              )}
            </div>
          )}
        </div>
      )}

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
              className="w-8 h-8 text-gray-400 cursor-pointer transition-transform hover:scale-110"
            />
          )
        )}
        <span className="ml-3 text-gray-600 dark:text-gray-300 text-sm">
          {rating > 0 ? `${rating} / 5` : "Rate your experience"}
        </span>
      </div>

      <textarea
        value={review}
        onChange={(e) => setReview(e.target.value)}
        placeholder={`Write your ${reviewType} review here...`}
        className="w-full h-40 p-4 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 mb-4 resize-none"
      ></textarea>

      <button
        onClick={handleSubmit}
        disabled={submitting}
        className={`${
          submitting
            ? "bg-gray-600 cursor-not-allowed"
            : "bg-gray-900 hover:bg-gray-700"
        } text-white px-6 py-3 rounded-xl transition w-full font-medium`}
      >
        {submitting ? "Submitting..." : "Submit Review"}
      </button>
    </div>
  );
}
