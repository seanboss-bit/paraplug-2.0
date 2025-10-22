"use client";
import { motion } from "framer-motion";
import { FaInstagram, FaTwitter, FaSnapchatGhost } from "react-icons/fa";
import { useLoading } from "@/providers/LoadingProvider";

const Footer = () => {
  const { LoadingLink } = useLoading();
  return (
    <footer className="bg-neutral-950 text-gray-300 py-16 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Brand Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h4 className="text-3xl font-extrabold text-white mb-4 tracking-tight">
            Paraplug<span className="text-rose-500">.</span>
          </h4>
          <p className="text-gray-400 leading-relaxed text-sm">
            Explore exclusive sneakers, limited editions, and authentic
            streetwear. Join the paraplug community — where every step defines
            style and confidence.
          </p>
        </motion.div>

        {/* Air Jordan Category */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h5 className="text-lg font-semibold text-white mb-3">Air Jordan</h5>
          <ul className="space-y-2 text-sm text-gray-400">
            {[
              "Air Jordan 1",
              "Womens Jordan",
              "Air Jordan 11",
              "Air Jordan 4",
              "Jordan 1 Mid",
            ].map((item) => (
              <li
                key={item}
                className="hover:text-rose-500 transition-colors duration-300 cursor-pointer"
              >
                {item}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Nike Category */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h5 className="text-lg font-semibold text-white mb-3">Nike</h5>
          <ul className="space-y-2 text-sm text-gray-400">
            {[
              "Nike Dunk",
              "Nike SB Dunk",
              "Nike Blazer",
              "Nike Air Force 1",
              "Womens Air Force 1s",
              "Womens Nike Dunks",
              "Nike Running Shoes",
            ].map((item) => (
              <li
                key={item}
                className="hover:text-rose-500 transition-colors duration-300 cursor-pointer"
              >
                {item}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Quick Links & Socials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col justify-between"
        >
          <div>
            <h5 className="text-lg font-semibold text-white mb-3">
              Quick Links
            </h5>
            <div className="flex flex-col space-y-2 text-sm text-gray-400">
              <LoadingLink
                href="/store"
                className="hover:text-rose-500 transition-colors"
              >
                Store
              </LoadingLink>
              <LoadingLink
                href="/about"
                className="hover:text-rose-500 transition-colors"
              >
                About Us
              </LoadingLink>
              <LoadingLink
                href="/contact"
                className="hover:text-rose-500 transition-colors"
              >
                Contact Us
              </LoadingLink>
            </div>
          </div>

          <div className="mt-8">
            <h6 className="text-sm uppercase tracking-wider text-gray-400 mb-3">
              Follow us
            </h6>
            <div className="flex space-x-4">
              <a
                href="https://www.instagram.com/para_plug"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-full bg-neutral-800 hover:bg-rose-600 transition-all"
              >
                <FaInstagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.twitter.com/para_plug"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-full bg-neutral-800 hover:bg-rose-600 transition-all"
              >
                <FaTwitter className="w-5 h-5" />
              </a>
              <a
                href="https://www.snapchat.com/add/para_plug"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-full bg-neutral-800 hover:bg-rose-600 transition-all"
              >
                <FaSnapchatGhost className="w-5 h-5" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Divider */}
      <div className="border-t border-neutral-800 mt-16 pt-8 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} paraplug. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
