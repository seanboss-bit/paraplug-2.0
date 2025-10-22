"use client";

import { XMarkIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import { numberWithCommas } from "@/utils/functions";
import { useState } from "react";
import Image from "next/image";
import { Cart } from "@/interface/interface";
import { handlePayment } from "@/services/cart";
import { toast } from "sonner";

interface CheckoutPopupProps {
  show: boolean;
  setShow: (value: boolean) => void;
  cart: Cart;
}

export default function CheckoutPopup({
  show,
  setShow,
  cart,
}: CheckoutPopupProps) {
  const [phone, setPhone] = useState("");
  const [altNumber, setAltNumber] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const total =
    cart.total >= 300000
      ? numberWithCommas(cart.total)
      : numberWithCommas(cart.total + 3500);

  const makePayment = async () => {
    if (!phone || !altNumber || !address) {
      toast.warning("All Information Required");
    } else {
      try {
        setLoading(true);
        const res = await handlePayment(
          cart.total >= 150000 ? cart.total : cart.total + 3500,
          address,
          altNumber,
          phone,
          cart?.products
        );

        if (res?.authorization_url) {
          toast.success("Redirecting to payment...");
          // Reset form + close popup
          setPhone("");
          setAltNumber("");
          setAddress("");
          setShow(false);

          // Redirect to Paystack checkout
          window.location.href = res.authorization_url;
        } else {
          toast.error("Payment initialization failed");
        }
      } catch (error: any) {
        console.error(error);
        toast.error("Failed to initialize payment");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden flex flex-col md:flex-row"
          >
            {/* LEFT SIDE (Shoe Image) */}
            <div className="relative hidden md:flex md:w-1/2 w-full h-60 md:h-auto bg-gray-100 dark:bg-gray-800 items-center justify-center">
              <Image
                src="/images/one.jpg"
                alt="shoe_image"
                width={500}
                height={500}
                className="object-contain w-full h-full p-6 rounded-2xl"
              />
            </div>

            {/* RIGHT SIDE (Form) */}
            <div className="flex-1 p-6 md:p-8 overflow-y-auto">
              <button
                onClick={() => setShow(false)}
                disabled={loading}
                className="absolute top-4 right-4 text-gray-600 dark:text-gray-300 hover:text-red-500 transition disabled:opacity-50"
              >
                <XMarkIcon className="size-6" />
              </button>

              <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
                You are about to pay{" "}
                <span className="text-gray-900 dark:text-gray-50 font-bold">
                  ₦{total}
                </span>
              </h3>

              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="number"
                    placeholder="Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-gray-700 outline-none"
                    disabled={loading}
                  />
                  <input
                    type="number"
                    placeholder="Alt Phone Number"
                    value={altNumber}
                    onChange={(e) => setAltNumber(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-gray-700 outline-none"
                    disabled={loading}
                  />
                </div>

                <textarea
                  placeholder="Enter Your Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full h-28 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-gray-700 outline-none resize-none"
                  disabled={loading}
                ></textarea>
              </form>

              <button
                onClick={makePayment}
                disabled={loading}
                className="mt-6 w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-3 rounded-xl hover:bg-gray-700 transition font-medium disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <motion.span
                    className="inline-block h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  />
                ) : (
                  <>
                    {/* Uncomment Paystack Icon if needed */}
                    {/* <Image
                      src="https://static-00.iconduck.com/assets.00/paystack-icon-512x504-w7v8l6as.png"
                      alt="Paystack"
                      width={24}
                      height={24}
                      className="object-contain"
                    /> */}
                    Order Kicks Now
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
