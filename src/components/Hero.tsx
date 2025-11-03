"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useLoading } from "@/providers/LoadingProvider";

interface HeroImage {
  id: number;
  src: string;
  alt: string;
}

const images: HeroImage[] = [
  {
    id: 1,
    src: "https://res.cloudinary.com/dvo4tlcrx/image/upload/v1754378703/wjxl7gignixizusvaubu.png",
    alt: "Sneaker 1",
  },
  {
    id: 2,
    src: "https://res.cloudinary.com/dvo4tlcrx/image/upload/v1753646420/mrzqco536ov7giskqnqm.png",
    alt: "Sneaker 2",
  },
  {
    id: 3,
    src: "https://res.cloudinary.com/dvo4tlcrx/image/upload/v1743547036/mlk3gmolwykopjsij8l9.png",
    alt: "Sneaker 3",
  },
  {
    id: 4,
    src: "https://res.cloudinary.com/dvo4tlcrx/image/upload/v1708597893/fjydqfwyr3a7chvitm5e.png",
    alt: "Sneaker 4",
  },
  {
    id: 5,
    src: "https://res.cloudinary.com/dvo4tlcrx/image/upload/v1707101345/fwjgllab8ylhcyd6aymc.png",
    alt: "Sneaker 5",
  },
  {
    id: 6,
    src: "https://res.cloudinary.com/dvo4tlcrx/image/upload/v1694392204/oxf7z9ncimx4cjjwxn5q.png",
    alt: "Sneaker 6",
  },
  {
    id: 7,
    src: "https://res.cloudinary.com/dvo4tlcrx/image/upload/v1697709188/m9whn4s9lorf1pmhtjym.png",
    alt: "Sneaker 7",
  },
  {
    id: 8,
    src: "https://res.cloudinary.com/dvo4tlcrx/image/upload/v1694905706/ewu4gd8nyyf2dkthchye.png",
    alt: "Sneaker 8",
  },
  {
    id: 9,
    src: "https://res.cloudinary.com/dvo4tlcrx/image/upload/v1720147052/t0b4wps2bqiqdvdlkl2p.png",
    alt: "Sneaker 9",
  },
  {
    id: 10,
    src: "https://res.cloudinary.com/dvo4tlcrx/image/upload/v1703979185/ia7pp3whtwjkvr7e7llc.png",
    alt: "Sneaker 10",
  },
];

const Hero: React.FC = () => {
  const [current, setCurrent] = useState<number>(0);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const thumbRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const { LoadingLink } = useLoading();

  // 🌀 Auto-scroll every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // 🎯 Scroll active thumbnail into view
  useEffect(() => {
    const activeThumb = thumbRefs.current[current];
    const container = scrollRef.current;

    if (activeThumb && container) {
      const thumbRect = activeThumb.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      const isOutOfView =
        thumbRect.left < containerRect.left ||
        thumbRect.right > containerRect.right;

      if (isOutOfView) {
        container.scrollTo({
          left:
            activeThumb.offsetLeft -
            container.offsetWidth / 2 +
            activeThumb.offsetWidth / 2,
          behavior: "smooth",
        });
      }
    }
  }, [current]);

  return (
    <section className="flex flex-col lg:flex-row items-center justify-between px-6 lg:px-20 py-12 overflow-hidden bg-white gap-9 dark:bg-gray-900 transition-colors duration-300">
      {/* 🧩 Text & Thumbnails */}
      <div className="w-full overflow-hidden lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight text-gray-900 dark:text-white transition-colors">
          Paraplug
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md transition-colors">
          Your Store For All Exclusive Nike And Jordan Sneakers — It’s all about
          new arrivals!!!
        </p>
        <LoadingLink
          href="/store"
          className="bg-black dark:bg-rose-600 hover:bg-rose-600 dark:hover:bg-rose-500 text-white font-semibold py-3 px-8 rounded-full transition-all"
        >
          Shop Now
        </LoadingLink>

        {/* 🖼 Thumbnail Scroll */}
        <div
          ref={scrollRef}
          className="flex gap-5 py-3 w-[600px] mt-10 overflow-x-scroll sean px-[20px] scrollbar-hide"
        >
          {images.map((img, index) => (
            <button
              key={img.id}
              ref={(el) => {
                thumbRefs.current[index] = el;
              }}
              onClick={() => setCurrent(index)}
              className={`relative min-w-20 h-20 rounded-xl border-2 transition-all ${
                index === current
                  ? "border-rose-500 scale-105"
                  : "border-transparent opacity-60 hover:opacity-100"
              } bg-gray-100 dark:bg-gray-800`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-contain rounded-xl"
              />
            </button>
          ))}
        </div>
      </div>

      {/* 🏆 Hero Image */}
      <div className="lg:w-1/2 flex justify-center mb-8 lg:mb-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={images[current].id}
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.6 }}
            className="relative w-[280px] h-[280px] sm:w-[350px] sm:h-[350px] lg:w-[420px] lg:h-[420px]"
          >
            <Image
              src={images[current].src}
              alt={images[current].alt}
              fill
              className="object-contain rounded-2xl rotate-[25deg]"
              priority
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Hero;
