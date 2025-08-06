// "use client";

// import Image from "next/image";
// import { motion } from "framer-motion";

// interface Judge {
//   name: string;
//   title: string;
//   image: string;
// }

// const judges: Judge[] = [
//   {
//     name: "মো. সাইফুল ইসলাম",
//     title: "সিনিয়র সাংবাদিক, স্মার্ট ভিলেজ",
//     image: "/Asset/Judge/saiful.jpg",
//   },
//   {
//     name: "সাবরিনা আহমেদ",
//     title: "ডেপুটি এডিটর, স্মার্ট ভিলেজ",
//     image: "/Asset/Judge/saiful.jpg",
//   },
//   {
//     name: "রাফিদ হাসান",
//     title: "প্রোগ্রাম কো-অর্ডিনেটর, স্মার্ট ভিলেজ",
//     image: "/Asset/Judge/saiful.jpg",
//   },
// ];

// export default function JudgeSection() {
//   return (
//     <section className="relative bg-gradient-to-br from-orange-50 via-white to-orange-100 py-20 px-4">
//       <div className="max-w-6xl mx-auto text-center">
//         <motion.h2
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//           className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4"
//         >
//           বিচারক প্যানেল
//         </motion.h2>

//         <motion.p
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.2, duration: 0.6 }}
//           className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto mb-12"
//         >
//           এই কুইজ প্রতিযোগিতার বিচারক হিসেবে আছেন অভিজ্ঞ সাংবাদিক এবং সংগঠকগণ,
//           যাঁরা নিরপেক্ষ ও স্বচ্ছ প্রক্রিয়ায় বিজয়ী নির্বাচন করবেন।
//         </motion.p>

//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
//           {judges.map((judge, index) => (
//             <motion.div
//               key={index}
//               initial={{ opacity: 0, y: 30 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ delay: index * 0.1, duration: 0.5 }}
//               viewport={{ once: true }}
//               className="group bg-white rounded-2xl shadow-md hover:shadow-xl transform transition-all duration-300 hover:-translate-y-2 p-6 border border-orange-100"
//             >
//               <div className="relative w-28 h-28 mx-auto mb-4">
//                 <Image
//                   src={judge.image}
//                   alt={judge.name}
//                   fill
//                   className="object-cover rounded-full border-4 border-white shadow-md group-hover:scale-105 transition-transform duration-300"
//                 />
//               </div>
//               <h3 className="text-xl font-semibold text-gray-800 group-hover:text-orange-500 transition">
//                 {judge.name}
//               </h3>
//               <p className="text-sm text-gray-500 mt-1">{judge.title}</p>
//             </motion.div>
//           ))}
//         </div>
//       </div>

//       {/* Decorative line */}
//       <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-orange-400 to-orange-600 rounded-t-lg" />
//     </section>
//   );
// }

"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface Judge {
  name: string;
  title: string;
  image: string;
}

export interface JudgeData {
  panel: string;
  description: string;
  members: Judge[];
}

const judgesData: JudgeData = {
  panel: "বিচারক প্যানেল",
  description: `এই কুইজ প্রতিযোগিতার বিচারক হিসেবে আছেন অভিজ্ঞ সাংবাদিক এবং সংগঠকগণ,
যাঁরা নিরপেক্ষ ও স্বচ্ছ প্রক্রিয়ায় বিজয়ী নির্বাচন করবেন।`,
  members: [
    {
      name: "মো. সাইফুল ইসলাম",
      title: "সিনিয়র সাংবাদিক, স্মার্ট ভিলেজ",
      image: "/Asset/Judge/saiful.jpg",
    },
    {
      name: "সাবরিনা আহমেদ",
      title: "ডেপুটি এডিটর, স্মার্ট ভিলেজ",
      image: "/Asset/Judge/sabrina.jpg",
    },
    {
      name: "রাফিদ হাসান",
      title: "প্রোগ্রাম কো-অর্ডিনেটর, স্মার্ট ভিলেজ",
      image: "/Asset/Judge/rafid.jpg",
    },
  ],
};

export default function JudgeSection() {
  return (
    <section className="relative bg-gradient-to-br from-orange-50 via-white to-orange-100 py-20 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4"
        >
          {judgesData.panel}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto mb-12"
        >
          {judgesData.description}
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {judgesData.members.map((judge, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="group bg-white rounded-2xl shadow-md hover:shadow-xl transform transition-all duration-300 hover:-translate-y-2 p-6 border border-orange-100"
            >
              <div className="relative w-28 h-28 mx-auto mb-4">
                <Image
                  src={judge.image}
                  alt={judge.name}
                  fill
                  className="object-cover rounded-full border-4 border-white shadow-md group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 group-hover:text-orange-500 transition">
                {judge.name}
              </h3>
              <p className="text-sm text-gray-500 mt-1">{judge.title}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Decorative line */}
      <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-orange-400 to-orange-600 rounded-t-lg" />
    </section>
  );
}
