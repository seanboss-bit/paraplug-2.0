"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FiLogOut, FiMenu, FiX } from "react-icons/fi";
import {
  BuildingStorefrontIcon,
  ChatBubbleLeftRightIcon,
  HeartIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";
import { useLoading } from "@/providers/LoadingProvider";
import { useUserStore } from "@/store/userStore";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useUserStore();
  const { startLoading, LoadingLink } = useLoading();
  const router = useRouter();
  const navLinks = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: <HomeIcon className="size-5" />,
    },
    {
      href: "/dashboard/favourites",
      label: "Favourites",
      icon: <HeartIcon className="size-5" />,
    },
    {
      href: "/dashboard/reviews",
      label: "Reviews",
      icon: <ChatBubbleLeftRightIcon className="size-5" />,
    },
    {
      href: "/store",
      label: "Store",
      icon: <BuildingStorefrontIcon className="size-5" />,
    },
  ];

  useEffect(() => {
    if (!user) {
      window.location.href = "/store";
    }
  }, [user]);
  return (
    <div className="h-screen flex bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* SIDEBAR */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen z-30 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 w-64 bg-white dark:bg-gray-800 shadow-lg flex flex-col transition-transform duration-300`}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            ParaPlug
          </h2>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden text-gray-700 dark:text-gray-300"
          >
            <FiX size={22} />
          </button>
        </div>

        <nav className="flex flex-col space-y-2 p-4">
          {navLinks.map((link) => (
            <LoadingLink
              key={link.href}
              href={link.href}
              onClick={() => {
                setSidebarOpen(false);
                if (link.label !== "Store") {
                  localStorage.setItem("user_id", user?._id as string);
                }
              }}
              className={`flex items-center gap-3 px-3 py-2 rounded-md font-medium transition ${
                pathname === link.href
                  ? "bg-gray-900 text-white dark:bg-gray-700"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {link.icon}
              {link.label}
            </LoadingLink>
          ))}
        </nav>

        <div className="mt-auto p-4">
          <button
            onClick={() => {
              logout();
              startLoading();
              router.push("/");
              localStorage.removeItem("user_id");
            }}
            className="flex items-center gap-3 text-red-500 hover:text-red-600 transition font-medium"
          >
            <FiLogOut /> Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col">
        {/* TOP BAR */}
        <header className="flex items-center justify-between bg-white dark:bg-gray-800 shadow px-4 py-3 md:hidden">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Dashboard
          </h1>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-700 dark:text-gray-300"
          >
            <FiMenu size={24} />
          </button>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-8 py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
