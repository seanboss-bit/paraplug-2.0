/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

import {
  UserIcon,
  LockClosedIcon,
  EnvelopeIcon,
  LinkIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useEffect, useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { useLoading } from "@/providers/LoadingProvider";
import { useUserStore } from "@/store/userStore";
import Image from "next/image";
import { registerUser } from "@/services/auth";

const Register = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { LoadingLink } = useLoading();
  const { user } = useUserStore();

  // form states
  const [preview, setPreview] = useState<string | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [referral, setReferral] = useState(searchParams.get("ref") || "");
  const [loading, setLoading] = useState(false);

  // If user already logged in
  useEffect(() => {
    if (user && user?.isAdmin !== true) {
      router.push("/store");
    } else {
      router.push("/admin");
    }
  }, [user]);

  // Cloudinary upload
  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "b0krglfv");
    const { data } = await axios.post(
      "https://api.cloudinary.com/v1_1/dvo4tlcrx/image/upload",
      formData
    );
    return data.secure_url;
  };

  // Registration logic
  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    try {
      if (
        !firstName ||
        !lastName ||
        !email ||
        !password ||
        !confirm ||
        !image
      ) {
        toast.warning("All fields including image are required");
        setLoading(false);
        return;
      }
      if (password !== confirm) {
        toast.warning("Passwords do not match");
        setLoading(false);
        return;
      }

      const uploadedUrl = await uploadImage(image);
      const res = await registerUser({
        fullName: firstName,
        username: lastName,
        email,
        image: uploadedUrl,
        password,
      });
      toast.success(res?.message || "Registration successful!");
      router.push("/login");
      // @ts-ignore
    } catch (error: object) {
      console.error(error);
      toast.error(error.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-gray-50 py-10 flex flex-col justify-center items-center px-4 relative">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="md:absolute top-6 left-6 flex items-center gap-1 text-gray-700 hover:text-black transition self-start mb-[40px] md:mb-0"
      >
        <ArrowLeftIcon className="w-5 h-5" />
        <span className="text-sm font-medium">Back</span>
      </button>

      {/* Card */}
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold uppercase tracking-tight">
            Create Account
          </h1>
          <p className="text-gray-500 text-sm mt-2">
            Join Paraplug and start shopping your favorite sneakers
          </p>
        </div>

        {/* Profile Image Upload */}
        <div className="flex flex-col items-center mb-8">
          <label
            htmlFor="user_img"
            className="relative w-24 h-24 rounded-full border-2 border-gray-200 flex items-center justify-center cursor-pointer overflow-hidden group hover:border-black transition"
          >
            {preview ? (
              <Image
                src={preview}
                alt="preview"
                className="object-cover w-full h-full"
                width={1100}
                height={1100}
              />
            ) : (
              <img
                src="https://cdn-icons-png.flaticon.com/512/666/666201.png"
                alt="placeholder"
                className="w-12 h-12 opacity-70 group-hover:opacity-100 transition"
              />
            )}
            <input
              id="user_img"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setPreview(URL.createObjectURL(file));
                  setImage(file);
                }
              }}
            />
          </label>
          <p className="text-xs text-gray-500 mt-2">
            Click the icon to upload your photo
          </p>
        </div>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleRegister}>
          {/* Full Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative">
              <UserIcon className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full bg-gray-100 border border-gray-200 rounded-lg pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:border-black transition"
              />
            </div>
            <div className="relative">
              <UserIcon className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full bg-gray-100 border border-gray-200 rounded-lg pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:border-black transition"
              />
            </div>
          </div>

          {/* Email */}
          <div className="relative">
            <EnvelopeIcon className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-100 border border-gray-200 rounded-lg pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:border-black transition"
            />
          </div>

          {/* Password + Confirm */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative">
              <LockClosedIcon className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-100 border border-gray-200 rounded-lg pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:border-black transition"
              />
            </div>
            <div className="relative">
              <LockClosedIcon className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full bg-gray-100 border border-gray-200 rounded-lg pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:border-black transition"
              />
            </div>
          </div>

          {/* Referral Code */}
          <div className="relative">
            <LinkIcon className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Referral Code (optional)"
              value={referral}
              onChange={(e) => setReferral(e.target.value)}
              className="w-full bg-gray-100 border border-gray-200 rounded-lg pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:border-black transition"
            />
          </div>

          {/* Register Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 bg-black text-white rounded-lg py-2.5 font-semibold text-sm tracking-wide hover:bg-gray-800 transition ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center justify-center my-5">
          <div className="h-px bg-gray-200 flex-1" />
          <span className="px-3 text-xs text-gray-400 uppercase">or</span>
          <div className="h-px bg-gray-200 flex-1" />
        </div>

        {/* Already have account */}
        <div className="text-center text-sm">
          <span className="text-gray-500">Already have an account?</span>{" "}
          <LoadingLink
            href="/login"
            className="font-medium text-gray-900 hover:underline"
          >
            Login
          </LoadingLink>
        </div>
      </div>

      {/* Footer */}
      <p className="text-xs text-gray-400 mt-10">
        &copy; {new Date().getFullYear()} Paraplug. All rights reserved.
      </p>
    </section>
  );
};

export default function Page() {
  return (
    <Suspense fallback={<>loading..</>}>
      <Register />
    </Suspense>
  );
}
