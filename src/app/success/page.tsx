"use client";

import { motion } from "framer-motion";
import {
  CheckCircleIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { useLoading } from "@/providers/LoadingProvider";
import { verifyPayment } from "@/services/cart";

export default function SuccessPage() {
  const { LoadingLink } = useLoading();
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference");

  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const verifyRef = async () => {
      if (!reference) {
        toast.error("No payment reference found");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await verifyPayment(reference);

        if (res?.status === "success" || res?.data?.status === "success") {
          setVerified(true);
          toast.success("Payment verified successfully!");
        } else {
          toast.warning("Payment not verified yet. Please check again.");
        }
      } catch (err: any) {
        toast.error("Error verifying payment");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    verifyRef();
  }, [reference]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-white flex flex-col items-center justify-center px-6 text-center">
      {/* Success Animation */}
      <motion.div
        initial={{ scale: 0, rotate: 180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          type: "spring",
          stiffness: 120,
          damping: 10,
        }}
        className="flex flex-col items-center mb-8"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-green-600/10 p-6 rounded-full border border-green-600/40 backdrop-blur-lg"
        >
          {loading ? (
            <div className="h-20 w-20 flex items-center justify-center">
              <div className="h-10 w-10 border-4 border-green-400 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : verified ? (
            <CheckCircleIcon className="h-20 w-20 text-green-500" />
          ) : (
            <div className="h-20 w-20 flex items-center justify-center text-red-500 font-semibold">
              ❌
            </div>
          )}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-3xl md:text-4xl font-semibold mt-6"
        >
          {loading
            ? "Verifying Payment..."
            : verified
            ? "Payment Successful!"
            : "Verification Failed"}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="text-gray-400 mt-2 max-w-md"
        >
          {loading
            ? "Please wait while we confirm your transaction."
            : verified
            ? "Your order has been confirmed. You’ll receive an update once it’s on the way. Thank you for shopping with us!"
            : "We couldn’t verify your payment. Please contact support if funds were deducted."}
        </motion.p>
      </motion.div>

      {/* Buttons */}
      {!loading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <LoadingLink
            href="/"
            className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-xl font-medium transition shadow-lg shadow-green-600/20"
          >
            <ArrowRightIcon className="h-5 w-5" />
            Continue Shopping
          </LoadingLink>

          {/* Uncomment if you want order list link */}
          {/* <LoadingLink
            href="/orders"
            className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 px-6 py-3 rounded-xl font-medium text-gray-200 transition shadow-md"
          >
            <ShoppingBagIcon className="h-5 w-5" />
            View Orders
          </LoadingLink> */}
        </motion.div>
      )}

      {/* Floating background glow */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 -z-10 overflow-hidden"
      >
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{
            repeat: Infinity,
            duration: 6,
            ease: "easeInOut",
          }}
          className="absolute top-1/3 left-1/2 w-72 h-72 bg-green-500/20 rounded-full blur-3xl"
        />
      </motion.div>
    </div>
  );
}
