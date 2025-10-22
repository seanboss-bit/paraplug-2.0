"use client";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import ShoeCard from "@/components/ShoeCard";
import { getProducts, ProductQuery } from "@/services/store";
import { toast } from "sonner";
import { Product } from "@/interface/interface";

const LIMIT = 15;

const Page = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [skip, setSkip] = useState(0);

  // filters
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"newest" | "asc" | "desc">("newest");
  const [category, setCategory] = useState<string>("all");

  const observerRef = useRef<HTMLDivElement | null>(null);

  // 🧠 Fetch products
  const fetchProducts = useCallback(
    async (reset = false, customSkip?: number) => {
      try {
        setLoading(true);
        const sortMap: Record<string, string> = {
          newest: "new",
          asc: "low",
          desc: "high",
        };

        const currentSkip = customSkip ?? (reset ? 0 : skip);
        const res = await getProducts({
          search: search || undefined,
          sort: sortMap[sort],
          category: category !== "all" ? category : undefined,
          skip: currentSkip,
          limit: LIMIT,
        } as ProductQuery);

        const fetched = res?.products || [];
        setHasMore(fetched.length === LIMIT);

        if (reset) {
          setProducts(fetched);
          setSkip(LIMIT);
        } else if (customSkip !== undefined) {
          // Replace only that section (for refresh)
          const updated = [...products];
          const start = customSkip;
          for (let i = 0; i < fetched.length; i++) {
            updated[start + i] = fetched[i];
          }
          setProducts(updated);
        } else {
          setProducts((prev) => [...prev, ...fetched]);
          setSkip((prev) => prev + LIMIT);
        }
      } catch (error) {
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    },
    [search, sort, category, skip, products]
  );

  // 🧭 Debounced filters/search
  useEffect(() => {
    const delay = setTimeout(() => {
      setSkip(0);
      setHasMore(true);
      fetchProducts(true);
    }, 500);
    return () => clearTimeout(delay);
  }, [search, sort, category]);

  // 🔁 Infinite Scroll Observer
  useEffect(() => {
    if (loading) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchProducts();
        }
      },
      { threshold: 1.0 }
    );

    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [hasMore, loading, fetchProducts]);

  // 🏁 Initial Load
  useEffect(() => {
    localStorage.removeItem("product_id");
    fetchProducts(true);
  }, []);

  return (
    <>
      <Navbar />
      <section className="bg-white text-gray-900 min-h-screen">
        {/* Filters Section */}
        <div className="sticky top-[80px] z-40 bg-white/90 backdrop-blur-sm shadow-sm border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Search */}
            <div className="flex items-center w-full sm:w-[40%] border border-gray-300 rounded-full overflow-hidden">
              <input
                type="text"
                placeholder="Search sneakers..."
                className="flex-1 px-4 py-2 text-sm focus:outline-none bg-transparent"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button className="px-3 text-gray-600 hover:text-gray-800 transition">
                <MagnifyingGlassIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Sort + Category Filters */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <select
                value={sort}
                onChange={(e) =>
                  setSort(e.target.value as "newest" | "asc" | "desc")
                }
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none hover:border-gray-500 transition"
              >
                <option value="newest">Newest</option>
                <option value="asc">Price: Low → High</option>
                <option value="desc">Price: High → Low</option>
              </select>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none hover:border-gray-500 transition"
              >
                <option value="all">All</option>
                <option value="jordans">Air Jordan</option>
                <option value="nikes">Nike</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Results */}
        <div className="max-w-7xl mx-auto px-4 py-10">
          {products.length === 0 && !loading ? (
            <div className="text-center py-20 text-gray-500 text-sm">
              No products found
            </div>
          ) : (
            <motion.div
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: {
                  transition: {
                    staggerChildren: 0.15, // ⏱️ Stagger timing
                  },
                },
              }}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
            >
              {products.map((product, i) => (
                <motion.div
                  key={i}
                  variants={{
                    hidden: { opacity: 0, scale: 0.9, y: 20 },
                    show: {
                      opacity: 1,
                      scale: 1,
                      y: 0,
                      transition: { duration: 0.4, ease: "easeOut" },
                    },
                  }}
                >
                  <ShoeCard
                    product={product}
                    refresh={() =>
                      fetchProducts(false, Math.floor(i / LIMIT) * LIMIT)
                    }
                  />
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Infinite Scroll Trigger */}
          <div
            ref={observerRef}
            className="h-10 mt-10 flex justify-center items-center"
          >
            {loading && (
              <p className="text-gray-500 text-sm">Loading more...</p>
            )}
            {!hasMore && !loading && products.length > 0 && (
              <p className="text-gray-400 text-xs">
                That is all the kicks we have for now
              </p>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Page;
