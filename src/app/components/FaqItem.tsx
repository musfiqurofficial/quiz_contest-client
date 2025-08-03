"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FaqItem {
  question: string;
  answer: string;
}

const faqData: FaqItem[] = [
  {
    question: "প্রথম আলোর পাঠক কুইজে কীভাবে অংশ নিতে হবে?",
    answer:
      "প্রথম আলোর পাঠক কুইজে অংশ নেওয়ার জন্য www.prothomalo.com/quiz ঠিকানায় গিয়ে নিবন্ধন সম্পন্ন করতে হবে।",
  },
  {
    question: "নিবন্ধন এবং কুইজে অংশগ্রহণের জন্য কী ডিভাইস লাগবে?",
    answer:
      "ইন্টারনেট-সংবলিত একটি ডিজিটাল ডিভাইস দিয়ে প্রথম আলোর পাঠক কুইজে অংশগ্রহণ করা যাবে, যেখানে ওয়েব ব্রাউজ করার ব্যবস্থা আছে। যেমন স্মার্টফোন, ল্যাপটপ, ডেস্কটপ কম্পিউটার।",
  },
  {
    question: "নিবন্ধন কত তারিখ?",
    answer:
      "নিবন্ধন পর্ব সারা দেশে একযোগে শুরু হয়েছে এবং এটি ১৪ নভেম্বর ২০২৪ তারিখ সর্বশেষ কুইজের আগপর্যন্ত চলবে। নিবন্ধন লিংক: www.prothomalo.com/quiz",
  },
  {
    question: "কীভাবে নিবন্ধন করব?",
    answer:
      "সাইটে গিয়ে প্রথম আলোর পাঠক কুইজে নিবন্ধনের জন্য নিবন্ধন বাটনে ক্লিক করতে হবে।\nনির্ধারিত জায়গায় এনআইডি/ জন্মসনদ অনুসারে আপনার তথ্য দিয়ে এবং নিজের পছন্দমতো পাসওয়ার্ড (কমপক্ষে ৬ অক্ষর) দিয়ে সাবমিট করতে হবে। এ সময় কুইজের নিয়মাবলি মেনে চলার অঙ্গীকার ব্যক্ত করে সাবমিট অপশনে ক্লিক করতে হবে।\nক্লিক করার পর অ্যাকাউন্ট ভেরিফাই করার জন্য আপনার ই–মেইলে একটি লিংক যাবে। ওই লিংকে ক্লিক করে ভেরিফাই করতে হবে।\nঅ্যাকাউন্ট ভেরিফাই করা ছাড়া আপনি লগইন করতে পারবেন না এবং প্রথম আলোর পাঠক কুইজে অংশ নিতে পারবেন না।",
  },
  {
    question: "ভেরিফাই করার জন্য নির্ধারিত ই–মেইল না পেলে কী করব?",
    answer: "আপনার ই–মেইলের স্প্যাম হোল্ডারটি চেক করবেন।",
  },
  {
    question: "ই–মেইল এবং ফোন নম্বর কি আবশ্যক?",
    answer: "নিবন্ধন করার জন্য ই–মেইল এবং ফোন নম্বর আবশ্যক।",
  },
  {
    question: "পাসওয়ার্ড ভুলে গেলে কী করব?",
    answer:
      "লগইন পেজে গিয়ে 'পাসওয়ার্ড ভুলে গেছেন?' অপশনে ক্লিক করে পাসওয়ার্ড রিসেট করতে পারবেন।",
  },
  {
    question: "অনলাইনে মহড়া কুইজ কত তারিখ অনুষ্ঠিত হবে?",
    answer:
      "তারিখ: ২ ও ৩ নভেম্বর ২০২৪\nসময়: সন্ধ্যা ৭টা থেকে ৭টা ১০ মিনিট পর্যন্ত",
  },
  {
    question: "কুইজ কবে অনুষ্ঠিত হবে?",
    answer:
      "তারিখ: ৫ নভেম্বর থেকে ১৪ নভেম্বর ২০২৪ পর্যন্ত (১০ দিন)\nসময়: সন্ধ্যা ৭টা থেকে ৭টা ১০ মিনিট পর্যন্ত।",
  },
  {
    question: "কীভাবে বিজয়ী নির্ধারণ করা হবে?",
    answer:
      "প্রতিদিন সবচেয়ে কম সময়ে সবচেয়ে বেশিসংখ্যক প্রশ্নের সঠিক উত্তরদাতা ১৫ জনকে বিজয়ী ঘোষণা করা হবে। কুইজ শেষ হওয়ার পর ফলাফল অনলাইনে প্রকাশিত হবে।",
  },
  {
    question: "পুরস্কার কী থাকবে?",
    answer:
      "প্রতিদিন জনপ্রতি ২,০০০ টাকা করে ১৫ জন বিজয়ী পাবেন মোট (২,০০০ × ১৫) = ৩০,০০০ টাকার গিফট চেক। ১০ দিনে মোট ৩,০০,০০০ টাকার গিফট চেক থাকবে।",
  },
  {
    question: "ফলাফল কোথায় পাব?",
    answer:
      "প্রতিদিনের কুইজ শেষ হওয়ার ২০ মিনিট পর (www.prothomalo.com/quiz) এই লিংকে ফলাফল বাটনে ক্লিক করে বিজয়ী ১৫ জনের নাম দেখতে পারবেন।",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="bg-white py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-8">
          জিজ্ঞাসা
        </h2>
        <div className="space-y-4">
          {faqData.map((item, idx) => (
            <div
              key={idx}
              className="border border-gray-200 rounded-md shadow-sm overflow-hidden"
            >
              <button
                onClick={() => toggle(idx)}
                className="w-full text-left px-5 py-4 bg-[#f9f9f9] hover:bg-[#f0f0f0] text-lg font-medium text-gray-800 flex justify-between items-center"
                aria-expanded={openIndex === idx}
                aria-controls={`faq-answer-${idx}`}
                id={`faq-question-${idx}`}
                type="button"
              >
                {item.question}
                <span className="text-2xl select-none">
                  {openIndex === idx ? "−" : "+"}
                </span>
              </button>
              <AnimatePresence initial={false}>
                {openIndex === idx && (
                  <motion.div
                    key="content"
                    id={`faq-answer-${idx}`}
                    role="region"
                    aria-labelledby={`faq-question-${idx}`}
                    initial="collapsed"
                    animate="open"
                    exit="collapsed"
                    variants={{
                      open: { opacity: 1, height: "auto", marginTop: 8 },
                      collapsed: { opacity: 0, height: 0, marginTop: 0 },
                    }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="px-5 pb-5 text-gray-700 text-base whitespace-pre-line overflow-hidden"
                  >
                    {item.answer}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
