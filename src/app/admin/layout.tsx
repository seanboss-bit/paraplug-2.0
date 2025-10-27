"use client";

import {
  UserGroupIcon,
  ShoppingBagIcon,
  HomeIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  PlusIcon,
  VideoCameraIcon,
  ArchiveBoxIcon,
} from "@heroicons/react/24/outline";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ReactNode, useEffect, useState } from "react";
import clsx from "clsx";
import { useUserStore } from "@/store/userStore";
import { useLoading } from "@/providers/LoadingProvider";
import { subscribeAdminToPush } from "@/components/enablePush";
import { toast } from "sonner";

const navItems = [
  { name: "Dashboard", href: "/admin", icon: HomeIcon },
  { name: "Users", href: "/admin/users", icon: UserGroupIcon },
  { name: "Orders", href: "/admin/orders", icon: ShoppingBagIcon },
  { name: "Add Kicks", href: "/admin/add", icon: PlusIcon },
  { name: "Posts", href: "/admin/posts", icon: VideoCameraIcon },
  { name: "All Shoes", href: "/admin/kicks", icon: ArchiveBoxIcon },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { logout, user } = useUserStore();
  const { startLoading } = useLoading();

  const handleLogout = () => {
    logout();
    startLoading();
    router.push("/");
    localStorage.removeItem("user_id");
  };

  useEffect(() => {
    if (user?.isAdmin === false) {
      window.location.href = "/dashboard";
    }
  }, [user]);

  useEffect(() => {
    const hasAsked = localStorage.getItem("pushPrompted");

    if (!hasAsked && user?.isAdmin) {
      const wantsPush = window.confirm(
        "Do you want to enable push notifications?"
      );
      if (wantsPush) {
        subscribeAdminToPush()
          .then(() => {
            toast.success("Push notifications enabled successfully!");
          })
          .catch((err) => {
            console.error("Push subscription failed:", err);
            toast.error("Failed to enable notifications");
          });
      }
      localStorage.setItem("pushPrompted", "true");
    }
  }, [user]);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Sidebar for desktop */}
      <aside className="hidden md:flex w-64 bg-white dark:bg-gray-800 shadow-lg border-r border-gray-100 dark:border-gray-700 flex-col transition-colors duration-300">
        <SidebarContent pathname={pathname} handleLogout={handleLogout} />
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 w-full z-40 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-100 dark:border-gray-700 flex items-center justify-between px-4 py-3 transition-colors duration-300">
        <h1 className="font-bold text-xl text-gray-800 dark:text-gray-100">
          ParaplugAdmin
        </h1>
        <button onClick={() => setOpen(true)}>
          <Bars3Icon className="h-7 w-7 text-gray-700 dark:text-gray-300" />
        </button>
      </div>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed top-0 left-0 z-50 w-64 h-full bg-white dark:bg-gray-800 shadow-lg border-r border-gray-100 dark:border-gray-700 flex flex-col md:hidden transition-colors duration-300"
            >
              <div className="flex items-center justify-between h-20 px-4 border-b border-gray-100 dark:border-gray-700">
                <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
                  Paraplug
                  <span className="text-gray-600 dark:text-gray-400">
                    Admin
                  </span>
                </h1>
                <button onClick={() => setOpen(false)}>
                  <XMarkIcon className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                </button>
              </div>
              <SidebarContent pathname={pathname} handleLogout={handleLogout} />
            </motion.div>

            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black md:hidden z-40"
              onClick={() => setOpen(false)}
            />
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto md:ml-0 p-6 md:p-8 mt-16 md:mt-0">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}

function SidebarContent({
  pathname,
  handleLogout,
}: {
  pathname: string;
  handleLogout: () => void;
}) {
  const { LoadingLink } = useLoading();
  return (
    <>
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <h1 className="text-2xl hidden md:block font-extrabold tracking-tight text-gray-900 dark:text-gray-100 mb-[40px]">
          Paraplug
          <span className="text-gray-600 dark:text-gray-400">Admin</span>
        </h1>
        {navItems.map(({ name, href, icon: Icon }) => {
          const active = pathname === href;
          return (
            <LoadingLink
              key={name}
              href={href}
              className={clsx(
                "flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200",
                active
                  ? "bg-gray-900 dark:bg-gray-700 text-white"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              )}
            >
              <Icon className={clsx("h-5 w-5", active && "text-white")} />
              <span className="font-medium">{name}</span>
            </LoadingLink>
          );
        })}
      </nav>

      <div className="border-t border-gray-100 dark:border-gray-700 p-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 font-medium transition"
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5" />
          Logout
        </button>
      </div>
    </>
  );
}
