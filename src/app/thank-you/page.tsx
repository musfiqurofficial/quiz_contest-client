"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export default function ThankYouPage() {
  const orders = useSelector((state: RootState) => state.order.orders);
  const latestOrder = orders[orders.length - 1];

  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-green-100 to-green-200 p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-2xl shadow-lg p-10 text-center max-w-md w-full"
      >
        <motion.div
          initial={{ rotate: -180 }}
          animate={{ rotate: 0 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="text-green-500 text-5xl mb-4"
        >
          🎉
        </motion.div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Thank You!</h1>
        <p className="text-gray-600 mb-4">Your order has been received.</p>
        {latestOrder && (
          <div className="text-left mt-4 p-4 bg-gray-50 rounded border border-gray-200">
            <p className="text-sm text-gray-500">Order ID:</p>
            <p className="font-semibold">{latestOrder.id}</p>
            <p className="text-sm text-gray-500 mt-2">Items:</p>
            <ul className="list-disc pl-5">
              {latestOrder.items.map((item, i) => (
                <li key={i}>
                  {item.title} — ${item.price} × {item.quantity}
                </li>
              ))}
            </ul>
            <p className="mt-2 font-semibold">
              Total: ${latestOrder?.totalAmount.toFixed(2)}
            </p>
          </div>
        )}

        <Link
          href="/"
          className="mt-6 inline-block text-blue-600 hover:underline"
        >
          ← Back to Home
        </Link>
      </motion.div>
    </main>
  );
}
