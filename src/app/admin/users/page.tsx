"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  UserCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ShieldCheckIcon,
  ShieldExclamationIcon,
} from "@heroicons/react/24/outline";
import { adminify, getAllUsers } from "@/services/admin";
import Image from "next/image";

// ✅ User type
export interface User {
  referredUsers: string[];
  favourites: string[];
  _id: string;
  ref: string | null;
  fullName: string;
  email: string;
  username: string;
  image: string;
  isAdmin: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  referralCode: string;
  reviews: string[];
}

// ✅ Response type for getAllUsers
interface GetUsersResponse {
  users: User[];
  total: number;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [loadingUser, setLoadingUser] = useState<string | null>(null);
  const observerRef = useRef<HTMLDivElement | null>(null);

  const LIMIT = 20;

  // ✅ Fetch paginated users
  const getUsers = useCallback(async (pageNum: number): Promise<void> => {
    try {
      if (pageNum === 1) setLoading(true);
      else setLoadingMore(true);

      const res = (await getAllUsers(pageNum, LIMIT)) as GetUsersResponse;
      const newUsers: User[] = res?.users || [];

      if (pageNum === 1) {
        setUsers(newUsers);
      } else {
        setUsers((prev) => {
          const unique = new Map(prev.map((u) => [u._id, u]));
          newUsers.forEach((u: User) => unique.set(u._id, u));
          return Array.from(unique.values());
        });
      }

      setHasMore(newUsers.length >= LIMIT);
    } catch (error: unknown) {
      console.error("Failed to fetch users:", error);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  // ✅ Trigger new page fetch on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        const first = entries[0];
        if (first.isIntersecting && hasMore && !loadingMore && !loading) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.5 }
    );

    const current = observerRef.current;
    if (current) observer.observe(current);
    return () => {
      if (current) observer.unobserve(current);
    };
  }, [hasMore, loadingMore, loading]);

  // ✅ Load users when page changes
  useEffect(() => {
    void getUsers(page);
  }, [page, getUsers]);

  // ✅ Optimistic Admin Toggle (instant visual update)
  const handleAdminify = async (
    makeAdmin: boolean,
    id: string
  ): Promise<void> => {
    try {
      setLoadingUser(id);

      await adminify(id, makeAdmin);

      toast.success(makeAdmin ? "User promoted ✅" : "Admin role removed 🚫");

      setUsers((prev) =>
        prev.map((u: User) => (u._id === id ? { ...u, isAdmin: makeAdmin } : u))
      );
    } catch (error: unknown) {
      setUsers((prev) =>
        prev.map((u: User) =>
          u._id === id ? { ...u, isAdmin: !makeAdmin } : u
        )
      );
      toast.error("Something went wrong");
    } finally {
      setLoadingUser(null);
    }
  };

  return (
    <div className="bg-gray-50">
      <motion.h1
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl md:text-3xl font-bold text-gray-800 mb-6"
      >
        Manage Users
      </motion.h1>

      {loading ? (
        <LoadingSkeleton />
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user: User) => {
              const isExpanded = expandedUser === user._id;
              return (
                <motion.div
                  key={user._id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white shadow-md rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition h-fit"
                >
                  <div
                    className="flex items-center justify-between p-4 cursor-pointer"
                    onClick={() =>
                      setExpandedUser(isExpanded ? null : user._id)
                    }
                  >
                    <div className="flex items-center gap-3">
                      {user.image ? (
                        <Image
                          src={user.image}
                          alt={user.fullName}
                          className="w-12 h-12 rounded-full object-cover border border-gray-200"
                          width={1100}
                          height={1100}
                          priority
                        />
                      ) : (
                        <UserCircleIcon className="w-12 h-12 text-gray-400" />
                      )}
                      <div>
                        <p className="font-semibold capitalize text-[14px] line-clamp-1 text-gray-800">
                          {user.fullName}
                        </p>
                        <p className="text-sm text-gray-500">
                          Joined {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUpIcon className="w-6 h-6 text-gray-500" />
                    ) : (
                      <ChevronDownIcon className="w-6 h-6 text-gray-500" />
                    )}
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="px-4 py-4 border-t border-gray-100 space-y-3"
                      >
                        <div>
                          <p className="text-sm text-gray-600">
                            <span className="font-semibold">Name:</span>{" "}
                            {`${user.fullName} ${user?.username}`}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            <span className="font-semibold">Email:</span>{" "}
                            {user.email}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            <span className="font-semibold">Role:</span>{" "}
                            {user.isAdmin ? (
                              <span className="text-green-600 font-semibold">
                                Admin
                              </span>
                            ) : (
                              <span className="text-gray-600">User</span>
                            )}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            <span className="font-semibold">
                              No of Refferals:
                            </span>{" "}
                            {user.referredUsers?.length}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            <span className="font-semibold">
                              No of Reviews:
                            </span>{" "}
                            {user.reviews?.length}
                          </p>
                        </div>

                        <div className="flex gap-2">
                          <button
                            disabled={loadingUser === user._id}
                            onClick={() =>
                              void handleAdminify(!user.isAdmin, user._id)
                            }
                            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-semibold transition ${
                              user.isAdmin
                                ? "bg-red-50 text-red-600 hover:bg-red-100"
                                : "bg-green-50 text-green-600 hover:bg-green-100"
                            }`}
                          >
                            {loadingUser === user._id ? (
                              <span className="animate-spin h-4 w-4 border-2 border-t-transparent border-current rounded-full" />
                            ) : user.isAdmin ? (
                              <>
                                <ShieldExclamationIcon className="w-5 h-5" />
                                Remove Admin
                              </>
                            ) : (
                              <>
                                <ShieldCheckIcon className="w-5 h-5" />
                                Make Admin
                              </>
                            )}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

          {/* Infinite Scroll Trigger */}
          <div ref={observerRef} className="flex justify-center mt-8 mb-4">
            {loadingMore && (
              <div className="flex items-center gap-2 text-gray-500">
                <span className="h-5 w-5 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
                Loading more users...
              </div>
            )}
          </div>

          {!hasMore && !loadingMore && (
            <p className="text-center text-gray-400 mt-4">
              You’ve reached the end 🎉
            </p>
          )}
        </>
      )}
    </div>
  );
}

// ✅ Skeleton Loader
function LoadingSkeleton() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
      {Array.from({ length: 6 }).map((_, i: number) => (
        <div
          key={i}
          className="bg-white shadow-md rounded-2xl border border-gray-100 p-4"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gray-200 rounded-full" />
            <div className="space-y-2 flex-1">
              <div className="h-3 bg-gray-200 rounded w-2/3" />
              <div className="h-3 bg-gray-200 rounded w-1/3" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded w-full" />
            <div className="h-3 bg-gray-200 rounded w-5/6" />
          </div>
        </div>
      ))}
    </div>
  );
}
