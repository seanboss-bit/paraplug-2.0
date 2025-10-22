"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { toast } from "sonner";
import { getProducts } from "@/services/store";
import Image from "next/image";
import { useLoading } from "@/providers/LoadingProvider";

interface Product {
  _id: string;
  name: string;
  image: string;
}

const LIMIT = 15;

const AllShoes = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const observer = useRef<IntersectionObserver | null>(null);
  const lastItemRef = useRef<HTMLDivElement | null>(null);
  const { LoadingLink } = useLoading();

  // 🔹 Fetch products
  const fetchProducts = useCallback(
    async (reset = false) => {
      if (loading) return;
      try {
        setLoading(true);
        const res = await getProducts({
          search: search || undefined,
          skip: reset ? 0 : skip,
          limit: LIMIT,
        });

        const fetched = res?.products || [];
        setHasMore(fetched.length === LIMIT);

        if (reset) {
          setProducts(fetched);
          setSkip(LIMIT);
        } else {
          setProducts((prev) => [...prev, ...fetched]);
          setSkip((prev) => prev + LIMIT);
        }
      } catch (error) {
        toast.error("Failed to load shoes");
      } finally {
        setLoading(false);
      }
    },
    [search, skip, loading]
  );

  // 🔹 Handle infinite scroll
  useEffect(() => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          fetchProducts();
        }
      },
      { threshold: 1.0 }
    );

    if (lastItemRef.current) observer.current.observe(lastItemRef.current);
  }, [hasMore, loading, fetchProducts]);

  // 🔹 Search effect
  useEffect(() => {
    const delay = setTimeout(() => fetchProducts(true), 500);
    return () => clearTimeout(delay);
  }, [search]);

  // 🔹 Initial load
  useEffect(() => {
    fetchProducts(true);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 md:py-8 md:px-4">
      {/* 🔍 Search Bar */}
      <div className="flex items-center justify-center mb-8">
        <div className="relative w-full max-w-md">
          <MagnifyingGlassIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search shoes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-none"
          />
        </div>
      </div>

      {/* 🏷️ Products Grid */}
      <motion.div
        layout
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6"
      >
        {products.map((product, index) => (
          <motion.div
            key={index}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
            className="bg-white rounded-xl shadow-md hover:shadow-lg overflow-hidden hover:scale-[1.02] transition-all"
          >
            <LoadingLink href={`/admin/kicks/${product._id}`}>
              <div className="aspect-square overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
                  width={1100}
                  height={1100}
                />
              </div>
              <div className="p-3 text-center">
                <p className="font-semibold capitalize text-gray-800 text-sm truncate">
                  {product.name}
                </p>
              </div>
            </LoadingLink>
          </motion.div>
        ))}
      </motion.div>

      {/* 🌀 Infinite Scroll Loader */}
      <div ref={lastItemRef} className="flex justify-center py-10">
        {loading && (
          <div className="w-6 h-6 border-4 border-black border-t-transparent rounded-full animate-spin" />
        )}
        {!hasMore && !loading && (
          <p className="text-gray-500 text-sm">No more shoes to load 👟</p>
        )}
      </div>
    </div>
  );
};

export default AllShoes;
