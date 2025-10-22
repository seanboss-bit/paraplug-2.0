"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLoading } from "@/providers/LoadingProvider";

interface ShowcaseItem {
  id: number;
  title: string;
  description: string;
  image: string;
  link: string;
}

const showcaseItems: ShowcaseItem[] = [
  {
    id: 1,
    title: "Nike SB X Powerpuff Girls",
    description: `Sugar, Spice, and Everything Nice: The Nike SB Dunk Low Powerpuff Girls Collection. Straight outta Townsville, the Powerpuff Girls are taking over your kicks! Each shoe features vibrant colorways inspired by Blossom, Bubbles, and Buttercup. A true celebration of female power and playful energy.`,
    image: "/images/four.jpeg",
    link: "/store",
  },
  {
    id: 2,
    title: "Nike x Corteiz Air Max 95 SP Gutta Green",
    description: `Born on the streets of London — the Nike Air Max 95 SP x Corteiz blends classic design with rugged streetwear flair. Pops of yellow on military green make a bold statement of urban confidence.`,
    image: "/images/two.jpg",
    link: "/store",
  },
  {
    id: 3,
    title: "Nike x Nocta Glide White Chrome",
    description: `Drake’s NOCTA collab brings effortless luxury. Chrome detailing, a white mesh upper, and inspiration from the Zoom Flight 95 combine performance and style seamlessly.`,
    image: "/images/five.jpeg",
    link: "/store",
  },
];

const Showcase: React.FC = () => {
  const [active, setActive] = useState<number | null>(0);
  const { LoadingLink } = useLoading();

  return (
    <section className="w-full flex flex-col items-center justify-center mb-[50px] bg-white px-6">
      <motion.div
        className="flex flex-col lg:flex-row w-full max-w-7xl h-[800px] md:h-[600px] rounded-2xl overflow-hidden"
        layout
        transition={{ layout: { duration: 0.6, ease: "easeInOut" } }}
      >
        {showcaseItems.map((item) => {
          const isActive = active === item.id;
          return (
            <motion.div
              key={item.id}
              layout
              onClick={() => setActive(item.id)}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className={`relative flex flex-col justify-end cursor-pointer overflow-hidden transition-all ${
                isActive
                  ? "flex-[3] lg:flex-[3]"
                  : "flex-[1] lg:flex-[1] brightness-75 hover:brightness-100"
              }`}
            >
              {/* Background Image */}
              <motion.div
                layout
                className="absolute inset-0 bg-cover bg-center transition-all duration-700"
                style={{ backgroundImage: `url(${item.image})` }}
              />

              {/* Dark overlay for better text contrast */}
              <div className="absolute inset-0 bg-black/40"></div>

              {/* Content */}
              <motion.div
                layout
                className={`relative z-10 text-white p-6 transition-all duration-700 ${
                  isActive
                    ? "backdrop-blur-sm bg-black/40 rounded-t-2xl"
                    : "bg-gradient-to-t from-black/60 to-transparent"
                }`}
              >
                <motion.h3
                  layout="position"
                  className="text-2xl font-bold mb-2 drop-shadow-md"
                >
                  {item.title}
                </motion.h3>

                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      key="desc"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.5 }}
                    >
                      <p className="text-sm leading-relaxed mb-4">
                        {item.description}
                      </p>
                      <LoadingLink
                        href={item.link}
                        className="inline-block bg-white text-black font-semibold px-6 py-2 rounded-full hover:bg-rose-600 hover:text-white transition-all"
                      >
                        Shop Now
                      </LoadingLink>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
};

export default Showcase;
