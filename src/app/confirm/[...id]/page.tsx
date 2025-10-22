"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { toast } from "sonner";
import { useLoading } from "@/providers/LoadingProvider";
import { verifyEmail } from "@/services/auth";

export default function ConfirmPage() {
  const params = useParams();
  const router = useRouter();
  const { LoadingLink } = useLoading();

  const idParams = params?.id as string[]; // because [...id]
  const [userId, token] = idParams || [];

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const res = await verifyEmail(userId, token);
        toast.success(res.message || "Account verified successfully!");
        setStatus("success");

        // Redirect after short delay
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.error("Verification failed:", err);
        toast.error(
          err.response?.data?.error || "Invalid or expired confirmation link"
        );
        setStatus("error");
      }
    };

    if (userId && token) verifyUser();
  }, [userId, token, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 via-gray-100 to-white text-center px-6">
      {/* Animated Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 10 }}
        className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full border border-gray-100"
      >
        {status === "loading" && (
          <>
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="mx-auto mb-6 h-12 w-12 border-4 border-gray-300 border-t-black rounded-full"
            />
            <h1 className="text-xl font-semibold text-gray-800">
              Verifying your account...
            </h1>
            <p className="text-gray-500 mt-2 text-sm">Please wait a moment</p>
          </>
        )}

        {status === "success" && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="flex flex-col items-center"
          >
            <CheckCircleIcon className="h-16 w-16 text-green-500 mb-4" />
            <h1 className="text-2xl font-semibold text-gray-800">
              Account Verified!
            </h1>
            <p className="text-gray-500 mt-2 text-sm">
              Redirecting you to the login page...
            </p>
          </motion.div>
        )}

        {status === "error" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center"
          >
            <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mb-4" />
            <h1 className="text-2xl font-semibold text-gray-800">
              Invalid Link
            </h1>
            <p className="text-gray-500 mt-2 text-sm">
              The confirmation link is invalid or expired.
            </p>
            <LoadingLink
              href={"/register"}
              className="mt-6 bg-black hover:bg-gray-800 text-white px-6 py-2 rounded-lg"
            >
              Go to Register
            </LoadingLink>
          </motion.div>
        )}
      </motion.div>

      {/* Floating background glow */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 -z-10 overflow-hidden"
      >
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{
            repeat: Infinity,
            duration: 6,
            ease: "easeInOut",
          }}
          className="absolute top-1/3 left-1/2 w-72 h-72 bg-black/10 rounded-full blur-3xl"
        />
      </motion.div>
    </div>
  );
}
