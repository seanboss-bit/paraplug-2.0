"use client";
import { useLoading } from "@/providers/LoadingProvider";
import { getUserCart } from "@/services/cart";
import { useCartStore } from "@/store/cartStore";
import { useUserStore } from "@/store/userStore";
import {
  ShoppingCartIcon,
  UserIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";

const Navbar = () => {
  const { LoadingLink, startLoading } = useLoading();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const userRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useUserStore();
  const router = useRouter();
  const { cart, setCart } = useCartStore();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userRef.current && !userRef.current.contains(event.target as Node)) {
        setUserOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (menuOpen) setMenuOpen(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [menuOpen]);

  const getCart = async () => {
    try {
      const res = await getUserCart();
      setCart(res?.cart);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error?.response?.data?.error);
    }
  };

  useEffect(() => {
    if (user) {
      getCart();
    }
  }, [user]);

  return (
    <header className="bg-white dark:bg-gray-900 sticky top-0 left-0 right-0 shadow-md dark:shadow-lg z-[999] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-20 relative">
        {/* Logo */}
        <LoadingLink href="/">
          <Image
            src={"/images/head.png"}
            height={277}
            width={901}
            alt="header_logo"
            className="w-[130px] sm:w-[150px] h-[60px] object-contain dark:brightness-0 dark:invert"
          />
        </LoadingLink>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-6">
          <LoadingLink
            href="/store"
            className="uppercase font-semibold text-[14px] text-gray-800 dark:text-gray-100 hover:text-rose-500 dark:hover:text-rose-400 transition-colors"
          >
            Store
          </LoadingLink>
          <LoadingLink
            href="/refund"
            className="uppercase font-semibold text-[14px] text-gray-800 dark:text-gray-100 hover:text-rose-500 dark:hover:text-rose-400 transition-colors"
          >
            Refund Policy
          </LoadingLink>
          <LoadingLink
            href="/contact"
            className="uppercase font-semibold text-[14px] text-gray-800 dark:text-gray-100 hover:text-rose-500 dark:hover:text-rose-400 transition-colors"
          >
            Customer Care
          </LoadingLink>
          <LoadingLink
            href="/about"
            className="uppercase font-semibold text-[14px] text-gray-800 dark:text-gray-100 hover:text-rose-500 dark:hover:text-rose-400 transition-colors"
          >
            About Us
          </LoadingLink>
        </nav>

        {/* Icons */}
        <div className="flex items-center gap-4 relative">
          {user && (
            <LoadingLink href="/cart" className="relative">
              <ShoppingCartIcon className="size-6 cursor-pointer text-gray-700 dark:text-gray-200 hover:text-rose-500 dark:hover:text-rose-400 transition" />
              <span className="w-[15px] h-[15px] -right-1 text-[12px] absolute -top-1 rounded-full bg-rose-500 flex items-center justify-center text-white">
                <p>{cart?.products?.length}</p>
              </span>
            </LoadingLink>
          )}

          {/* User Dropdown */}
          <div ref={userRef} className="relative">
            <UserIcon
              onClick={() => setUserOpen((prev) => !prev)}
              className="size-6 cursor-pointer text-gray-700 dark:text-gray-200 hover:text-rose-500 dark:hover:text-rose-400 transition"
            />
            {userOpen && (
              <>
                {user ? (
                  <div className="absolute right-0 mt-3 w-44 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 py-2 animate-fadeIn">
                    <LoadingLink
                      href="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                      onClick={() =>
                        localStorage.setItem("user_id", user?._id as string)
                      }
                    >
                      Dashboard
                    </LoadingLink>
                    <button
                      onClick={() => {
                        logout();
                        startLoading();
                        router.push("/");
                        localStorage.removeItem("user_id");
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="absolute right-0 mt-3 w-44 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 py-2 animate-fadeIn">
                    <LoadingLink
                      href="/register"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    >
                      Register
                    </LoadingLink>
                    <LoadingLink
                      href="/login"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    >
                      Login
                    </LoadingLink>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden flex items-center justify-center text-gray-700 dark:text-gray-200"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            {menuOpen ? (
              <XMarkIcon className="size-6" />
            ) : (
              <Bars3Icon className="size-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="absolute top-[80px] left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-md md:hidden animate-slideDown">
            <nav className="flex flex-col p-4 space-y-3">
              <LoadingLink
                href="/store"
                className="uppercase text-sm font-semibold text-gray-800 dark:text-gray-100 hover:text-rose-500 dark:hover:text-rose-400"
                onClick={() => setMenuOpen(false)}
              >
                Store
              </LoadingLink>
              <LoadingLink
                href="/refund"
                className="uppercase text-sm font-semibold text-gray-800 dark:text-gray-100 hover:text-rose-500 dark:hover:text-rose-400"
                onClick={() => setMenuOpen(false)}
              >
                Refund Policy
              </LoadingLink>
              <LoadingLink
                href="/contact"
                className="uppercase text-sm font-semibold text-gray-800 dark:text-gray-100 hover:text-rose-500 dark:hover:text-rose-400"
                onClick={() => setMenuOpen(false)}
              >
                Customer Care
              </LoadingLink>
              <LoadingLink
                href="/about"
                className="uppercase text-sm font-semibold text-gray-800 dark:text-gray-100 hover:text-rose-500 dark:hover:text-rose-400"
                onClick={() => setMenuOpen(false)}
              >
                About Us
              </LoadingLink>
            </nav>
          </div>
        )}
      </div>

      {/* Animations */}
      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.25s ease-in-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slideDown {
          animation: slideDown 0.25s ease-in-out;
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
