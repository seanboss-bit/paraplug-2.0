"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { completeOrder, deleteOrder, getAllOrders } from "@/services/admin";
import { Order, OrderItem } from "@/interface/interface";

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const expandedRef = useRef<HTMLDivElement | null>(null);

  // 🧩 Fetch orders
  const getOrders = async () => {
    setLoading(true);
    try {
      const res = await getAllOrders();
      setOrders(res?.allOrders || []);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    getOrders();
  }, []);

  // ✅ Close when clicking outside expanded card
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        expandedRef.current &&
        !expandedRef.current.contains(e.target as Node)
      ) {
        setExpandedOrder(null);
      }
    };

    if (expandedOrder) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [expandedOrder]);

  // ✅ Handle Complete (fixed state refresh)
  const handleComplete = async (id: string) => {
    setActionLoading(id);
    setMessage(null);
    try {
      await completeOrder(id);
      setMessage("✅ Order marked as completed!");

      // ✅ Update orders instantly in state (no need to reload all)
      setOrders((prev) =>
        prev.map((order) =>
          order._id === id
            ? { ...order, completed: true, status: "completed" }
            : order
        )
      );
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to complete order.");
    } finally {
      setActionLoading(null);
    }
  };

  // ✅ Handle Delete (fixed instant update)
  const handleDelete = async (id: string) => {
    setActionLoading(id);
    setMessage(null);
    try {
      await deleteOrder(id);
      setMessage("🗑️ Order deleted successfully!");
      // ✅ Remove deleted order from state immediately
      setOrders((prev) => prev.filter((order) => order._id !== id));
      if (expandedOrder === id) setExpandedOrder(null);
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to delete order.");
    } finally {
      setActionLoading(null);
    }
  };

  // ✅ Toggle Expand/Collapse properly (fixed)
  const toggleExpand = (id: string) => {
    setExpandedOrder((prev) => (prev === id ? null : id));
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        All Orders
      </h1>

      {/* ✅ Feedback Message */}
      {message && (
        <div className="text-center mb-4">
          <p className="text-sm font-medium text-gray-700 bg-gray-100 px-4 py-2 rounded-lg inline-block">
            {message}
          </p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-40 text-gray-500 animate-pulse">
          Loading orders...
        </div>
      ) : orders.length > 0 ? (
        <div className="space-y-6 grid grid-cols-1 md:grid-cols-2 gap-3 max-w-5xl mx-auto">
          {orders.map((order) => (
            <motion.div
              key={order._id}
              layout
              ref={expandedOrder === order._id ? expandedRef : null}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 h-fit relative"
            >
              {/* Order Header */}
              <div
                className="flex flex-col md:flex-row justify-between items-start p-5 cursor-pointer hover:bg-gray-50 transition-all"
                onClick={() => toggleExpand(order._id)} // ✅ fixed toggle handler
              >
                <div>
                  <h2 className="font-semibold text-lg text-gray-800 capitalize line-clamp-1">
                    Order from {order.name} {order.lname}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(order.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}{" "}
                    —{" "}
                    <span className="font-medium text-green-600 capitalize">
                      {order.status}
                    </span>
                  </p>
                </div>

                <div className="flex items-center gap-3 mt-3 md:mt-0">
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      order.completed
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {order.completed ? "Completed" : "Pending"}
                  </span>
                  <p className="font-bold text-gray-800 text-lg">
                    ₦{order.total.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Order Images */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 px-5 pb-4">
                {order.orders.slice(0, 4).map((item: OrderItem) => (
                  <div
                    key={item._id}
                    className="relative w-full h-32 rounded-lg overflow-hidden bg-gray-100"
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-contain hover:scale-105 hover:rotate-[20deg] transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>

              {/* Expanded Section */}
              <AnimatePresence>
                {expandedOrder === order._id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t bg-gray-50"
                  >
                    <div className="p-5 space-y-5">
                      {/* Order Info */}
                      <div className="grid sm:grid-cols-2 gap-3 text-sm text-gray-700">
                        <p>
                          <span className="font-semibold">Email:</span>{" "}
                          {order.email}
                        </p>
                        <p>
                          <span className="font-semibold">Address:</span>{" "}
                          {order.address}
                        </p>
                        <p>
                          <span className="font-semibold">Phone:</span>{" "}
                          {order.phone}
                        </p>
                        <p>
                          <span className="font-semibold">Alt Phone:</span>{" "}
                          {order.alt_phone}
                        </p>
                        <p>
                          <span className="font-semibold">Reference:</span>{" "}
                          {order.reference}
                        </p>
                      </div>

                      {/* Product List */}
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-2">
                          Products
                        </h3>
                        <div className="space-y-2">
                          {order.orders.map((item: OrderItem) => (
                            <div
                              key={item._id}
                              className="flex justify-between items-center bg-white p-3 rounded-lg border border-gray-100 shadow-sm hover:shadow transition"
                            >
                              <div>
                                <p className="font-medium text-gray-800 capitalize">
                                  {item.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  Size: {item.size} | Qty: {item.cartQuantity}
                                </p>
                              </div>
                              <p className="font-semibold text-gray-700">
                                ₦{item.price.toLocaleString()}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Buttons */}
                      <div className="flex justify-end gap-3 pt-2">
                        {!order.completed && (
                          <button
                            disabled={actionLoading === order._id}
                            onClick={(e) => {
                              e.stopPropagation(); // ✅ Prevent toggle conflict
                              handleComplete(order._id);
                            }}
                            className={`px-4 py-2 bg-green-600 text-white text-sm rounded-lg transition ${
                              actionLoading === order._id
                                ? "opacity-70 cursor-not-allowed"
                                : "hover:bg-green-700"
                            }`}
                          >
                            {actionLoading === order._id
                              ? "Processing..."
                              : "Mark as Completed"}
                          </button>
                        )}
                        <button
                          disabled={actionLoading === order._id}
                          onClick={(e) => {
                            e.stopPropagation(); // ✅ Prevent toggle conflict
                            handleDelete(order._id);
                          }}
                          className={`px-4 py-2 bg-red-600 text-white text-sm rounded-lg transition ${
                            actionLoading === order._id
                              ? "opacity-70 cursor-not-allowed"
                              : "hover:bg-red-700"
                          }`}
                        >
                          {actionLoading === order._id
                            ? "Processing..."
                            : "Delete Order"}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 text-lg">No orders found.</p>
      )}
    </div>
  );
};

export default OrdersPage;
