// import RulesSection from "./RulesSection";

// const quizData = {
//   quizInfo: {
//     title: "স্মার্ট ভিলেজ পাঠক কুইজ",
//     description: `স্মার্ট ভিলেজর ২৬তম প্রতিষ্ঠাবার্ষিকী উপলক্ষে পাঠকদের জন্য অনলাইন কুইজের এই আয়োজন।
// কুইজের প্রশ্ন থাকবে কুইজের দিন ও পূর্ববর্তী দিনের স্মার্ট ভিলেজর ছাপা পত্রিকা ও অনলাইন থেকে।
// প্রতিদিন কুইজে অংশগ্রহণকারীদের মধ্য থেকে বিজয়ীদের নির্বাচন করা হবে এবং বিজয়ীদের জন্য থাকছে আকর্ষণীয় উপহার।`,
//   },
//   competitionDetails: {
//     title: "কুইজ প্রতিযোগিতা",
//     description: `কুইজ প্রতিযোগিতা চলবে ১০ দিন এবং স্মার্ট ভিলেজ অনলাইন (https://smartvillagebd.com/) এ অনুষ্ঠিত হবে।
// প্রতিদিন সময়মতো কুইজ সঠিকভাবে সমাধানকারীদের মধ্য থেকে দৈবচয়ন পদ্ধতিতে বিজয়ী ঘোষণা করা হবে।`,
//     icon: "/Asset/prducts/quiz-banner.png",
//   },
//   rules: {
//     title: "নিয়মাবলি",
//     items: [
//       "অংশগ্রহণের জন্য অনলাইনে নির্দিষ্ট ফরমে নিবন্ধন করে প্রতিযোগীকে অংশ নিতে হবে।",
//       "নিবন্ধনকারীর সম্পূর্ণ নাম অবশ্যই বাংলায় জাতীয় পরিচয়পত্র/ জন্মসনদের সঙ্গে মিল থাকতে হবে, অন্যথা বিজয়ী হলেও পুরস্কার বাতিল ঘোষণা করা হবে।",
//       "প্রতিদিন সন্ধ্যা ৭টা থেকে ৭টা ১০ মিনিট পর্যন্ত কুইজে অংশ নিতে হবে।",
//       "প্রশ্ন করা হবে কুইজের দিন ও পূর্ববর্তী দিনের স্মার্ট ভিলেজর ছাপা পত্রিকা ও অনলাইন থেকে।",
//       "২০টি প্রশ্নের প্রতিটির জন্য ১ নম্বর বরাদ্দ থাকবে।",
//       "প্রতিদিন সবচেয়ে কম সময়ে সবচেয়ে বেশিসংখ্যক প্রশ্নের সঠিক উত্তরদাতা ১৫ জন বিজয়ীর নাম ঘোষণা করা হবে। এই ১৫ জন বিজয়ী পাবেন মোট (২,০০০ × ১৫) = ৩০,০০০ টাকার গিফট চেক। প্রতিদিন ১৫ জন করে ১০ দিনে মোট ১৫০ জন বিজয়ী পাবেন সর্বমোট ৩,০০,০০০ টাকার গিফট চেক।",
//       "নিবন্ধন চলবে: ২৫ অক্টোবর থেকে ১৪ নভেম্বর ২০২৪ পর্যন্ত",
//       "মহড়া কুইজ: ২ ও ৩ নভেম্বর ২০২৪, সন্ধ্যা ৭টা থেকে ৭টা ১০ মিনিট",
//       "মূল পর্বের কুইজ: ৫ থেকে ১৪ নভেম্বর ২০২৪, প্রতিদিন সন্ধ্যা ৭টা থেকে ৭টা ১০ মিনিট",
//     ],
//   },
// };

// export default function QuizSection() {
//   const { quizInfo, competitionDetails, rules } = quizData;

//   return (
//     <section className="py-12 bg-white">
//       {/* Quiz Intro */}
//       <div className="max-w-4xl mx-auto text-center px-4 space-y-4">
//         <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
//           {quizInfo.title}
//         </h2>
//         <p className="text-gray-600 text-md leading-relaxed whitespace-pre-line">
//           {quizInfo.description}
//         </p>
//       </div>

//       {/* Quiz Competition Two Column Section */}
//       <div className="max-w-7xl mx-auto mt-12 flex flex-col md:flex-row items-stretch">
//         <div
//           className="w-full md:w-1/2 min-h-[250px] sm:min-h-[300px] md:min-h-[400px] bg-no-repeat bg-cover bg-center"
//           style={{
//             backgroundImage: `url(${competitionDetails.icon})`,
//           }}
//         ></div>

//         <div className="w-full md:w-1/2 bg-[#f9f9f9] p-6 sm:p-8 md:p-12 flex flex-col justify-center">
//           <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
//             {competitionDetails.title}
//           </h3>
//           <p className="text-gray-700 text-base sm:text-lg leading-relaxed whitespace-pre-line">
//             {competitionDetails.description}
//           </p>
//         </div>
//       </div>

//       {/* Rules Section Rendered Here */}
//       <RulesSection title={rules.title} rules={rules.items} />
//     </section>
//   );
// }




"use client";

import React, { useEffect, useState } from "react";
import RulesSection from "./RulesSection";

interface QuizInfo {
  title: string;
  description: string;
}

interface CompetitionDetails {
  title: string;
  description: string;
  icon: string;
}

interface Rules {
  title: string;
  items: string[];
}

interface QuizData {
  quizInfo: QuizInfo;
  competitionDetails: CompetitionDetails;
  rules: Rules;
}

export default function QuizSection() {
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const res = await fetch(
          "https://backend-weld-two-15.vercel.app/api/v1/quiz-data"
        );
        const json = await res.json();

        if (json.success && json.data.length > 0) {
          setQuizData(json.data[0]);
        }
      } catch (error) {
        console.error("Error fetching quiz data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizData();
  }, []);

  if (loading) {
    return (
      <section className="py-12 bg-white text-center">
        <p className="text-gray-500">লোড হচ্ছে...</p>
      </section>
    );
  }

  if (!quizData) {
    return (
      <section className="py-12 bg-white text-center">
        <p className="text-red-500">কুইজ ডেটা পাওয়া যায়নি।</p>
      </section>
    );
  }

  const { quizInfo, competitionDetails, rules } = quizData;

  return (
    <section className="py-12 bg-white">
      {/* Quiz Intro */}
      <div className="max-w-4xl mx-auto text-center px-4 space-y-4">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
          {quizInfo.title}
        </h2>
        <div
          className="text-gray-600 text-md leading-relaxed whitespace-pre-line"
          dangerouslySetInnerHTML={{ __html: quizInfo.description }}
        />
      </div>

      {/* Competition Details Two Column */}
      <div className="max-w-7xl mx-auto mt-12 flex flex-col md:flex-row items-stretch">
        <div
          className="w-full md:w-1/2 min-h-[250px] sm:min-h-[300px] md:min-h-[400px] bg-no-repeat bg-cover bg-center"
          style={{
            backgroundImage: `url(${competitionDetails.icon})`,
          }}
        ></div>

        <div className="w-full md:w-1/2 bg-[#f9f9f9] p-6 sm:p-8 md:p-12 flex flex-col justify-center">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            {competitionDetails.title}
          </h3>
          <div
            className="text-gray-700 text-base sm:text-lg leading-relaxed whitespace-pre-line"
            dangerouslySetInnerHTML={{ __html: competitionDetails.description }}
          />
        </div>
      </div>

      {/* Rules Section */}
      <RulesSection title={rules.title} rules={rules.items} />
    </section>
  );
}

