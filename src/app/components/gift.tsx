// "use client";

// import React from "react";

// const giftData = {
//   img: "/Asset/prducts/bg-orange-.jpg", // ensure this path is correct
//   amount: 300000,
//   dailyGift: 2000,
//   dayLength: 10,
// };

// const Gift = () => {
//   return (
//     <div
//       className="w-full bg-cover bg-center py-20 px-4"
//       style={{ backgroundImage: `url(${giftData.img})` }}
//     >
//       <div className="max-w-3xl mx-auto bg-white bg-opacity-90 rounded-2xl shadow-xl p-8 text-center space-y-4">
//         <h2 className="text-2xl font-bold text-orange-500">পুরস্কার</h2>

//         <p className="text-4xl font-extrabold text-gray-800">
//           {giftData.amount.toLocaleString()}
//         </p>

//         <p className="text-lg text-gray-600">
//           প্রতিদিন{" "}
//           <span className="font-semibold text-orange-600">
//             {giftData.dailyGift}
//           </span>{" "}
//           করে{" "}
//           <span className="font-semibold text-orange-600">
//             {giftData.dayLength} দিন
//           </span>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Gift;




"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

interface GiftType {
  img: string;
  amount: number;
  dailyGift: number;
  dayLength: number;
}
interface status {
  status: "pending" | "delete" | "approved"
}

const Gift = () => {
  const [giftData, setGiftData] = useState<GiftType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGiftData = async () => {
      try {
        const response = await axios.get(
          "https://backend-weld-two-15.vercel.app/api/v1/offers"
        );

        if (response.data.success && response.data.data.length > 0) {
          const approvedOffer = response.data.data.find(
            (offer: status) => offer.status === "approved"
          );

          if (approvedOffer) {
            setGiftData({
              img: approvedOffer.img,
              amount: approvedOffer.amount,
              dailyGift: approvedOffer.dailyGift,
              dayLength: approvedOffer.dayLength,
            });
          }
        }
      } catch (error) {
        console.error("Error fetching gift data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGiftData();
  }, []);

  if (loading) {
    return (
      <div className="w-full py-20 px-4 text-center">
        <p className="text-lg text-gray-500">লোড হচ্ছে...</p>
      </div>
    );
  }

  if (!giftData) {
    return (
      <div className="w-full py-20 px-4 text-center">
        <p className="text-lg text-red-500">কোনো পুরস্কার পাওয়া যায়নি।</p>
      </div>
    );
  }

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

