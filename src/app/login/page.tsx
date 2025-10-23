"use client";

import { useRouter } from "next/navigation";
import {
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import { useState, MouseEvent, useEffect } from "react";
import { useLoading } from "@/providers/LoadingProvider";
import { loginUser } from "@/services/auth";
import { toast } from "sonner";
import { useUserStore } from "@/store/userStore";

const Page = () => {
  const router = useRouter();
  const { LoadingLink, startLoading } = useLoading();
  const { login } = useUserStore();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { user } = useUserStore();

  const logUserIn = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!email || !password) {
      toast.warning("All information is required");
      return;
    }

    try {
      setLoading(true);
      const res = await loginUser({ email, password });
      toast.success("Login successful!");
      login(res);
      localStorage.setItem("user_id", res?._id as string);
      console.log(res);
      if (res?.isAdmin === true) {
        startLoading();
        router.push("/admin");
      } else {
        startLoading();
        router.push("/store");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("❌Login error:", error);
      toast.error(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      window.location.href = "/store";
    }
  }, []);

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
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight uppercase">
            Paraplug
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Welcome back — login to continue
          </p>
        </div>

        <form className="space-y-6">
          <div className="relative">
            <EnvelopeIcon className="w-5 h-5 text-gray-400 dark:text-gray-400 absolute left-3 top-3" />
            <input
              type="email"
              placeholder="Email Address"
              className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg pl-10 pr-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:border-black dark:focus:border-white transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="relative">
            <LockClosedIcon className="w-5 h-5 text-gray-400 dark:text-gray-400 absolute left-3 top-3" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg pl-10 pr-10 py-2.5 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:border-black dark:focus:border-white transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

          <button
            type="submit"
            className={`w-full bg-black text-white rounded-lg py-2.5 font-semibold text-sm tracking-wide hover:bg-gray-800 dark:hover:bg-gray-700 transition ${
              loading ? "cursor-not-allowed opacity-70" : "cursor-pointer"
            }`}
            disabled={loading}
            onClick={logUserIn}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <div className="flex items-center justify-center my-4">
            <div className="h-px bg-gray-200 dark:bg-gray-700 flex-1" />
            <span className="px-3 text-xs text-gray-400 dark:text-gray-500 uppercase">
              or
            </span>
            <div className="h-px bg-gray-200 dark:bg-gray-700 flex-1" />
          </div>

          <div className="text-center text-sm">
            <span className="text-gray-500 dark:text-gray-400">
              Don’t have an account?
            </span>{" "}
            <LoadingLink
              href="/register"
              className="font-medium text-gray-900 dark:text-gray-100 hover:underline"
            >
              Register
            </LoadingLink>
          </div>
        </form>
      </div>

      <p className="text-xs text-gray-400 dark:text-gray-500 mt-10">
        &copy; {new Date().getFullYear()} Paraplug. All rights reserved.
      </p>
    </section>
  );
};

export default Page;
