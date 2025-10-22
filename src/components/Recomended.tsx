"use client";
import React, { useEffect, useState } from "react";
import ShoeCard from "./ShoeCard";
import { Product } from "@/interface/interface";
import { getRandomProducts } from "@/services/store";
import { motion } from "framer-motion";

const Recommended = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const getShoes = async () => {
    try {
      setLoading(true);
      const res = await getRandomProducts();
      setProducts(res?.products || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getShoes();
  }, []);

  return (
    <div className="px-6 mb-[60px] bg-white dark:bg-[#0f0f0f] transition-colors duration-500">
      <h4 className="font-semibold capitalize text-2xl md:text-3xl mb-[25px] text-gray-900 dark:text-gray-100">
        Recommended for you
      </h4>

      {loading ? (
        <div className="flex justify-center py-12 text-gray-500 dark:text-gray-400 text-sm">
          Loading recommendations...
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400 text-sm">
          No recommendations available
        </div>
      ) : (
        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            show: { transition: { staggerChildren: 0.15 } },
          }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
        >
          {products.map((product) => (
            <motion.div
              key={product._id}
              variants={{
                hidden: { opacity: 0, scale: 0.95 },
                show: {
                  opacity: 1,
                  scale: 1,
                  transition: { duration: 0.3, ease: "easeOut" },
                },
              }}
            >
              <ShoeCard product={product} isFav={false} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default Recommended;
