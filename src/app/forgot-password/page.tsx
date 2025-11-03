"use client";
import { FormEvent, useEffect, useState } from "react";
import { EnvelopeIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useUserStore } from "@/store/userStore";
import { resetPassword } from "@/services/auth";

const Page = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useUserStore();

  useEffect(() => {
    if (user) {
      window.location.href = "/store";
    }
  }, [user, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) return toast.warning("Email is required");

    try {
      setLoading(true);
      const res = await resetPassword(email);
      toast.success("Password reset link sent to your email");
      console.log(res);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Failed to send reset link";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-4">
      <button
        onClick={() => router.back()}
        className="absolute top-6 left-6 flex items-center gap-1 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition"
      >
        <ArrowLeftIcon className="w-5 h-5" />
        <span className="text-sm font-medium">Back</span>
      </button>

      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">Forgot Password</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Enter your email to reset your password
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <EnvelopeIcon className="w-5 h-5 text-gray-400 dark:text-gray-400 absolute left-3 top-3" />
            <input
              type="email"
              placeholder="Email Address"
              className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg pl-10 pr-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:border-black dark:focus:border-white transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white rounded-lg py-2.5 font-semibold text-sm tracking-wide hover:bg-gray-800 dark:hover:bg-gray-700 transition disabled:opacity-70"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Page;
