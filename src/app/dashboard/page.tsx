/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";
import { useEffect, useState } from "react";
import { FaTelegramPlane } from "react-icons/fa";
import { FaFacebookF, FaWhatsapp, FaXTwitter } from "react-icons/fa6";
import {
  FacebookShareButton,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";
import { Order, User } from "@/interface/interface";
import { getUserDetails, getUserOrders } from "@/services/dashboard";
import Image from "next/image";
import { toast } from "sonner";
import { StarIcon as StarOutline } from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/solid";

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order>([]);

  const id =
    typeof window !== "undefined" ? localStorage.getItem("user_id") : null;

  // Function to extract initials
  const getInitials = (name: string = "") => {
    const parts = name.trim().split(" ");
    return parts
      .map((p) => p.charAt(0).toUpperCase())
      .join("")
      .slice(0, 2);
  };

  // GET USER ORDERS
  const getOrders = async () => {
    try {
      setLoading(true);
      const res = await getUserOrders(id as string);
      setOrders(res?.order);
      console.log(res);
    } catch (error) {
      toast.error(error?.response?.data?.error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user details
  useEffect(() => {
    const handleUserDetails = async () => {
      if (!id) {
        setError("User not logged in");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await getUserDetails(id);
        console.log(res);
        setUser(res?.data?.user || null);
      } catch (err: any) {
        setError(err || "Failed to fetch user details");
      } finally {
        setLoading(false);
      }
    };

    handleUserDetails();
    getOrders();
  }, [id]);

  const referralLink = `https://paraplug.store/register?ref=${
    user?.referralCode || "USER_ID"
  }`;

  if (loading) {
    return (
      <div className="p-6 space-y-6 animate-pulse">
        <div className="bg-gray-200 dark:bg-gray-700 h-20 rounded-xl"></div>
        <div className="bg-gray-200 dark:bg-gray-700 h-48 rounded-xl"></div>
        <div className="bg-gray-200 dark:bg-gray-700 h-48 rounded-xl"></div>
        <div className="bg-gray-200 dark:bg-gray-700 h-48 rounded-xl"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500 font-semibold">{error}</div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Welcome */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow flex flex-col md:flex-row items-center gap-4">
        {/* Profile Avatar */}
        <div className="w-14 h-14 rounded-full overflow-hidden flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-xl font-bold text-gray-700 dark:text-gray-200">
          {user?.image ? (
            <Image
              src={user.image}
              alt={user.fullName}
              className="w-full h-full object-cover"
              width={1100}
              height={1100}
            />
          ) : (
            <span>{getInitials(user?.fullName)}</span>
          )}
        </div>

        <div>
          <h2 className="text-2xl capitalize font-semibold text-gray-900 dark:text-gray-100">
            Welcome, {user?.fullName || "User"} 👋
          </h2>
          <p className="text-gray-500 mt-1">
            Here’s a summary of your orders and referrals.
          </p>
        </div>
      </section>

      {/* Orders */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
        <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          Orders
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders?.length > 0 ? (
            orders.map((order: Order, i: number) => {
              const numItems = order.orders.length;
              const gridCols =
                numItems <= 1
                  ? "grid-cols-1"
                  : numItems <= 4
                  ? "grid-cols-2"
                  : "grid-cols-3";

              return (
                <div
                  key={order._id || i}
                  className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow hover:shadow-md transition flex flex-col"
                >
                  {/* 🖼 Product images grid */}
                  <div
                    className={`grid ${gridCols} items-center gap-2 mb-3 h-40 overflow-hidden rounded-md`}
                  >
                    {order.orders.map((item, j) => (
                      <div key={j} className="w-full h-full">
                        <Image
                          src={item.image}
                          alt={item.name || "Order image"}
                          className="w-full h-full object-contain rounded-md"
                          width={500}
                          height={500}
                        />
                      </div>
                    ))}
                  </div>

                  {/* 🧾 Order ID and Status */}
                  <p className="text-gray-800 dark:text-gray-200 font-semibold">
                    Order #{i + 1} •{" "}
                    <span
                      className={
                        order.completed ? "text-green-500" : "text-yellow-500"
                      }
                    >
                      {order.completed ? "Completed" : "Pending"}
                    </span>
                  </p>

                  {/* 💰 Total & Date */}
                  <p className="text-gray-500 text-sm mt-1">
                    ₦{order.total.toLocaleString()} •{" "}
                    {new Date(order.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>

                  {/* 🧍 Customer */}
                  <p className="text-gray-700 capitalize dark:text-gray-300 text-sm mt-2">
                    {order.name} {order.lname}
                  </p>

                  {/* 🛒 Number of items */}
                  <p className="text-gray-500 text-sm">
                    {order.orders.length} item
                    {order.orders.length > 1 ? "s" : ""}
                  </p>
                </div>
              );
            })
          ) : (
            <p className="text-center md:col-span-3">No Orders Yet</p>
          )}
        </div>
      </section>

      {/* REVIEWS */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
        <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          My Reviews
        </h3>

        {user?.reviews?.length > 0 ? (
          <div className="space-y-4">
            {user?.reviews.map((review, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200 capitalize">
                    {user?.username || "Anonymous"}
                  </h4>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, idx) =>
                      idx < review.rating ? (
                        <StarIcon
                          key={idx}
                          className="w-5 h-5 text-yellow-400"
                        />
                      ) : (
                        <StarOutline
                          key={idx}
                          className="w-5 h-5 text-gray-300"
                        />
                      )
                    )}
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-2 leading-relaxed">
                  {review.comment}
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">You haven't written any reviews yet.</p>
        )}
      </section>

      {/* Referral */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
        <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          Referral Progress
        </h3>

        <p className="bg-gray-100 text-[12px] mb-4 rounded-lg p-3">
          {referralLink}
        </p>

        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-3">
          <div
            className="bg-black h-3 rounded-full"
            //  @ts-ignore
            style={{ width: `${(user?.referredUsers?.length / 10) * 100}%` }}
          ></div>
        </div>

        <p className="text-gray-600 dark:text-gray-300">
          {`${user?.referredUsers?.length}/10`} referrals completed —{" "}
          {/* @ts-ignore */}
          {10 - user?.referredUsers?.length} more to a free sneaker 🎁
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            onClick={() => {
              navigator.clipboard.writeText(referralLink);
              toast.info("Referral link copied!");
            }}
            className="bg-black text-white px-4 py-2 rounded-md text-sm hover:bg-gray-900 transition"
          >
            Copy Referral Link
          </button>
        </div>

        <div className="flex gap-3 mt-[20px]">
          <WhatsappShareButton url={referralLink}>
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-green-500 text-white">
              <FaWhatsapp className="size-5" />
            </div>
          </WhatsappShareButton>
          <TelegramShareButton url={referralLink}>
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-sky-500 text-white">
              <FaTelegramPlane className="size-5" />
            </div>
          </TelegramShareButton>
          <FacebookShareButton url={referralLink}>
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 text-white">
              <FaFacebookF className="size-5" />
            </div>
          </FacebookShareButton>
          <TwitterShareButton url={referralLink}>
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 text-white">
              <FaXTwitter className="size-5" />
            </div>
          </TwitterShareButton>
        </div>
      </section>
    </div>
  );
}
