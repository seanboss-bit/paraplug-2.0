"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { StarIcon } from "@heroicons/react/24/solid";
import { handleWebsiteReviews } from "@/services/insta"; // ✅ use your website review fetcher
import { Review } from "@/interface/interface";
import Image from "next/image";

export default function WebsiteReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const getReviews = async () => {
    try {
      setLoading(true);
      const res = await handleWebsiteReviews(); // ✅ fetch from /review/website
      const data = res?.data?.reviews || res || [];
      setReviews(data);
    } catch (err) {
      console.error("Failed to load website reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getReviews();
  }, []);

  return (
    <div className="px-6 bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <section className="relative py-16 px-6 sm:px-10 overflow-hidden mb-[50px]">
        {/* ✨ Stylish neutral gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 rounded-3xl shadow-2xl transition-colors duration-300"></div>

        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl font-bold mb-6 text-gray-900 dark:text-gray-100 transition-colors duration-300"
          >
            What People Say About Us
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-10 transition-colors duration-300"
          >
            Hear from our amazing users about their experience on our platform.
          </motion.p>

          {/* 🌀 Loader */}
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-10 h-10 border-4 border-gray-300 dark:border-gray-700 border-t-yellow-400 rounded-full animate-spin"></div>
            </div>
          ) : reviews.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 transition-colors duration-300">
              No website reviews yet.
            </p>
          ) : (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.2 } },
              }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6"
            >
              {reviews.map((review, index) => (
                <motion.div
                  key={review._id || index}
                  variants={{
                    hidden: { opacity: 0, y: 40 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.6 }}
                  whileHover={{ scale: 1.03 }}
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-2xl p-6 text-left shadow-lg hover:shadow-yellow-100/20 dark:hover:shadow-yellow-900/10 transition-all duration-300"
                >
                  {/* User Info */}
                  <div className="flex items-center gap-3 mb-4">
                    <Image
                      src={
                        review?.userId?.image ||
                        `https://api.dicebear.com/7.x/avataaars/svg?seed=${review.userId?.username}`
                      }
                      alt={review.userId?.username}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-yellow-400/50"
                      width={1100}
                      height={1100}
                    />
                    <div>
                      <p className="text-gray-900 dark:text-gray-100 capitalize font-medium transition-colors duration-300">
                        {review.userId?.username || "Anonymous"}
                      </p>
                      <p className="text-gray-500 dark:text-gray-400 text-xs transition-colors duration-300">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Stars */}
                  <div className="flex mb-3">
                    {Array.from({ length: 5 }, (_, i) => (
                      <StarIcon
                        key={i}
                        className={`w-5 h-5 transition-colors duration-300 ${
                          i < review.rating
                            ? "text-yellow-400"
                            : "text-gray-300 dark:text-gray-600"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Comment */}
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed transition-colors duration-300">
                    “{review.comment}”
                  </p>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        {/* 🌟 Floating glow animations */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="absolute top-10 left-10 w-72 h-72 bg-yellow-400 dark:bg-yellow-600 rounded-full blur-3xl transition-colors duration-300"
        ></motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 1,
          }}
          className="absolute bottom-10 right-10 w-64 h-64 bg-gray-500 dark:bg-gray-700 rounded-full blur-3xl transition-colors duration-300"
        ></motion.div>
      </section>
    </div>
  );
}
