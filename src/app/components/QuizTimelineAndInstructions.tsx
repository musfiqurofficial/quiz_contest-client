// // components/QuizTimelineAndInstructions.tsx

// interface SectionProps {
//   title: string;
//   points: string[];
//   bgColor?: string;
//   textColor?: string;
// }

// function InfoBlock({
//   title,
//   points,
//   bgColor = "bg-white",
//   textColor = "text-gray-800",
// }: SectionProps) {
//   return (
//     <div className={`rounded-2xl shadow-lg p-6 md:p-8 w-full ${bgColor}`}>
//       <h3 className={`text-2xl font-bold mb-4 ${textColor}`}>{title}</h3>
//       <ul
//         className={`list-disc list-inside space-y-3 text-base leading-relaxed ${textColor}`}
//       >
//         {points.map((point, idx) => (
//           <li key={idx}>{point}</li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default function QuizTimelineAndInstructions() {
//   const primaryColor = "#f25b29"; // Your primary brand color

//   const timeline = {
//     title: "সময়",
//     points: [
//       "নিবন্ধন চলবে: ২৫ অক্টোবর থেকে ১৪ নভেম্বর ২০২৪ পর্যন্ত",
//       "মহড়া কুইজ: ২ ও ৩ নভেম্বর ২০২৪, সন্ধ্যা ৭টা থেকে ৭টা ১০ মিনিট",
//       "মূল পর্বের কুইজ: ৫ থেকে ১৪ নভেম্বর ২০২৪, প্রতিদিন সন্ধ্যা ৭টা থেকে ৭টা ১০ মিনিট",
//     ],
//     bgColor: "bg-[#f25b29]",
//     textColor: "text-white",
//   };

//   const instructions = {
//     title: "অংশগ্রহণের পদ্ধতি",
//     points: [
//       "নিবন্ধন লিংকে ক্লিক করলে নিবন্ধন ফরম আসবে। সেখানে জাতীয় পরিচয়পত্র/ জন্মসনদ অনুসারে নিজের দরকারি সব তথ্য দিয়ে ও নিজের পছন্দমতো পাসওয়ার্ড (কমপক্ষে ৬ অক্ষর) দিয়ে সাবমিট করতে হবে। এ সময় কুইজের নিয়মাবলি মেনে চলার অঙ্গীকার ব্যক্ত করতে হবে।",
//       "সাবমিট করার পর একটি লিংক আপনার ই-মেইলে যাবে। সেই লিংকে ক্লিক করে নিবন্ধন সম্পন্ন করতে হবে।",
//       "নিবন্ধনের সময় অংশগ্রহণকারীর নাম অবশ্যই বাংলায় দিতে হবে।",
//       "মূল কুইজ পর্ব শুরুর আগে সবার প্রস্তুতি নেওয়ার জন্য দুই দিন মহড়া কুইজ অনুষ্ঠিত হবে।",
//       "মূল কুইজ পর্বে একইভাবে হোমপেজের ‘কুইজ শুরু করুন’ বাটনে ক্লিক করে কুইজে অংশ নিতে হবে।",
//       "নিবন্ধনের তথ্য প্রথম আলো সংরক্ষণ করবে।",
//     ],
//     bgColor: "bg-white",
//     textColor: "text-[#f25b29]",
//   };

//   return (
//     <section className="bg-[#f9f9f9] py-16 px-4">
//       <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
//         <InfoBlock {...timeline} />
//         <InfoBlock {...instructions} />
//       </div>
//     </section>
//   );
// }

"use client";

import { useEffect, useState } from "react";

interface SectionProps {
  title: string;
  points: string[];
  bgColor?: string;
  textColor?: string;
}

function InfoBlock({
  title,
  points,
  bgColor = "bg-white",
  textColor = "text-gray-800",
}: SectionProps) {
  return (
    <div className={`rounded-2xl shadow-lg p-6 md:p-8 w-full ${bgColor}`}>
      <h3 className={`text-2xl font-bold mb-4 ${textColor}`}>{title}</h3>
      <ul
        className={`list-disc list-inside space-y-3 text-base leading-relaxed ${textColor}`}
      >
        {points.map((point, idx) => (
          <li key={idx}>{point}</li>
        ))}
      </ul>
    </div>
  );
}

export default function QuizTimelineAndInstructions() {
  const [timeline, setTimeline] = useState<SectionProps | null>(null);
  const [instructions, setInstructions] = useState<SectionProps | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          "https://backend-weld-two-15.vercel.app/api/v1/time-instruction"
        );
        const json = await res.json();

        if (json.success && json.data.length > 0) {
          const data = json.data[0];
          const timelineData: SectionProps = {
            title: data.timeline.title,
            points: data.timeline.points,
            bgColor: `bg-[${data.timeline.bgColor}]`,
            textColor: `text-[${data.timeline.textColor}]`,
          };
          const instructionsData: SectionProps = {
            title: data.instructions.title,
            points: data.instructions.points,
            bgColor: `bg-[${data.instructions.bgColor}]`,
            textColor: `text-[${data.instructions.textColor}]`,
          };

          setTimeline(timelineData);
          setInstructions(instructionsData);
        }
      } catch (err) {
        console.error("Failed to fetch time & instructions:", err);
      }
    };

    fetchData();
  }, []);

  if (!timeline || !instructions) {
    return (
      <div className="text-center py-20 text-gray-500 text-lg">
        Loading instructions...
      </div>
    );
  }

  return (
    <section className="bg-[#f9f9f9] py-16 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
        <InfoBlock {...timeline} />
        <InfoBlock {...instructions} />
      </div>
    </section>
  );
}
