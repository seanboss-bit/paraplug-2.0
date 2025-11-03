// Reset Password Page
"use client";
import { useState, useEffect, FormEvent } from "react";
import {
  LockClosedIcon,
  ArrowLeftIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useUserStore } from "@/store/userStore";
import { updatePassword } from "@/services/auth";

const Page = () => {
  const router = useRouter();
  const params = useParams();
  const { user } = useUserStore();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const idParams = params?.id as string[];
  const [userId, token] = idParams || [];
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (user) {
      toast.info("You're already logged in");
      router.push("/store");
    }
  }, [user, router]);

  const handleReset = async (e: FormEvent) => {
    e.preventDefault();
    if (!password || !confirmPassword)
      return toast.warning("All fields are required");
    if (password.length < 6)
      return toast.error("Password must be at least 6 characters");
    if (password !== confirmPassword)
      return toast.error("Passwords do not match");

    try {
      setLoading(true);
      const res = await updatePassword(userId, token, password);
      toast.success(res?.message || "Password reset successfully");
      router.push("/login");

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Error resetting password";
      toast.error(msg);
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
          <h1 className="text-2xl font-bold">Set New Password</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Enter your new password
          </p>
        </div>

        <form onSubmit={handleReset} className="space-y-6">
          <div className="relative">
            <LockClosedIcon className="w-5 h-5 text-gray-400 dark:text-gray-400 absolute left-3 top-3" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg pl-10 pr-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:border-black dark:focus:border-white transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            {showPassword ? (
              <EyeIcon
                className="w-5 h-5 text-gray-400 dark:text-gray-400 absolute right-3 top-3 cursor-pointer hover:text-gray-600 dark:hover:text-gray-200"
                onClick={() => setShowPassword(false)}
              />
            ) : (
              <EyeSlashIcon
                className="w-5 h-5 text-gray-400 dark:text-gray-400 absolute right-3 top-3 cursor-pointer hover:text-gray-600 dark:hover:text-gray-200"
                onClick={() => setShowPassword(true)}
              />
            )}
          </div>

          <div className="relative">
            <LockClosedIcon className="w-5 h-5 text-gray-400 dark:text-gray-400 absolute left-3 top-3" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg pl-10 pr-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:border-black dark:focus:border-white transition"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
            />
            {showConfirmPassword ? (
              <EyeIcon
                className="w-5 h-5 text-gray-400 dark:text-gray-400 absolute right-3 top-3 cursor-pointer hover:text-gray-600 dark:hover:text-gray-200"
                onClick={() => setShowConfirmPassword(false)}
              />
            ) : (
              <EyeSlashIcon
                className="w-5 h-5 text-gray-400 dark:text-gray-400 absolute right-3 top-3 cursor-pointer hover:text-gray-600 dark:hover:text-gray-200"
                onClick={() => setShowConfirmPassword(true)}
              />
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white rounded-lg py-2.5 font-semibold text-sm tracking-wide hover:bg-gray-800 dark:hover:bg-gray-700 transition disabled:opacity-50"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Page;
