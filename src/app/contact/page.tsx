"use client";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { sendMessage } from "@/services/insta";
import { toast } from "sonner";

const Page = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const container = {
    show: {
      transition: { staggerChildren: 0.25 },
    },
  };

  const item = {
    hidden: { y: 40, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { ease: "easeOut", duration: 0.6 } },
  };

  // 🔹 Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate
    if (!form.name || !form.email || !form.subject || !form.message) {
      toast.warning("All fields are required");
      return;
    }

    try {
      setLoading(true);
      const res = await sendMessage(form);

      if (res.status === 200 || res.status === 201) {
        toast.success(res.data?.message || "Message sent successfully");
        setForm({ name: "", email: "", subject: "", message: "" }); // Reset form
      } else {
        toast.error(res?.response?.data?.error || "Failed to send message");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <section className="bg-white py-16 px-4 text-gray-900">
        <div className="max-w-7xl mx-auto">
          {/* Heading */}
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold uppercase tracking-wide">
              Customer Care
            </h1>
            <p className="text-gray-500 text-sm sm:text-base mt-2 max-w-md mx-auto">
              Reach out with any questions, feedback, or support requests. We’re
              here to help.
            </p>
          </div>

          {/* Layout */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-12">
            {/* Image */}
            <div className="w-full md:w-1/2 flex justify-center">
              <img
                src="https://media4.giphy.com/media/dXQySomSteGzajNFmD/giphy.gif?cid=6c09b952e2858279ed861eac4aeb83f6727458f8be9fc5e9&ep=v1_internal_gifs_gifId&rid=giphy.gif&ct=g"
                alt="support-animation"
                className="rounded-2xl shadow-2xl w-[85%] md:w-[90%] object-cover border border-gray-300"
              />
            </div>

            {/* Form */}
            <motion.form
              initial="hidden"
              animate="show"
              variants={container}
              onSubmit={handleSubmit}
              className="w-full md:w-1/2 bg-gray-50 border border-gray-200 rounded-2xl p-8 md:p-10 shadow-lg"
            >
              <motion.div className="mb-6" variants={item}>
                <label className="block text-gray-700 font-medium mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full p-3 bg-transparent border border-gray-400 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-800"
                  required
                />
              </motion.div>

              <motion.div className="mb-6" variants={item}>
                <label className="block text-gray-700 font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full p-3 bg-transparent border border-gray-400 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-800"
                  required
                />
              </motion.div>

              <motion.div className="mb-6" variants={item}>
                <label className="block text-gray-700 font-medium mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="Enter the subject"
                  className="w-full p-3 bg-transparent border border-gray-400 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-800"
                  required
                />
              </motion.div>

              <motion.div className="mb-6" variants={item}>
                <label className="block text-gray-700 font-medium mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Write your message..."
                  className="w-full p-3 bg-transparent border border-gray-400 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-800 resize-none"
                  required
                ></textarea>
              </motion.div>

              <motion.button
                variants={item}
                type="submit"
                disabled={loading}
                className={`w-full font-semibold py-3 rounded-lg transition-all duration-300 ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gray-800 hover:bg-black text-white"
                }`}
              >
                {loading ? "Sending..." : "Send Message"}
              </motion.button>
            </motion.form>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Page;
