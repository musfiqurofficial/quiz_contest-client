"use client";

import React from "react";

const giftData = {
  img: "/Asset/prducts/bg-orange-.jpg", // ensure this path is correct
  amount: 300000,
  dailyGift: 2000,
  dayLength: 10,
};

const Gift = () => {
  return (
    <div
      className="w-full bg-cover bg-center py-20 px-4"
      style={{ backgroundImage: `url(${giftData.img})` }}
    >
      <div className="max-w-3xl mx-auto bg-white bg-opacity-90 rounded-2xl shadow-xl p-8 text-center space-y-4">
        <h2 className="text-2xl font-bold text-orange-500">পুরস্কার</h2>

        <p className="text-4xl font-extrabold text-gray-800">
          {giftData.amount.toLocaleString()}
        </p>

        <p className="text-lg text-gray-600">
          প্রতিদিন{" "}
          <span className="font-semibold text-orange-600">
            {giftData.dailyGift}
          </span>{" "}
          করে{" "}
          <span className="font-semibold text-orange-600">
            {giftData.dayLength} দিন
          </span>
        </p>
      </div>
    </div>
  );
};

export default Gift;
