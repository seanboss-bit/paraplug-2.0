"use client";
import { sendEmail } from "@/services/insta";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

const NewsLetter = () => {
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const submitMail = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      toast.warning("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);
      const res = await sendEmail(email);

      if (res.status === 200 || res.status === 201) {
        toast.success("🎉 Subscription successful!");
        setEmail("");
      } else {
        toast.error(res?.data?.message || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full flex flex-col lg:flex-row items-stretch bg-white dark:bg-[#0f0f0f] my-[50px] rounded-2xl overflow-hidden shadow-sm transition-colors duration-500">
      {/* Left side: Image */}
      <div className="relative w-full lg:w-2/5 h-[400px] lg:h-[500px]">
        <Image
          src="/images/one.jpg"
          alt="Newsletter Promo"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Right side: Content */}
      <div className="w-full lg:w-3/5 flex flex-col justify-center bg-rose-50 dark:bg-gray-900 px-8 lg:px-16 py-12 transition-colors duration-500">
        <div className="max-w-md">
          <h3 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            Join our community
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Get{" "}
            <span className="font-semibold text-rose-500 dark:text-rose-400">
              10% off
            </span>{" "}
            your first order and be the first to receive the latest updates on
            promotions, campaigns, and product launches.
          </p>

          <form
            onSubmit={submitMail}
            className="flex items-center bg-white dark:bg-gray-800 rounded-full shadow-sm overflow-hidden transition-colors duration-500"
          >
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-grow px-4 py-3 outline-none text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 bg-transparent"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading}
              className={`${
                loading
                  ? "bg-gray-700 dark:bg-gray-600"
                  : "bg-black dark:bg-rose-600 hover:bg-rose-600 dark:hover:bg-rose-500"
              } text-white px-5 py-3 flex items-center justify-center transition-all disabled:opacity-70 disabled:cursor-not-allowed`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <PaperAirplaneIcon className="w-5 h-5" />
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default NewsLetter;
