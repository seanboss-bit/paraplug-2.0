"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  EnvelopeIcon,
  ChatBubbleLeftEllipsisIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { deleteEmail, getCustomerMessages, getEmails } from "@/services/admin";

interface Email {
  _id: string;
  email: string;
}

interface Message {
  _id: string;
  name: string;
  subject: string;
  message: string;
  email: string;
  createdAt: string;
}

export default function MainAdmin() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingEmails, setLoadingEmails] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const emailRes = await getEmails();
      const messageRes = await getCustomerMessages();
      setEmails(emailRes.allEmail);
      setMessages(messageRes.allCustomer);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingEmails(false);
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEmailDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await deleteEmail(id);
      setEmails((prev) => prev.filter((email) => email._id !== id));
    } catch (error) {
      console.error(error);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl md:text-3xl font-bold mb-8 text-gray-800 dark:text-gray-100"
      >
        Admin Dashboard
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Subscribers Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 p-6 transition-colors duration-300"
        >
          <div className="flex items-center gap-3 mb-6">
            <EnvelopeIcon className="h-7 w-7 text-green-600" />
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Email Subscribers
            </h2>
          </div>

          {loadingEmails ? (
            <LoadingList count={5} />
          ) : emails.length === 0 ? (
            <p className="text-gray-400 dark:text-gray-500 text-sm">
              No subscribers found.
            </p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-scroll overflow-x-hidden">
              {emails.map((email) => (
                <motion.div
                  key={email._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-gray-50 dark:bg-gray-700 px-4 py-2 rounded-md text-gray-700 dark:text-gray-200 border border-gray-100 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center justify-between transition-colors duration-300"
                >
                  <span>{email.email}</span>
                  <button
                    onClick={() => handleEmailDelete(email._id)}
                    disabled={deletingId === email._id}
                    className="ml-2 text-red-500 hover:text-red-700 transition flex items-center"
                  >
                    {deletingId === email._id ? (
                      <span className="h-4 w-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      <TrashIcon className="size-5" />
                    )}
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Messages Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 p-6 transition-colors duration-300"
        >
          <div className="flex items-center gap-3 mb-6">
            <ChatBubbleLeftEllipsisIcon className="h-7 w-7 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Messages from Users
            </h2>
          </div>

          {loadingMessages ? (
            <LoadingList count={3} lines={3} />
          ) : messages.length === 0 ? (
            <p className="text-gray-400 dark:text-gray-500 text-sm">
              No messages available.
            </p>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {messages.map((msg) => (
                <motion.div
                  key={msg._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 rounded-xl p-4 hover:shadow-sm transition-colors duration-300"
                >
                  <div className="flex flex-wrap justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
                    <p className="font-semibold text-gray-800 dark:text-gray-100">
                      {msg.name}
                    </p>
                    <p className="italic">{msg.subject}</p>
                    <p className="text-gray-400 dark:text-gray-400">
                      {new Date(msg.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <p className="text-gray-700 dark:text-gray-200 text-sm leading-relaxed mb-2">
                    {msg.message}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {msg.email}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

// ✅ Loading Skeleton Component
function LoadingList({
  count = 5,
  lines = 1,
}: {
  count?: number;
  lines?: number;
}) {
  return (
    <div className="space-y-4 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-gray-100 dark:bg-gray-700 rounded-md p-3 space-y-2 transition-colors duration-300"
        >
          {Array.from({ length: lines }).map((_, j) => (
            <div
              key={j}
              className="h-3 bg-gray-200 dark:bg-gray-600 rounded"
              style={{ width: `${80 - j * 10}%` }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
