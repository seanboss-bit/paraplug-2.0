"use client";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { EnvelopeIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import React from "react";
import { FaInstagram, FaTwitter, FaSnapchatGhost } from "react-icons/fa";

const page = () => {
  return (
    <>
      <Navbar />
      <section className="bg-white dark:bg-gray-900 py-16 px-4 font-poppins text-gray-800 dark:text-gray-100">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold uppercase tracking-wide text-gray-900 dark:text-gray-100">
              Refund Policy
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base mt-2">
              Process to return your package
            </p>
          </div>

          {/* Main Content */}
          <div className="flex flex-col md:flex-row gap-10 md:gap-16">
            {/* Contact Section */}
            <div className="md:w-1/3 bg-gray-50 dark:bg-gray-800 p-6 rounded-2xl shadow-md">
              <div className="space-y-5">
                <div>
                  <h6 className="text-sm font-semibold uppercase text-gray-600 dark:text-gray-400">
                    Email:
                  </h6>
                  <p className="text-gray-700 dark:text-gray-200">
                    paraplugs@gmail.com
                  </p>
                </div>

                <div>
                  <h6 className="text-sm font-semibold uppercase text-gray-600 dark:text-gray-400">
                    Phone:
                  </h6>
                  <p className="text-gray-700 dark:text-gray-200">
                    +234 812 9198 327
                  </p>
                </div>

                {/* Socials (clickable links) */}
                <div className="flex items-center gap-4 mt-4 text-2xl">
                  <a
                    href="https://www.instagram.com/para_plug"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Paraplug on Instagram"
                    className="text-gray-700 dark:text-gray-200 hover:text-rose-500 transition"
                  >
                    <FaInstagram />
                  </a>

                  <a
                    href="https://www.twitter.com/para_plug"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Paraplug on Twitter"
                    className="text-gray-700 dark:text-gray-200 hover:text-rose-500 transition"
                  >
                    <FaTwitter />
                  </a>

                  <a
                    href="https://www.snapchat.com/add/para_plug"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Paraplug on Snapchat"
                    className="text-gray-700 dark:text-gray-200 hover:text-rose-500 transition"
                  >
                    <FaSnapchatGhost />
                  </a>
                </div>
              </div>
            </div>

            {/* Policy Text */}
            <div className="md:w-2/3 space-y-5 leading-relaxed">
              <p>
                Paraplug has a{" "}
                <span className="font-semibold">7 days return policy</span>.
                This means you have 7 days after receiving your package to
                request a return.
              </p>

              <p>
                To start your return, contact us at{" "}
                <a
                  href="mailto:paraplugs@gmail.com"
                  className="text-rose-600 dark:text-rose-400 underline hover:text-rose-500 dark:hover:text-rose-300"
                >
                  paraplugs@gmail.com
                </a>
                , or reach out via our social platforms (Instagram, WhatsApp,
                TikTok, and Twitter).
              </p>

              <p>
                To enable your return, your package must be in the same
                condition you received it—unworn or unused, in its original
                packaging, and with the receipt attached. Send your return
                package to:
              </p>

              <p className="font-medium">
                Rehoboth Plaza, NTA Second Gate, Rumoukuta, Port Harcourt,
                Rivers State.
              </p>

              <p className="uppercase font-bold text-rose-600 dark:text-rose-500">
                Re-Funds
              </p>

              <p>
                We’ll notify you once we’ve received your return to let you know
                if the refund was approved. If approved, your original payment
                will be refunded, and a receipt will be sent to you.
              </p>
            </div>
          </div>

          {/* Contact Button */}
          <div className="text-center mt-12">
            <Link
              href="mailto:paraplugs@gmail.com"
              className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 dark:bg-rose-500 dark:hover:bg-rose-600 text-white px-6 py-3 rounded-full font-medium transition"
            >
              Write to us
              <EnvelopeIcon className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default page;
