"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLoading } from "@/providers/LoadingProvider";
import { InstagramPost } from "@/interface/interface";
import { getIGPosts } from "@/services/insta";
import Image from "next/image";

const Instagram = () => {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);
  const { LoadingLink } = useLoading();

  const getPosts = async () => {
    try {
      const res = await getIGPosts();
      setPosts(res?.allPost);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <section className="bg-gray-50 dark:bg-gray-900 py-16 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-3 text-gray-900 dark:text-gray-100">
          #GotItOnParaplug
        </h2>
        <p className="text-gray-500 dark:text-gray-300 mb-10 text-sm md:text-base">
          Tag your photos with{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
            #GotItOnParaplug
          </span>{" "}
          on Instagram and get featured here!
        </p>

        {loading ? (
          <p className="text-gray-400 dark:text-gray-500 text-sm">
            Loading posts...
          </p>
        ) : posts.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No posts yet</p>
        ) : (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { staggerChildren: 0.1 },
              },
            }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
          >
            {posts.map((post) => (
              <motion.div
                key={post._id}
                variants={{
                  hidden: { opacity: 0, scale: 0.95 },
                  visible: { opacity: 1, scale: 1 },
                }}
                className="relative group overflow-hidden rounded-xl shadow-sm hover:shadow-lg bg-white dark:bg-gray-800 transition-colors duration-500"
              >
                <Image
                  src={post.image}
                  alt={post.username}
                  width={1100}
                  height={1100}
                  className="w-full h-[400px] object-cover group-hover:scale-110 transition duration-300"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center text-white space-y-2">
                  <LoadingLink
                    href="/store"
                    className="px-4 py-2 bg-white dark:bg-gray-900 text-black dark:text-white text-sm rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  >
                    Shop Now
                  </LoadingLink>
                  <p className="text-xs">@{post.username}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Instagram;
